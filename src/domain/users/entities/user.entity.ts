import { AuthRefreshToken } from 'auth/entities/auth-refresh-token.entity';
import { Role } from 'common/enums/roles.enum';
import { Cart } from 'cart/entities/cart.entity';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'common';
import { Course } from 'course/entities/course.entity';
import { Review } from 'reviews/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  profile: string;

  @Column({ nullable: true })
  providerId: string;

  @Column({ nullable: true })
  otpVerification: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpires: Date;

  @Column({ nullable: true })
  fcmToken: string;

  @Column({ nullable: true })
  otpVerificationExpirationDate: Date;

  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'role_enum',
    default: Role.STUDENT,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => AuthRefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: AuthRefreshToken[];

  @OneToMany(() => Course, (course) => course.owner)
  ownedCourses: Course[];

  @ManyToMany(() => Course, (course) => course.enrolledStudents)
  @JoinTable({ name: 'enrolled_courses' })
  enrolledCourses: Course[];

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  get isDeleted() {
    return !!this.deletedAt;
  }
}
