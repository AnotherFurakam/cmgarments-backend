import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/model/customer.entity';
import { Product } from 'src/model/product.entity';
import { Sale } from 'src/model/sale.entity';
import { SaleDetail } from 'src/model/sale_detail.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { GetSaleDto } from './dto/get-sale.dto';
import { CustomerResponseDto } from 'src/auth/dto/customer-response.dto';
import { PaginationQueryDto, PaginationResponseDto } from 'src/utils/paginate/dto';
import { plainToInstance } from 'class-transformer';
import { GetOnlySaleDto } from './dto/get-onlysale.dto';
import { GetSaleDetailDto } from './dto/get-saleDetail.dto';
import * as path from 'path';
import fs from 'fs';
import { google } from 'googleapis';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Purchase_detail } from 'src/model/purchase_detail.entity';
import { Entrance } from 'src/model/entrance.entity';
import { CreateEntranceDto } from 'src/entrance/dto/create.entrance.dto';
import { EntranceService } from 'src/entrance/entrance.service';
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

@Injectable()
export class SaleService {
    constructor(
    @InjectRepository(Entrance)
    private entranceRepository: Repository<Entrance>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    @InjectRepository(Purchase_detail)
    private purDetailRepository: Repository<Purchase_detail>,
    @InjectRepository(SaleDetail)
    private saledetailRepository: Repository<SaleDetail>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly entityManager: EntityManager,
    private readonly entranceService: EntranceService
) {}
    
    async create(createSaleDto: CreateSaleDto): Promise<GetSaleDto> {
    return await this.entityManager.transaction(
        async (transactionalEntityManager) => {
            console.log(createSaleDto.sale_details)
            // Buscar al cliente por ID
            const customer = await this.customerRepository.findOne({
            where: { id_customer: createSaleDto.id_customer },
            });
            if (!customer) {
            throw new HttpException(
                `El Customer '${createSaleDto.id_customer}', no se ha encontrado.`,
                HttpStatus.CONFLICT,
            );
            }

        

        // Crear los detalles de venta
        const saleDetails: SaleDetail[] = [];
        
        for (const saleDetailDto of createSaleDto.sale_details) {
            if (saleDetailDto.state) {
                const product = await this.productRepository.findOne({
                where: { id_product: saleDetailDto.product_id },
                });
                if (!product) {
                throw new HttpException(
                    `El producto '${saleDetailDto.product_id}', no se ha encontrado.`,
                    HttpStatus.CONFLICT,
                );
                }

                const saleDetail = new SaleDetail();
                saleDetail.product = product;
                saleDetail.units = saleDetailDto.quantity;
                saleDetail.price = product.price;

                saleDetails.push(saleDetail);
            }
        }

        if (saleDetails.length === 0) {
            throw new HttpException(
                'No se han agregado detalles de venta. Por favor, agregue al menos un detalle de venta.',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Crear la venta
        const sale = new Sale();
        sale.customer = customer;
        sale.total_cost = "0";

        const savedSale = await this.saleRepository.save(sale);

        // Asignar la venta guardada a los detalles de venta y guardar los detalles
        for (const saleDetail of saleDetails) {
            saleDetail.sale = savedSale;
            await this.saledetailRepository.save(saleDetail);
        }
        
        // Actualizar el costo total de la venta
        savedSale.total_cost = saleDetails
            .reduce((total, detail) => parseFloat(total.toString()) + (parseFloat(detail.price) * detail.units), 1)
            .toString();
        await this.saleRepository.save(savedSale);

        // Enviar email al cliente por la venta realizada
        await this.sendEmail(savedSale, saleDetails, customer);

        // Convertir la venta y sus detalles a GetSaleDto
        const getSaleDto = new GetSaleDto();
        Object.assign(getSaleDto, savedSale);

        const customerResponse = new CustomerResponseDto();
        Object.assign(customerResponse, customer);
        getSaleDto.customer = customerResponse;

        getSaleDto.sale_detail = saleDetails
        

        const data = plainToInstance(GetSaleDto, getSaleDto);

        return data;
    }
    );
    }

    async createPdf(sale: Sale, saleDetails: SaleDetail[], customer: Customer): Promise<Buffer> {
        pdfMake.fonts = {
            Roboto: {
                normal: "Roboto-Medium.ttf",
                bold: "Roboto-Medium.ttf",
                italics: "Roboto-Medium.ttf",
                bolditalics: "Roboto-Medium.ttf",
            },
        };          
        const docDefinition = {
            content: [
                {
                text: 'Detalle de la Venta',
                style: 'header',
                alignment: 'center',
                },
                {
                text: `Venta ID: ${sale.id_sale}`,
                style: 'subheader',
                },
                {
                text: `Cliente: ${customer.email}`,
                style: 'subheader',
                },
                {
                text: `Fecha: ${new Date().toLocaleDateString()}`,
                style: 'subheader',
                },
                {
                style: 'table',
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*', '*'],
                    body: [
                    [
                        { text: 'Producto', style: 'tableHeader' },
                        { text: 'Talla', style: 'tableHeader' },
                        { text: 'Unidades', style: 'tableHeader' },
                        { text: 'Precio Unitario', style: 'tableHeader' },
                        { text: 'Total', style: 'tableHeader' },
                    ],
                    ...saleDetails.map((detail) => [
                        detail.product.name,
                        detail.product.size,
                        detail.units,
                        `$${detail.price}`,
                        `$${parseFloat(detail.price) * detail.units}`,
                    ]),
                    [
                        '',
                        '',
                        '',
                        { text: 'Total:', style: 'tableHeader' },
                        { text: `$${sale.total_cost}`, style: 'tableHeader' },
                    ],
                    ],
                },
                },
            ],
            styles: {
                header: {
                    fontSize: 24,
                    bold: true,
                    margin: [0, 20, 0, 20],
                    decoration: 'underline',
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 5, 0, 5],
                },
                table: {
                    margin: [0, 15, 0, 15],
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    fillColor: '#f1f1f1',
                    alignment: 'center',
                },
            },
        };          
        
        return new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            const pdfDoc = pdfMake.createPdf(docDefinition);
        
            pdfDoc.getBuffer((buffer) => {
            resolve(Buffer.from(buffer));
            });
        });
    } 

    async sendEmail(sale: Sale, saleDetails: SaleDetail[], customer: Customer) {

        // Crear el archivo PDF
        const pdfBuffer = await this.createPdf(sale, saleDetails, customer);

        // Carga el archivo de credenciales de la API de Google.
        const credentialsPath = path.join(process.cwd(), 'src', 'json', 'client_secret_882418923951-hr9l43ga64qmvjgbh44ce0i2pijjchoa.apps.googleusercontent.com.json');
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
        
        // Carga el archivo token.json
        const tokenPath = path.join(process.cwd(), 'src', 'json', 'token.json');
        const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
        
        // Crea un cliente OAuth2 con las credenciales proporcionadas.
        const oauth2Client = new google.auth.OAuth2(
            credentials.web.client_id,
            credentials.web.client_secret,
            credentials.web.redirect_uris[0]
        );
    
        // Establece el token de acceso.
        oauth2Client.setCredentials(token);
    
        // Crea una instancia de Gmail.
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Construye el mensaje de correo electrónico en formato MIME con el archivo PDF adjunto.
        const boundary = 'someboundarystring';
        const rawMessage = `Content-Type: multipart/mixed; boundary=${boundary}\n` +
            `From: Cmgarments060@gmail.com\n` +
            `To: ${customer.email}\n` +
            `Subject: Venta realizada\n\n` +
            `--${boundary}\n` +
            `Content-Type: text/plain; charset="UTF-8"\n\n` +
            `Estimado ${customer.email},\n\nLe informamos que se ha realizado una venta con los siguientes detalles:\n\nVenta ID: ${sale.id_sale}\nTotal: $${sale.total_cost}\n\nGracias por su preferencia y por elegir nuestros productos. Estamos seguros de que disfrutará de su compra y de la calidad de nuestros productos. Su satisfacción es nuestra prioridad y nos enorgullecemos de ofrecer garantía y soporte en todos nuestros productos.\n\nEn este correo electrónico, encontrará adjunto un archivo PDF con el detalle completo de su compra. Si tiene alguna pregunta o necesita ayuda, no dude en ponerse en contacto con nosotros.\n\nAgradecemos su confianza y esperamos seguir siendo su opción preferida en el futuro.\n\nAtentamente,\n\nCMGarments\n\n` +
            `--${boundary}\n` +
            `Content-Type: application/pdf\n` +
            `Content-Disposition: attachment; filename="venta-${sale.id_sale}.pdf"\n` +
            `Content-Transfer-Encoding: base64\n\n` +
            pdfBuffer.toString('base64') + '\n' +
            `--${boundary}--`;

        // Codifica el mensaje en formato Base64.
        const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        // Envía el correo electrónico utilizando la API de Gmail.
        try {
            const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
            });
            console.log('Email enviado con éxito:', response.data);
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
}

    async findAll({ limit, page }: PaginationQueryDto) {
        const total = await this.saleRepository.count();
        const pages = Math.ceil(total / limit);
    
        if (page > pages) {
        if (total === 0) throw new BadRequestException('Aún no hay Ventas');
        throw new HttpException(
            `El número de página ${page} no existe.`,
            HttpStatus.BAD_REQUEST,
        );
        }
    
        const saleList = await this.saleRepository.find({
        relations: ['customer', 'sale_detail', 'sale_detail.product'],
        skip: (page - 1) * limit,
        take: limit,
        order: { create_at: 'ASC' },
        });
    
        const saleData = saleList.map((s: Sale) => plainToInstance(GetSaleDto, s));
    
        const data: PaginationResponseDto<GetOnlySaleDto[]> = {
        totalPages: pages,
        actualPage: page,
        nextPage: page < pages && pages > 0 ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        data: saleData,
        };
    
        return data;
    }

    async findAllDetails(pagination: PaginationQueryDto): Promise<PaginationResponseDto<GetSaleDetailDto[]>> {
        const { limit, page } = pagination;
        const total = await this.saledetailRepository.count();
        const pages = Math.ceil(total / limit);
        
        if (page > pages) {
            if (total === 0) throw new NotFoundException('Aún no hay detalles de venta');
            throw new BadRequestException(`El número de página ${page} no existe.`);
        }
        
        const saleDetails = await this.saledetailRepository.find({
            relations: ['sale', 'product'],
            skip: (page - 1) * limit,
            take: limit,
        });
        
        const saleDetailData = saleDetails.map((sd: SaleDetail) => plainToInstance(GetSaleDetailDto, sd));
        
        const data: PaginationResponseDto<GetSaleDetailDto[]> = {
            totalPages: pages,
            actualPage: page,
            nextPage: page < pages && pages > 0 ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            data: saleDetailData,
            };
        
        return data;
    }

    async findSaleDetails(id: string, pagination: PaginationQueryDto): Promise<PaginationResponseDto<GetSaleDetailDto[]>> {
        const { limit, page } = pagination;
        const total = await this.saledetailRepository.count();
        const pages = Math.ceil(total / limit);
        
        if (page > pages) {
            if (total === 0) throw new NotFoundException('Aún no hay detalles de venta');
            throw new BadRequestException(`El número de página ${page} no existe.`);
        }
        
        const saleDetails = await this.saledetailRepository.find({
            relations: ['sale', 'product'],
            where: { sale: { id_sale: id } },
            skip: (page - 1) * limit,
            take: limit,
        });

        if (!saleDetails) {
            throw new HttpException(
                `El producto '${id}', no se ha encontrado.`,
                HttpStatus.CONFLICT,
            );
        }
        
        const saleDetailData = saleDetails.map((sd: SaleDetail) => plainToInstance(GetSaleDetailDto, sd));
        
        const data: PaginationResponseDto<GetSaleDetailDto[]> = {
            totalPages: pages,
            actualPage: page,
            nextPage: page < pages && pages > 0 ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            data: saleDetailData,
            };
        
        return data;
    }

    async remove(id: string) {

        const initialValuesE: CreateEntranceDto = {
            description: "Devolución-",
            units: 0,
            unit_cost: 0,
            id_purchase_detail: ""
        };
        // Buscamos la venta que queremos eliminar mediante su id
        const saleToRemove = await this.saleRepository.findOne({
        relations: ['sale_detail', 'sale_detail.product'],
        where: { id_sale: id },
        });
    
        // Si la venta no fue encontrada o su propiedad is_delete no es null devolvemos un error
        if (!saleToRemove || saleToRemove.is_delete)
        throw new HttpException(
            `La venta con el id '${id} no fue encontrada o ya fue removida.'`,
            HttpStatus.NOT_FOUND,
        );

        // Actualizamos el estado is_delete de todos los detalles de venta relacionados a la venta
        // Agregar entrada de devolucion y sumar el stock del producto
        await Promise.all(
        saleToRemove.sale_detail.map(async (detail) => {
                detail.is_delete = true;
                const productExist = await this.productRepository.findOne({
                    relations: ['brand'],
                    where: { id_product: detail.product.id_product },
                });
                
                initialValuesE.description += productExist.name+"-"+productExist.size+"-"+productExist.brand.name
                initialValuesE.id_purchase_detail = productExist.id_product+"l"
                initialValuesE.unit_cost = parseFloat(detail.price)
                initialValuesE.units = detail.units

                await this.entranceService.create(initialValuesE)
                await this.saledetailRepository.save(detail);
                initialValuesE.description = "Devolución-"
            })
        );
        
        // Actualizamos el estado is_delete de la venta a true
        saleToRemove.is_delete = true;
        await this.saleRepository.save(saleToRemove);
            
        // Retornamos los datos de la venta eliminada hacia el cliente
        return plainToInstance(GetSaleDto, saleToRemove);
    }
}
