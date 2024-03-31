import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MenuEntity } from './Menu.entity';

@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MenuEntity, (menu) => menu.restaurant)
  menus: MenuEntity[];

  @Column()
  title: string;

  @Column()
  googlePlaceId: string;

  @Column()
  url: string;
}
