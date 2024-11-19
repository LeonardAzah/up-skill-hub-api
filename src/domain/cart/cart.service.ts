import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    return this.cartsRepository.findOneOrCreate(
      { where: { user: { id } }, relations: ['items', 'items.course'] },
      () => new Cart({ user, items: [], total: 0 }),
    );
  }

  async removeFromCart(id: string, itemId: string) {
    const cart = await this.getCart(id);

    const cartItemIndex = cart.items.findIndex((item) => item.id === itemId);

    if (cartItemIndex === -1) {
      throw new NotFoundException('Course not in cart');
    }

    const cartItem = cart.items[cartItemIndex];

    cart.items.splice(cartItemIndex, 1);
    cart.total -= cartItem.price;

    await this.cartItemsRepository.remove(cartItem);
    await this.cartsRepository.create(cart);

    return cart;
  }

  async purchaseCourse(
    { id, email }: RequestUser,
    createPaymentDto: CreatePaymentDto,
  ) {
    const cart = await this.getCart(id);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException(
        'Cart is empty. Cannot proceed with purchase.',
      );
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    const amount = cart.total;
    const paymentIntent = await this.paymentService.create({
      amount,
      email: email,
      ...createPaymentDto,
    });
    if (paymentIntent.status === 'requires_confirmation') {
      try {
        await Promise.all(
          cart.items.map((item) => {
            this.coursesService.enrollToCourse(item.course.id, user);
          }),
        );

        cart.items = [];
        cart.total = 0;
        await this.cartsRepository.create(cart);
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to enroll courses after payment.',
        );
      }
    }

    return paymentIntent;
  }
}
