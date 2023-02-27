import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from '../brand.controller';
import { BrandService } from '../brand.service';
import { Brand } from '../../model/brand.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from '../../utils/paginate/dto';
import { GetBrandDto } from '../dto/get-brand.dto';

describe('BrandController', () => {
  let brandController: BrandController;
  let brandService: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        BrandService,
        {
          provide: getRepositoryToken(Brand),
          useValue: {
            create: jest.fn,
            update: jest.fn,
            findOne: jest.fn,
          },
        },
      ],
    }).compile();

    brandController = module.get<BrandController>(BrandController);
    brandService = module.get<BrandService>(BrandService);
  });

  it('should be defined', () => {
    expect(brandController).toBeDefined();
  });

  //Probando los métodos del controlador
  describe('getBrands', () => {
    it('El dato retornado es de tipo PaginationResponseDto<GetBrandDto>', async () => {
      const resultPromise: PaginationResponseDto<GetBrandDto[]> = {
        actualPage: 1,
        nextPage: 2,
        prevPage: null,
        totalPages: undefined,
        data: [],
      };

      jest
        .spyOn(brandService, 'findAll')
        .mockImplementation(
          () =>
            resultPromise as undefined as Promise<
              PaginationResponseDto<GetBrandDto[]>
            >,
        );

      const query: PaginationQueryDto = {
        limit: 10,
        page: 1,
      };
      const result = await brandController.findAll(query);

      //Comprobando que la información extraida sea mayor a 1
      //expect(result).toHaveLength(1);

      //Comprobando que la información extraida sea el tipo de dato esperado
      expect(result instanceof PaginationResponseDto<GetBrandDto[]>).toEqual(
        true,
      );

      //Comprobando que la cantidad de peticiones hechas al servicio sea 1
      expect(brandService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
