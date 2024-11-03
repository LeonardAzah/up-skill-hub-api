import { AuthRefreshToken } from 'auth/entities/auth-refresh-token.entity';
import { Role } from 'auth/roles/enums/roles.enum';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'common';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
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

  @CreateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => AuthRefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: AuthRefreshToken[];

  get isDeleted() {
    return !!this.deletedAt;
  }
}
