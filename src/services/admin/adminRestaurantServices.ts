import axios from "../../api/axios";
import { ADMIN_ENDPOINTS } from "../../endpoints/adminEndPoints";
import type { ApiResponse } from "../../model/ApiResponse";
import type { Restaurant } from "../../model/Restaurant";

import type { RestaurantFormValues } from "../../model/RestaurantFormValues";

export const getAllRestaurants = async (page:number,limit:number,search:string) => {
  const response = await axios.get(ADMIN_ENDPOINTS.GET_ALL_RESTAURANTS,{
    params:{
      page,
      limit,
      search
    }
  });
  return response.data;
};

export const getRestaurantById = async (id: string) => {
  const response = await axios.get(ADMIN_ENDPOINTS.GET_RESTAURANT_BY_ID.replace(":id", id));
  return response.data;
};

export const createRestaurant = async (data: RestaurantFormValues):Promise<ApiResponse<Restaurant>> => {
  const response = await axios.post(ADMIN_ENDPOINTS.CREATE_RESTAURANT, data);
  return response.data;
};

export const updateRestaurant = async (id: string, data: Restaurant):Promise<ApiResponse<Restaurant>> => {
  const response = await axios.put(ADMIN_ENDPOINTS.UPDATE_RESTAURANT.replace(":id", id), data);
  return response.data;
};

export const deleteRestaurant = async (id: string) => {
  const response = await axios.delete(ADMIN_ENDPOINTS.DELETE_RESTAURANT.replace(":id", id));
  return response.data;
};