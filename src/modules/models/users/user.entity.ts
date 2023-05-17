import { Column, Entity, Unique } from 'typeorm';

import { BaseEntity } from '../base/base.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends BaseEntity {
  @Column()
  email: string;
}
