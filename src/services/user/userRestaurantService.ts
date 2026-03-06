import axios from "../../api/axios";
import { USER_ENDPOINTS } from "../../endpoints/userEndPoints";

export const getAllUserRestaurants = async () => {
  const response = await axios.get(USER_ENDPOINTS.GET_ALL_RESTAURANTS);
  return response.data;
};

export const getUserRestaurantById = async (id: string) => {
  const response = await axios.get(USER_ENDPOINTS.GET_RESTAURANT_BY_ID.replace(":id", id));
  return response.data;
};
