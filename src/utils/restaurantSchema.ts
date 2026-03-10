import { z } from "zod";

const normalizedString = (label: string) =>
    z
        .string()
        .min(1, `${label} is required`)
        .refine((val) => val.trim().length > 0, `${label} cannot be only spaces`)
        .refine((val) => !/^\s/.test(val), `${label} should not start with a space`)
        .refine((val) => !/\s$/.test(val), `${label} should not end with a space`)
        .refine((val) => !/\s{2,}/.test(val), `${label} should not contain multiple consecutive spaces`);

export const restaurantSchema = z.object({
    name: normalizedString("Restaurant name"),
    address: normalizedString("Address"),
    contact: normalizedString("Contact"),
    description: normalizedString("Description"),
    cuisine: normalizedString("Cuisine"),
    rating: z
        .string()
        .min(1, "Rating is required")
        .refine((val) => !isNaN(Number(val)), "Rating must be a number")
        .refine(
            (val) => Number(val) >= 1,
            "Rating must be at least 1"
        )
        .refine(
            (val) => Number(val) <= 5,
            "Rating must not exceed 5"
        ),
    tables: z
        .string()
        .min(1, "Tables is required")
        .refine((val) => !isNaN(Number(val)), "Tables must be a number")
        .refine(
            (val) => Number.isInteger(Number(val)),
            "Tables must be a whole number"
        )
        .refine(
            (val) => Number(val) >= 1,
            "Tables must be at least 1"
        )
        .refine(
            (val) => Number(val) <= 20,
            "Tables must not exceed 20"
        ),
    status: z.enum(["active", "inactive"]),
});

export type RestaurantSchemaErrors = Partial<
    Record<keyof z.infer<typeof restaurantSchema>, string>
>;
