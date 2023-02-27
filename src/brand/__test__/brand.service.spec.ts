import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from '../brand.service';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { PaginationQueryDto } from '../../utils/paginate/dto';
import { GetBrandDto } from '../dto/get-brand.dto';
import { BrandController } from '../brand.controller';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { plainToInstance } from 'class-transformer';

describe('BrandController', () => {
  let brandService: BrandService;

  const mockBrandService = {
    create: jest
      .fn()
      .mockImplementation(async (dto: CreateBrandDto): Promise<GetBrandDto> => {
        return {
          id_brand: '',
          createAt: new Date(Date.now()),
          ...dto,
        } as GetBrandDto;
      }),
    update: jest
      .fn()
      .mockImplementation(
        async (id: string, dto: UpdateBrandDto): Promise<GetBrandDto> => {
          return {
            id_brand: id,
            createAt: new Date(),
            ...dto,
          } as GetBrandDto;
        },
      ),
    findOne: jest.fn,
    findAll: jest.fn,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [BrandService],
    })
      .overrideProvider(BrandService)
      .useValue(mockBrandService)
      .compile();

    brandService = module.get<BrandService>(BrandService);
  });

  //Testing create func

  it('El método create devuelve los datos esperados', async () => {
    //*Creando un espía para la función create
    const createBrandSpy = jest.spyOn(brandService, 'create');

    //*Creando el dto con los datos
    const dto: CreateBrandDto = {
      name: 'Genérico',
    };

    //*Ejecutando función create
    const response = await brandService.create(dto);
    const result = plainToInstance(GetBrandDto, response);

    //* Test

    //* Comprobando si se le pasaron los parámetros correctos a la función create
    expect(createBrandSpy).toHaveBeenCalledWith(dto);

    //* Comprobando que el relustado sea de la instancia correcta
    expect(result).toBeInstanceOf(GetBrandDto);

    //* Comprobando que el dato de respuesta sea el esperado
    expect(result).toEqual({
      id_brand: expect.any(String),
      name: 'Genérico',
      createAt: expect.any(String),
    } as GetBrandDto);
  });

  //Testing update func
  it('El método update devuelve los datos esperados', async () => {
    //* Creando un espía para la funcion update
    const createBrandSpy = jest.spyOn(brandService, 'update');

    //*
    const dto: UpdateBrandDto = {
      name: 'Genérico',
    };

    //*Ejecutando función update
    const response = await brandService.update('id_brand', dto);
    const result = plainToInstance(GetBrandDto, response);

    //* Test

    //*Comprobando que se le pasan los parámetros correctos a la fn update
    expect(createBrandSpy).toHaveBeenCalledWith('id_brand', dto);

    //*Comprobando que el resultado sea de la instancia correcta
    expect(result).toBeInstanceOf(GetBrandDto);

    //*Comprobando que el dato de respuesta sea el esperado
    expect(result).toEqual({
      id_brand: expect.any(String),
      name: 'Genérico',
      createAt: expect.any(String),
    } as GetBrandDto);
  });

  //Testing findOne func
  it('Llamar al método findOne con los parámetros esperados', async () => {
    const createBrandSpy = jest.spyOn(brandService, 'findOne');

    const id = 'id_brand';
    brandService.findOne(id);
    expect(createBrandSpy).toHaveBeenCalledWith(id);
  });

  it('Llamar al método findAll con los parámetros esperados', async () => {
    const createBrandSpy = jest.spyOn(brandService, 'findAll');
    const paginationDto = new PaginationQueryDto();
    brandService.findAll(paginationDto);
    expect(createBrandSpy).toHaveBeenCalledWith(paginationDto);
  });
});
