import { AbstractEntity, RegistryDates } from 'common';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profile: string;

  @Column()
  role: string;
  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;
}
