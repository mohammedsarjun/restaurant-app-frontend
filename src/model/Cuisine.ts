export interface Cuisine {
    id: number;
    name: string;
    description: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CuisineFormValues {
    name: string;
    description?: string;
}
