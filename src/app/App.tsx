import {
  useState,
  useMemo,
  useCallback,
  memo,

} from "react";

import type {
  FC,
  ReactNode,
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

} from "@mui/icons-material";
import { UserRestaurantsPage } from "../features/user/pages/Home";
import { RestaurantDetailsPage } from "../features/user/pages/RestaurantDetail";
import { AdminDashboardPage } from "../features/admin/pages/Dashboard";

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
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════




const INITIAL_RESTAURANTS: Restaurant[] = [
  { id: "1", name: "Le Jardin Céleste", address: "42 Rue de Rivoli, Paris 75001", contact: "+33 1 42 60 81 00", description: "An elevated French brasserie celebrating seasonal produce from the Loire Valley. Our chef brings 20 years of Michelin-starred experience crafting each dish as an edible work of art.", cuisine: "French", rating: 4.9, tables: 24, status: "active", createdAt: new Date("2021-03-15") },
  { id: "2", name: "Osaka no Yume", address: "8 Takashimaya St, Tokyo 160-0022", contact: "+81 3 5362 7000", description: "A kaiseki journey through Japan's culinary seasons. Each 12-course omakase tells the story of a single ingredient, elevated through centuries of Japanese technique.", cuisine: "Japanese", rating: 4.8, tables: 16, status: "active", createdAt: new Date("2020-11-20") },
  { id: "3", name: "Fuoco e Sale", address: "Piazza Navona 15, Rome 00186", contact: "+39 06 6880 1094", description: "Authentic Roman trattoria where Nonna's recipes meet contemporary refinement. Wood-fired ovens imported from Naples give our Neapolitan pizzas an irreplaceable char.", cuisine: "Italian", rating: 4.7, tables: 30, status: "active", createdAt: new Date("2019-06-08") },
  { id: "4", name: "Saffron & Smoke", address: "12 Corniche Road, Dubai Marina", contact: "+971 4 399 9999", description: "A modern Persian gastronomic experience where ancient spice routes meet contemporary plating. Fragrant slow-braised lamb and rose-water desserts define our signature menu.", cuisine: "Persian", rating: 4.6, tables: 40, status: "active", createdAt: new Date("2022-01-10") },
  { id: "5", name: "The Copper Kettle", address: "7 Charlotte Square, Edinburgh EH2 4DR", contact: "+44 131 225 5109", description: "A Victorian townhouse transformed into Edinburgh's most intimate dining room. Scottish game, wild sea fish, and highland whisky form the pillars of our tasting menu.", cuisine: "Scottish", rating: 4.8, tables: 18, status: "active", createdAt: new Date("2018-09-22") },
  { id: "6", name: "Casa de los Sueños", address: "Calle Gran Vía 28, Madrid 28013", contact: "+34 91 532 8745", description: "Innovative nuevo cocina celebrating Spain's rich agricultural tradition. Our vermouth bar and tapas experience precede a five-course journey through Iberian terroir.", cuisine: "Spanish", rating: 4.5, tables: 35, status: "inactive", createdAt: new Date("2021-07-14") },
  { id: "7", name: "Lotus & Lemongrass", address: "35 Sukhumvit Soi 11, Bangkok 10110", contact: "+66 2 252 7998", description: "Modern Thai cuisine that honours the complexity of regional recipes seldom seen outside local homes. Botanical cocktails crafted with Thai herbs complete the aromatic journey.", cuisine: "Thai", rating: 4.7, tables: 28, status: "active", createdAt: new Date("2020-04-18") },
  { id: "8", name: "Brisket & Barrel", address: "1540 N Damen Ave, Chicago IL 60622", contact: "+1 773 384 7275", description: "A hymn to American smoke culture — 18-hour briskets, heritage pork ribs, and handcrafted bourbon barrels age quietly in our cellar. Nashville influence, Chicago soul.", cuisine: "American BBQ", rating: 4.6, tables: 45, status: "active", createdAt: new Date("2019-12-01") },
  { id: "9", name: "Alma do Mar", address: "Doca de Alcântara Norte, Lisbon 1350-352", contact: "+351 21 362 0203", description: "Perched over the Tagus, our kitchen celebrates Portugal's deep seafaring heritage. Freshly landed Atlantic catch arrives each morning to be transformed by wood-coal fire.", cuisine: "Portuguese", rating: 4.9, tables: 20, status: "active", createdAt: new Date("2023-02-28") },
  { id: "10", name: "Bergwald Stube", address: "Maximilianstr. 17, Munich 80539", contact: "+49 89 212 23970", description: "Alpine Bavarian tradition elevated for the discerning palate. Hand-rolled pasta, venison carpaccio, and biodynamic wines from Austria and South Tyrol anchor our seasonal menu.", cuisine: "Bavarian", rating: 4.4, tables: 22, status: "active", createdAt: new Date("2021-11-05") },
  { id: "11", name: "Terroir & Tide", address: "123 Harbour St, Sydney NSW 2000", contact: "+61 2 9241 1111", description: "A celebration of Australian coastal abundance. Indigenous ingredients — finger lime, saltbush, lemon myrtle — weave through a menu shaped by Polynesian and Asian currents.", cuisine: "Australian", rating: 4.7, tables: 32, status: "active", createdAt: new Date("2022-08-15") },
  { id: "12", name: "Tigre & Ceviche", address: "Calle Berlín 701, Miraflores, Lima", contact: "+51 1 651 1000", description: "Lima's celebrated Nikkei tradition lives here — the sublime marriage of Peruvian ceviche craft and Japanese precision. Tiger's milk cocktails are legendary among locals.", cuisine: "Peruvian", rating: 4.8, tables: 26, status: "active", createdAt: new Date("2020-03-12") },
];



const genId = (): string => Math.random().toString(36).substr(2, 9);


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
            {mobile ? "Maître" : "Maître de Maison"}
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [view, setView] = useState<ViewType>("user");
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, msg: "", sev: "success" });

  const notify = useCallback((msg: string, sev: AlertColor = "success") => {
    setSnackbar({ open: true, msg, sev });
  }, []);

  const closeSnack = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }));
  }, []);

  const handleAdd = useCallback(
    (values: RestaurantFormValues) => {
      const r: Restaurant = {
        ...values,
        id: genId(),
        status: "active",
        rating: parseFloat(values.rating) || 4.5,
        tables: parseInt(values.tables, 10) || 20,
        createdAt: new Date(),
      };
      setRestaurants((rs) => [r, ...rs]);
      notify(`"${values.name}" added to the registry`);
    },
    [notify]
  );

  const handleEdit = useCallback(
    (updated: Restaurant) => {
      setRestaurants((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
      notify(`"${updated.name}" updated successfully`);
    },
    [notify]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const r = restaurants.find((r) => r.id === id);
      setRestaurants((rs) => rs.filter((r) => r.id !== id));
      notify(`"${r?.name}" removed`, "info");
    },
    [restaurants, notify]
  );

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
            <UserRestaurantsPage restaurants={restaurants} onViewDetails={handleViewDetails} />
          )}
          {view === "details" && selected !== null && (
            <RestaurantDetailsPage restaurant={selected} onBack={handleBack} />
          )}
          {view === "admin" && (
            <AdminDashboardPage
              restaurants={restaurants}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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