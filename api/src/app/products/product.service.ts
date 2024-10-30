// apps/api/src/products/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    const savedProduct = await product.save();
    
    // Notify connected clients about the new product
    this.websocketGateway.emitUpdate('productCreated', savedProduct);
    
    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
      
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Notify connected clients about the update
    this.websocketGateway.emitUpdate('productUpdated', updatedProduct);

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Notify connected clients about the deletion
    this.websocketGateway.emitUpdate('productDeleted', { id });
  }
}
