import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { Response } from 'express';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, res: Response) {
    const newCategory = new this.categoryModel(createCategoryDto);
    await newCategory.save();
    res.status(201).json({
      message: 'Category created successfully',
      data: newCategory,
    });
  }

  async findAll(res: Response) {
    const categories = await this.categoryModel.find();
    return res.status(200).json({
      message: 'Categories fetched successfully',
      data: categories,
    });
  }

  async findOne(id: number) {}

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    console.log(id);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
