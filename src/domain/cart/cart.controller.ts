import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart';
import { CurrentUser } from 'common/Decorators/current-user.decorator';
import { RequestUser } from 'common/interfaces/request-user.interface';
import { IdDto } from 'common';
import { CreatePaymentDto } from 'payments/dto/create-payment.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(
    @CurrentUser() { id }: RequestUser,
    @Body() { courseId }: AddToCartDto,
  ) {
    return this.cartService.addToCart(id, courseId);
  }

  @Post('purchase')
  async PurchseCourse(
    @CurrentUser() user: RequestUser,
    createPaymentDto: CreatePaymentDto,
  ) {
    return this.cartService.purchaseCourse(user, createPaymentDto);
  }

  @Get()
  async getCart(@CurrentUser() { id }: RequestUser) {
    return this.cartService.getCart(id);
  }

  @Delete()
  async removeFromCart(
    @CurrentUser() user: RequestUser,
    @Body() { id }: IdDto,
  ) {
    return this.cartService.removeFromCart(user.id, id);
  }
}
