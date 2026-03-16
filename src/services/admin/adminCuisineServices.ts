import api from "../../api/axios";
import { ADMIN_ENDPOINTS } from "../../endpoints/adminEndPoints";
import type { Cuisine, CuisineFormValues } from "../../model/Cuisine";
import type { ApiResponse } from "../../model/ApiResponse";

export const createCuisine = async (data: CuisineFormValues): Promise<ApiResponse<Cuisine>> => {
    try {
        const response = await api.post<ApiResponse<Cuisine>>(ADMIN_ENDPOINTS.CREATE_CUISINE, data);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, message: "An unexpected error occurred" };
    }
};

export const updateCuisine = async (id: number, data: Partial<CuisineFormValues>): Promise<ApiResponse<Cuisine>> => {
    try {
        const url = ADMIN_ENDPOINTS.UPDATE_CUISINE.replace(":id", id.toString());
        const response = await api.put<ApiResponse<Cuisine>>(url, data);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, message: "An unexpected error occurred" };
    }
};

export const getAllCuisines = async (page: number, limit: number, search: string): Promise<ApiResponse<{ cuisines: Cuisine[], totalPages: number }>> => {
    try {
        const response = await api.get<ApiResponse<{ cuisines: Cuisine[], totalPages: number }>>(ADMIN_ENDPOINTS.GET_ALL_CUISINES, {
            params: { page, limit, search }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, message: "An unexpected error occurred" };
    }
};

export const getAllActiveCuisines = async (): Promise<ApiResponse<Cuisine[]>> => {
    try {
        const response = await api.get<ApiResponse<Cuisine[]>>(ADMIN_ENDPOINTS.GET_ACTIVE_CUISINES);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, message: "An unexpected error occurred" };
    }
};

export const deleteCuisine = async (id: number): Promise<ApiResponse<null>> => {
    try {
        const url = ADMIN_ENDPOINTS.DELETE_CUISINE.replace(":id", id.toString());
        const response = await api.delete<ApiResponse<null>>(url);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, message: "An unexpected error occurred" };
    }
};
