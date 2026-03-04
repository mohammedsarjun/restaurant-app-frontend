import type { AlertColor } from "@mui/material/Alert";

export interface SnackbarState {
  open: boolean;
  msg: string;
  sev: AlertColor;
}
