export class CreateRestaurantRequestDto {
  title: string;
  url: string;
  googlePlaceId: string;
  menus: MenuDto[];
}

export class MenuDto {
  title: string;
  price: number;
}
