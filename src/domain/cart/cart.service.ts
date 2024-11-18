import { Injectable } from '@nestjs/common';
import { CartsRepository } from './cart.repository';
import { CartItemsRepository } from './cart-item.repository';
import { CourseRepository } from 'course/course.repository';
import { UsersRepository } from 'users/users.reposisoty';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CourseService } from 'course/course.service';
import { RequestUser } from 'auth/interfaces/request-user.interface';
import { PaymentsService } from 'payments/payments.service';
import { CreateChargeDto } from 'payments/dto/create-charge.dto';
import { CreatePaymentDto } from 'payments/dto/create-payment.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartsRepository: CartsRepository,
    private readonly cartItemsRepository: CartItemsRepository,
    private readonly coursesRepository: CourseRepository,
    private readonly coursesService: CourseService,
    private readonly paymentService: PaymentsService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async addToCart(id: string, courseId: string) {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    const cart = await this.getCart(id);

    const existingItem = cart.items.find(
      (item) => item.course.id === course.id,
    );
    if (existingItem) return;

    const cartItem = new CartItem({ cart, course, price: course.price });

    await this.cartItemsRepository.create(cartItem);

    cart.items.push(cartItem);
    cart.total += course.price;

    return this.cartsRepository.create(cart);
  }

  async getCart(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    let cart = await this.cartsRepository.findOne({
      where: { user: { id } },
      relations: ['items', 'items.course'],
    });

    if (!cart) {
      cart = new Cart({ user, items: [], total: 0 });
      await this.cartsRepository.create(cart);
    }
    return cart;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async removeFromCart(id: string, courseId: string) {
    const cart = await this.getCart(id);

    const cartItemIndex = cart.items.findIndex(
      (item) => item.course.id === courseId,
    );

    const cartItem = cart.items[cartItemIndex];

    cart.items.splice(cartItemIndex, 1);
    cart.total -= cartItem.price;

    await this.cartItemsRepository.remove(cartItem);
    await this.cartsRepository.create(cart);

    return cart;
  }

  async clearCart(id: string): Promise<Cart> {
    const cart = await this.getCart(id);

    cart.items.forEach(async (item) => {
      await this.cartItemsRepository.remove(item);
    });

    cart.items = [];
    cart.total = 0;

    await this.cartsRepository.create(cart);
    return cart;
  }

  async purchaseCourse(id: string, createPaymentDto: CreatePaymentDto) {
    const cart = await this.getCart(id);
    const amount = cart.total;
    const paymentIntent = await this.paymentService.create({
      amount,
      ...createPaymentDto,
    });
    if (paymentIntent.status === 'succeeded') {
      cart.items.forEach(async (item) => {
        await this.coursesService.enrollToCourse(item.course.id, cart.user);
      });
    }

    return paymentIntent;
  }
}
