import {
  useState,
  useMemo,
  useCallback,
  memo,

} from "react";

import type {
  FC,
} from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,

  Button,

  Snackbar,
  Alert,

  Stack,
  AppBar,
  Toolbar,

  useMediaQuery,
} from "@mui/material";
import type { AlertColor } from "@mui/material/Alert";

import {
  Restaurant as RestaurantIcon,
  People,
  AdminPanelSettings,
  RestaurantMenu,
} from "@mui/icons-material";
import { UserRestaurantsPage } from "../features/user/pages/Home";
import { RestaurantDetailsPage } from "../features/user/pages/RestaurantDetail";
import { AdminDashboardPage } from "../features/admin/pages/Dashboard";
import { AdminCuisinesPage } from "../features/admin/pages/Cuisines";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
// ═══════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════

import type { Restaurant } from "../model/Restaurant";
import type { SnackbarState } from "../model/SnackbarState";
import type { NavItem, ViewType } from "../model/NavItem";


// ═══════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#C8A96E", light: "#DFC08A", dark: "#A8893E", contrastText: "#0A0A0F" },
    secondary: { main: "#6E9DC8" },
    background: { default: "#080810", paper: "#0F0F1A" },
    text: { primary: "#F0EDE8", secondary: "#9B9490" },
    error: { main: "#E07070" },
    success: { main: "#70C0A0" },
    divider: "rgba(200,169,110,0.12)",
  },
  typography: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    h1: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h2: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h3: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h5: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h6: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    body1: { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", lineHeight: 1.7 },
    body2: { fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" },
    button: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.8rem" },
    caption: { fontFamily: "'Cormorant Garamond', serif", fontSize: "0.82rem" },
    overline: { fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.15em", fontSize: "0.7rem" },
  },
  shape: { borderRadius: 2 },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "linear-gradient(135deg, #C8A96E, #A8893E)",
          "&:hover": { background: "linear-gradient(135deg, #DFC08A, #C8A96E)", transform: "translateY(-1px)", boxShadow: "0 8px 24px rgba(200,169,110,0.25)" },
          transition: "all 0.3s ease",
        },
        outlinedPrimary: {
          borderColor: "rgba(200,169,110,0.35)",
          "&:hover": { borderColor: "#C8A96E", background: "rgba(200,169,110,0.07)" },
        },
        text: { "&:hover": { background: "rgba(200,169,110,0.06)" } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, #0F0F1A, #131320)",
          border: "1px solid rgba(200,169,110,0.09)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            fontFamily: "'Cormorant Garamond', serif",
            "& fieldset": { borderColor: "rgba(200,169,110,0.18)" },
            "&:hover fieldset": { borderColor: "rgba(200,169,110,0.35)" },
            "&.Mui-focused fieldset": { borderColor: "#C8A96E" },
          },
          "& .MuiInputLabel-root": { fontFamily: "'Cormorant Garamond', serif" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#C8A96E" },
          "& .MuiInputBase-input": { fontFamily: "'Cormorant Garamond', serif" },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            background: "rgba(200,169,110,0.05)",
            borderBottom: "1px solid rgba(200,169,110,0.18)",
            color: "#C8A96E",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontSize: "0.72rem",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { background: "rgba(200,169,110,0.03)" },
          "& .MuiTableCell-root": {
            borderBottom: "1px solid rgba(200,169,110,0.05)",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.95rem",
            padding: "14px 16px",
          },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontFamily: "'Cormorant Garamond', serif" } } },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            fontFamily: "'Cormorant Garamond', serif",
            color: "rgba(240,237,232,0.5)",
            borderColor: "rgba(200,169,110,0.12)",
            "&:hover": { background: "rgba(200,169,110,0.07)", borderColor: "rgba(200,169,110,0.25)" },
            "&.Mui-selected": { background: "rgba(200,169,110,0.15)", color: "#C8A96E", borderColor: "rgba(200,169,110,0.35)" },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { background: "#0D0D1C", border: "1px solid rgba(200,169,110,0.13)" } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: "rgba(8,8,16,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(200,169,110,0.08)" },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" } },
    },
  },
});




// ═══════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════

interface NavbarProps {
  view: ViewType;
  onNav: (v: ViewType) => void;
}

const Navbar: FC<NavbarProps> = memo(({ view, onNav }) => {
  const mobile = useMediaQuery("(max-width:500px)");

  const navItems = useMemo<NavItem[]>(
    () => [
      { key: "user", label: mobile ? "Browse" : "Restaurants", icon: <People sx={{ fontSize: 15 }} /> },
      { key: "admin", label: mobile ? "Admin" : "Dashboard", icon: <AdminPanelSettings sx={{ fontSize: 15 }} /> },
      { key: "admin_cuisines", label: mobile ? "Cuisines" : "Cuisines", icon: <RestaurantMenu sx={{ fontSize: 15 }} /> },
    ],
    [mobile]
  );

  const isActive = useCallback(
    (key: ViewType): boolean => view === key || (view === "details" && key === "user"),
    [view]
  );

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 }, minHeight: { xs: 58, sm: 68 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 30,
              height: 30,
              background: "linear-gradient(135deg,#C8A96E,#A8893E)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <RestaurantIcon sx={{ fontSize: 16, color: "#0A0A0F" }} />
          </Box>
          <Typography
            sx={{
              color: "#C8A96E",
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: { xs: "1rem", sm: "1.15rem" },
              fontWeight: 600,
            }}
          >
            {mobile ? "Restaurants" : "Restaurants"}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          {navItems.map(({ key, label, icon }) => (
            <Button
              key={key}
              size={mobile ? "small" : "medium"}
              startIcon={icon}
              onClick={() => onNav(key)}
              variant={isActive(key) ? "contained" : "text"}
              sx={
                !isActive(key)
                  ? { color: "rgba(240,237,232,0.5)", "&:hover": { color: "#C8A96E" } }
                  : {}
              }
            >
              {label}
            </Button>
          ))}
        </Stack>
      </Toolbar>
    </AppBar>
  );
});

// ═══════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════

const App: FC = () => {

  const [view, setView] = useState<ViewType>("user");
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, msg: "", sev: "success" });


  const closeSnack = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }));
  }, []);



  // const handleEdit = useCallback(
  //   (updated: Restaurant) => {
  //     setRestaurants((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
  //     notify(`"${updated.name}" updated successfully`);
  //   },
  //   [notify]
  // );

  // const handleDelete = useCallback(
  //   (id: string) => {
  //     const r = restaurants.find((r) => r.id === id);
  //     setRestaurants((rs) => rs.filter((r) => r.id !== id));
  //     notify(`"${r?.name}" removed`, "info");
  //   },
  //   [restaurants, notify]
  // );

  const handleViewDetails = useCallback((r: Restaurant) => {
    setSelected(r);
    setView("details");
  }, []);

  const handleBack = useCallback(() => {
    setSelected(null);
    setView("user");
  }, []);

  const handleNav = useCallback((v: ViewType) => {
    setView(v);
    setSelected(null);
  }, []);

  const snackBg: Record<AlertColor, string> = {
    success: "linear-gradient(135deg,#2A3A2A,#1A2A1A)",
    info: "linear-gradient(135deg,#1A2A3A,#101C2A)",
    warning: "linear-gradient(135deg,#3A2A1A,#2A1A0A)",
    error: "linear-gradient(135deg,#3A1A1A,#2A0A0A)",
  };

  const snackBorder: Record<AlertColor, string> = {
    success: "1px solid rgba(112,192,160,0.3)",
    info: "1px solid rgba(110,157,200,0.3)",
    warning: "1px solid rgba(200,160,80,0.3)",
    error: "1px solid rgba(224,112,112,0.3)",
  };

  return (

    <ThemeProvider theme={theme}>
      <ToastContainer />
      <CssBaseline />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        * { box-sizing: border-box; }
        body { background: #080810; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.25); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(200,169,110,0.45); }
      `}</style>

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse 60% 40% at 15% 10%, rgba(200,169,110,0.04) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 85% 90%, rgba(110,157,200,0.04) 0%, transparent 70%), #080810",
        }}
      >
        <Navbar view={view} onNav={handleNav} />
        <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 5 }, px: { xs: 2, sm: 3, lg: 5 } }}>
          {view === "user" && (
            <UserRestaurantsPage onViewDetails={handleViewDetails} />
          )}
          {view === "details" && selected !== null && (
            <RestaurantDetailsPage restaurant={selected} onBack={handleBack} />
          )}
          {view === "admin" && (
            <AdminDashboardPage />
          )}
          {view === "admin_cuisines" && (
            <AdminCuisinesPage />
          )}
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3200}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.sev}
          variant="filled"
          onClose={closeSnack}
          sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.95rem",
            background: snackBg[snackbar.sev],
            border: snackBorder[snackbar.sev],
          }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;