import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RestaurantEntity } from './Restaurant.entity';

@Entity()
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.menus)
  restaurant: RestaurantEntity;

  @Column()
  title: string;

  @Column()
  price: number;
}
