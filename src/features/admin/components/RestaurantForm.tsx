import {
    useState,
    useCallback,
    memo,

} from "react";

import type {
    FC,
    ChangeEvent,
    ReactElement,
} from "react";
import {
    Typography,
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    Stack,


} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";

import {
    Add,
    Edit,
    Close,
} from "@mui/icons-material";


// ═══════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════

import type { Restaurant } from "../../../model/Restaurant";
import type { RestaurantFormValues } from "../../../model/RestaurantFormValues";
import type { FormErrors } from "../../../model/FormErrors";
import { restaurantSchema } from "../../../utils/restaurantSchema";


const toFormValues = (r: Restaurant): RestaurantFormValues => ({
    name: r.name,
    address: r.address,
    contact: r.contact,
    description: r.description,
    cuisine: r.cuisine,
    rating: String(r.rating),
    tables: String(r.tables),
    status: r.status,
});

const EMPTY_FORM: RestaurantFormValues = {
    name: "",
    address: "",
    contact: "",
    description: "",
    cuisine: "",
    rating: "",
    tables: "",
    status: "active",
};

interface RestaurantFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (values: RestaurantFormValues) => void;
    /** Pass a full Restaurant when editing; null / undefined when adding. */
    initial: Restaurant | null;
}

const SlideUp = (props: TransitionProps & { children: ReactElement }) => (
    <Slide direction="up" {...props} />
);

export const RestaurantForm: FC<RestaurantFormProps> = memo(({ open, onClose, onSave, initial }) => {
    const [form, setForm] = useState<RestaurantFormValues>(
        initial ? toFormValues(initial) : EMPTY_FORM
    );
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((errs) => ({ ...errs, [name]: undefined }));
    }, []);

    const handleSave = useCallback(() => {
        const result = restaurantSchema.safeParse(form);
        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    const key = err.path[0] as keyof FormErrors;
                    if (!newErrors[key]) {
                        newErrors[key] = err.message;
                    }
                }
            });
            setErrors(newErrors);
            return;
        }

        onSave({ ...result.data });
        setForm(EMPTY_FORM);
        setErrors({});
    }, [form, onSave]);

    const handleClose = useCallback(() => {
        setForm(EMPTY_FORM);
        setErrors({});
        onClose();
    }, [onClose]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth TransitionComponent={SlideUp}>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(200,169,110,0.1)",
                    pb: 2,
                }}
            >
                <Typography variant="h5" sx={{ color: "#C8A96E" }}>
                    {initial ? "Edit Restaurant" : "Add Restaurant"}
                </Typography>
                <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: "24px !important" }}>
                <Stack spacing={2.5}>
                    <TextField
                        fullWidth
                        label="Restaurant Name *"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        fullWidth
                        label="Address *"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                    />
                    <TextField
                        fullWidth
                        label="Contact *"
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                        error={!!errors.contact}
                        helperText={errors.contact}
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField
                            fullWidth
                            label="Cuisine *"
                            name="cuisine"
                            value={form.cuisine}
                            onChange={handleChange}
                            error={!!errors.cuisine}
                            helperText={errors.cuisine}
                        />
                        <TextField
                            fullWidth
                            label="Rating (0–5) *"
                            name="rating"
                            type="number"
                            value={form.rating}
                            onChange={handleChange}
                            inputProps={{ min: 0, max: 5, step: 0.1 }}
                            error={!!errors.rating}
                            helperText={errors.rating}
                        />
                        <TextField
                            fullWidth
                            label="Tables *"
                            name="tables"
                            type="number"
                            value={form.tables}
                            onChange={handleChange}
                            inputProps={{ min: 1 }}
                            error={!!errors.tables}
                            helperText={errors.tables}
                        />
                    </Stack>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description *"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, gap: 1, borderTop: "1px solid rgba(200,169,110,0.1)" }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderColor: "rgba(255,255,255,0.1)", color: "text.secondary" }}
                >
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} startIcon={initial ? <Edit /> : <Add />}>
                    {initial ? "Save Changes" : "Add Restaurant"}
                </Button>
            </DialogActions>
        </Dialog>
    );
});
