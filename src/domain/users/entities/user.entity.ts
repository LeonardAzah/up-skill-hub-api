import { AuthRefreshToken } from 'auth/entities/auth-refresh-token.entity';
import { Role } from 'auth/roles/enums/roles.enum';
import { Cart } from 'cart/entities/cart.entity';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'common';
import { Course } from 'course/entities/course.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
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

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart;

  get isDeleted() {
    return !!this.deletedAt;
  }
}
