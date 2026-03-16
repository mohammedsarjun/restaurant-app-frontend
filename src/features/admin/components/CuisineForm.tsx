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
import { Add, Edit, Close } from "@mui/icons-material";
import type { Cuisine, CuisineFormValues } from "../../../model/Cuisine";
import { z } from "zod";

const cuisineSchema = z.object({
    name: z.string().min(1, "Name is required").refine((val) => val.trim().length > 0, "Name cannot be only spaces"),
    description: z.string().optional(),
});

type CuisineFormErrors = Partial<Record<keyof z.infer<typeof cuisineSchema>, string>>;

const toFormValues = (c: Cuisine): CuisineFormValues => ({
    name: c.name,
    description: c.description || "",
});

const EMPTY_FORM: CuisineFormValues = {
    name: "",
    description: "",
};

interface CuisineFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (values: CuisineFormValues) => void;
    initial: Cuisine | null;
}

const SlideUp = (props: TransitionProps & { children: ReactElement }) => (
    <Slide direction="up" {...props} />
);

export const CuisineForm: FC<CuisineFormProps> = memo(({ open, onClose, onSave, initial }) => {
    const [form, setForm] = useState<CuisineFormValues>(
        initial ? toFormValues(initial) : EMPTY_FORM
    );
    const [errors, setErrors] = useState<CuisineFormErrors>({});

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((errs) => ({ ...errs, [name]: undefined }));
    }, []);

    const handleSave = useCallback(() => {
        const result = cuisineSchema.safeParse(form);
        if (!result.success) {
            const newErrors: CuisineFormErrors = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    const key = err.path[0] as keyof CuisineFormErrors;
                    if (!newErrors[key]) {
                        newErrors[key] = err.message;
                    }
                }
            });
            setErrors(newErrors);
            return;
        }

        onSave({ ...result.data } as CuisineFormValues);
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
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(200,169,110,0.1)", pb: 2 }}>
                <Typography variant="h5" sx={{ color: "#C8A96E" }}>
                    {initial ? "Edit Cuisine" : "Add Cuisine"}
                </Typography>
                <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: "24px !important" }}>
                <Stack spacing={2.5}>
                    <TextField
                        fullWidth
                        label="Cuisine Name *"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, gap: 1, borderTop: "1px solid rgba(200,169,110,0.1)" }}>
                <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ borderColor: "rgba(255,255,255,0.1)", color: "text.secondary" }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} startIcon={initial ? <Edit /> : <Add />}>
                    {initial ? "Save Changes" : "Add Cuisine"}
                </Button>
            </DialogActions>
        </Dialog>
    );
});
