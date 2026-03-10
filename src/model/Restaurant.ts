export type RestaurantStatus = "active" | "inactive";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  contact: string;
  description: string;
  cuisine: string;
  rating: number;
  tables: number;
  status: RestaurantStatus;
  createdAt: Date;
}
