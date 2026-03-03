import {
    useState,
    useCallback,
    memo,

} from "react";

import type {
    FC,
    ReactNode,
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
import type { AlertColor } from "@mui/material/Alert";
import type { TransitionProps } from "@mui/material/transitions";

import {
    Add,
    Edit,
    Close,
} from "@mui/icons-material";


// ═══════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════

export type RestaurantStatus = "active" | "inactive";

export type ViewType = "user" | "admin" | "details";

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

/** Raw form values — all fields are strings while the user is editing */
export interface RestaurantFormValues {
    name: string;
    address: string;
    contact: string;
    description: string;
    cuisine: string;
    rating: string;
    tables: string;
    status: RestaurantStatus;
}

export interface FormErrors {
    name?: string;
    address?: string;
    contact?: string;
    description?: string;
}

export interface SnackbarState {
    open: boolean;
    msg: string;
    sev: AlertColor;
}

export interface NavItem {
    key: ViewType;
    label: string;
    icon: ReactNode;
}

export interface StatDefinition {
    icon: ReactNode;
    label: string;
    value: string | number;
    color: string;
    trend?: string;
}

export interface DashboardStats {
    total: number;
    active: number;
    avgRating: string;
    tables: number;
}



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

    const validate = useCallback((): FormErrors => {
        const e: FormErrors = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.address.trim()) e.address = "Address is required";
        if (!form.contact.trim()) e.contact = "Contact is required";
        if (!form.description.trim()) e.description = "Description is required";
        return e;
    }, [form]);

    const handleSave = useCallback(() => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        onSave({ ...form });
        setForm(EMPTY_FORM);
        setErrors({});
    }, [form, validate, onSave]);

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
                        <TextField fullWidth label="Cuisine" name="cuisine" value={form.cuisine} onChange={handleChange} />
                        <TextField
                            fullWidth
                            label="Rating (0–5)"
                            name="rating"
                            type="number"
                            value={form.rating}
                            onChange={handleChange}
                            inputProps={{ min: 0, max: 5, step: 0.1 }}
                        />
                        <TextField
                            fullWidth
                            label="Tables"
                            name="tables"
                            type="number"
                            value={form.tables}
                            onChange={handleChange}
                            inputProps={{ min: 1 }}
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
