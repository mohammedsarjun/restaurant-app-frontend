import {

    memo,

} from "react";

import type {
    FC,


} from "react";
import {

    Typography,
 
    Button,

    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Fade,

} from "@mui/material";


import {

    Warning,

} from "@mui/icons-material";



interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = memo(({ open, title, message, onConfirm, onCancel }) => (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth TransitionComponent={Fade}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
            <Warning sx={{ color: "error.main", fontSize: 22 }} />
            <Typography variant="h6">{title}</Typography>
        </DialogTitle>
        <DialogContent>
            <Typography variant="body1" color="text.secondary" sx={{ pt: 1 }}>
                {message}
            </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button
                onClick={onCancel}
                variant="outlined"
                color="inherit"
                sx={{ borderColor: "rgba(255,255,255,0.1)", color: "text.secondary" }}
            >
                Cancel
            </Button>
            <Button
                onClick={onConfirm}
                variant="contained"
                sx={{
                    background: "linear-gradient(135deg,#E07070,#C05050) !important",
                    "&:hover": { background: "linear-gradient(135deg,#F08080,#E07070) !important", transform: "translateY(-1px)" },
                }}
            >
                Delete
            </Button>
        </DialogActions>
    </Dialog>
));