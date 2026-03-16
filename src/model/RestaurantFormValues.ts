import type { RestaurantStatus } from "./Restaurant";

/** Raw form values — all fields are strings while the user is editing */
export interface RestaurantFormValues {
  name: string;
  address: string;
  contact: string;
  description: string;
  cuisineId: string | number;
  rating: string;
  tables: string;
  status: RestaurantStatus;
}
