import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import {
  CreateCategoryDto,
  ResponseCategoryDto,
  UpdateCategoryDto,
} from './dto';
import { Category } from '../model/category.entity';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/utils/paginate/dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  //? Crear CATEGORIA (POST)
  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    // obtener categoria por name
    const category = await this.categoryRepository.findOne({
      where: { name },
    });

    // verificar si existe
    if (category)
      throw new ConflictException(
        `La Categoría con el nombre "${name}" ya existe`,
      );

    //* guardar categoria
    const createCategory = await this.categoryRepository.save(
      createCategoryDto,
    );

    // convertimos de tipo "Category" a "ResponseCategoryDto"
    const data = plainToInstance(ResponseCategoryDto, createCategory);

    return data;
  }

  //? Obtener todas las CATEGORIAS (GET)
  // limit -> cantidad de categorias
  // page -> página que desea
  async findAll({ limit, page }: PaginationQueryDto) {
    // obtener total y páginas de Categoria
    const total = await this.categoryRepository.count();
    const pages = Math.ceil(total / limit);

    // verificar que la página solicitada no sea mayor a las páginas totales
    if (page > pages) {
      if (total === 0) throw new BadRequestException('Aun no hay Categorías');
      throw new BadRequestException(`El número de página ${page} no existe`);
    }

    //* obtener categorías
    // skip -> desde que posición
    // take -> cantidad
    const categories = await this.categoryRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    // convertimos de tipo "Category[]" a "ResponseCategoryDto[]"
    const categoryData = categories.map((c) =>
      plainToInstance(ResponseCategoryDto, c),
    );

    // respuesta
    const data: PaginationResponseDto<ResponseCategoryDto[]> = {
      totalPages: pages,
      actualPage: page,
      nextPage: page < pages && pages > 0 ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data: categoryData,
    };

    return data;
  }

  //? Obtener CATEGORIA por ID (GET)
  async findOne(id: string) {
    //* Obtener categoria por id
    const category = await this.getById(id);

    // convertimos de tipo "Category" a "ResponseCategoryDto"
    const data = plainToInstance(ResponseCategoryDto, category);

    return data;
  }

  //? Actualizar CATEGORIA por ID (PUT)
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // obtener categoria por id
    const category = await this.getById(id);

    //* Actualizar Categoría
    this.categoryRepository.merge(category, updateCategoryDto);

    //* Guardar Categoría
    const updateCategory = await this.categoryRepository.save(category);

    // convertimos de tipo "Category" a "ResponseCategoryDto"
    const data = plainToInstance(ResponseCategoryDto, updateCategory);

    return data;
  }

  //? Eliminar CATEGORIA por ID (DELETE)
  async remove(id: string) {
    // obtener categoria por id
    const category = await this.getById(id);

    //* Eliminar Categoría
    const deleteCategory = await this.categoryRepository.softDelete(id);

    if (!deleteCategory.affected)
      throw new NotFoundException(`La Categoría con el id "${id}" no existe`);

    // convertimos de tipo "Category" a "ResponseCategoryDto"
    const data = plainToInstance(ResponseCategoryDto, category);

    return data;
  }

  //*  Obtener CATEGORIA por ID (Método)
  private async getById(id: string) {
    // Obtener categoria por id
    const category = await this.categoryRepository.findOne({
      where: { id_category: id },
    });

    // verificar si existe
    if (!category)
      throw new NotFoundException(`La Categoría con el id "${id}" no existe`);

    return category;
  }
}
