export type RestaurantStatus = "active" | "inactive";

export interface Restaurant {
  id: any;
  name: string;
  address: string;
  contact: string;
  description: string;
  cuisineId: number;
  cuisine?: { id: number; name: string };
  rating: number;
  tables: number;
  status: RestaurantStatus;
  createdAt: Date;
}
