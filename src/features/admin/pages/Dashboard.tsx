import {
    useState,
    useMemo,
    useCallback,
    memo,
    useEffect,

} from "react";

import type {
    FC,
    ReactNode,
    ChangeEvent,

} from "react";
import {

    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    IconButton,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    InputAdornment,
    Tooltip,
    Fade,
    Stack,

    Pagination,
} from "@mui/material";


import {
    Restaurant as RestaurantIcon,

    Add,
    Edit,
    Delete,
    Search,

    Storefront,

    CheckCircle,
    Star,
    TrendingUp,
} from "@mui/icons-material";
import { RestaurantForm } from "../components/RestaurantForm";
import { ConfirmDialog } from "../components/ConfirmDialog";

// ═══════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════

import type { Restaurant } from "../../../model/Restaurant";
import type { RestaurantFormValues } from "../../../model/RestaurantFormValues";
import type { StatDefinition } from "../../../model/StatDefinition";
import type { DashboardStats } from "../../../model/DashboardStats";
import { createRestaurant, deleteRestaurant, getAllRestaurants, updateRestaurant } from "../../../services/admin/adminRestaurantServices";
// import { INITIAL_RESTAURANTS } from "../../../DummyData/dummyData";
import { toast } from "react-toastify";


// ═══════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════

const CUISINE_COLORS: Record<string, string> = {
    French: "#C8A96E",
    Japanese: "#E07070",
    Italian: "#70B870",
    Persian: "#C870C8",
    Scottish: "#7090C8",
    Spanish: "#C87070",
    Thai: "#70C8A0",
    "American BBQ": "#C8A070",
    Portuguese: "#7070C8",
    Bavarian: "#A0C870",
    Australian: "#70B8C8",
    Peruvian: "#C87090",
};

const DEFAULT_COLOR = "#C8A96E";

/** Convert a hex colour string to an `"r,g,b"` string for use in rgba(). */
const parseRGB = (hex: string): string => {
    try {
        const parts = hex.slice(1).match(/.{2}/g);
        if (!parts || parts.length < 3) return "200,169,110";
        return parts.map((h) => parseInt(h, 16)).join(",");
    } catch {
        return "200,169,110";
    }
};

const cuisineColor = (cuisine: string): string =>
    CUISINE_COLORS[cuisine] ?? DEFAULT_COLOR;



const PER_PAGE_ADMIN = 6;



// ═══════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    color: string;
    trend?: string;
}

const StatCard: FC<StatCardProps> = memo(({ icon, label, value, color, trend }) => (
    <Card
        sx={{
            height: "100%",
            position: "relative",
            overflow: "hidden",
            "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            },
        }}
    >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="overline" color="text.secondary">
                        {label}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            fontSize: { xs: "1.8rem", sm: "2.2rem" },
                            color,
                            lineHeight: 1.1,
                            mt: 0.5,
                        }}
                    >
                        {value}
                    </Typography>
                    {trend && (
                        <Stack direction="row" spacing={0.4} alignItems="center" mt={0.5}>
                            <TrendingUp sx={{ fontSize: 12, color: "success.main" }} />
                            <Typography variant="caption" color="success.main">
                                {trend}
                            </Typography>
                        </Stack>
                    )}
                </Box>
                <Avatar sx={{ background: `rgba(${parseRGB(color)},0.12)`, color, width: 44, height: 44 }}>
                    {icon}
                </Avatar>
            </Stack>
        </CardContent>
    </Card>
));



// ═══════════════════════════════════════════════════
// PAGINATION COMPONENT
// ═══════════════════════════════════════════════════

interface PaginationComponentProps {
    count: number;
    page: number;
    onChange: (event: ChangeEvent<unknown>, page: number) => void;
}

const PaginationComponent: FC<PaginationComponentProps> = memo(({ count, page, onChange }) =>
    count > 1 ? (
        <Box display="flex" justifyContent="center">
            <Pagination count={count} page={page} onChange={onChange} variant="outlined" shape="rounded" />
        </Box>
    ) : null
);


// ═══════════════════════════════════════════════════
// RESTAURANT FORM
// ═══════════════════════════════════════════════════






export const AdminDashboardPage = memo(() => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [totalPages, setTotalPages] = useState<number>(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [editTarget, setEditTarget] = useState<Restaurant | null>(null);


    useEffect(() => {

        const fetchRestaurants = async () => {
            const response = await getAllRestaurants(page, PER_PAGE_ADMIN, search);
            console.log(response)
            if (response.success) {
                setRestaurants(response.data.restaurants);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(response.message);
            }

        };
        fetchRestaurants()
    }, [page, search])

    const onAdd = useCallback(
        async (values: RestaurantFormValues) => {
            const response = await createRestaurant(values);

            if (response.success && response.data) {
                toast.success(response.message);
                setRestaurants((rs) => [response.data!, ...rs]);
            } else {
                toast.error(response.message);
            }

        },
        []
    );

    const onEdit = useCallback(
        async (values: Restaurant) => {
            console.log(values);
            const response = await updateRestaurant(values.id, values);
            if (response.success && response.data) {
                toast.success(response.message);
                setRestaurants((rs) => rs.map((r) => (r.id === values.id ? response.data! : r)));
            } else {
                toast.error(response.message);
            }
        },
        []
    );

    const onDelete = useCallback(
        async (id: string) => {
            const response = await deleteRestaurant(id);
            if (response.success) {
                toast.success(response.message);
                setRestaurants((rs) => rs.filter((r) => r.id !== id));
            } else {
                toast.error(response.message);
            }
        },
        []
    );


    const stats = useMemo<DashboardStats>(
        () => ({
            total: restaurants.length,
            active: restaurants.filter((r) => r.status === "active").length,
            avgRating: restaurants.length
                ? (restaurants.reduce((s, r) => s + r.rating, 0) / restaurants.length).toFixed(1)
                : "—",
            tables: restaurants.reduce((s, r) => s + r.tables, 0),
        }),
        [restaurants]
    );

    const statDefs = useMemo<StatDefinition[]>(
        () => [
            { icon: <Storefront sx={{ fontSize: 22 }} />, label: "Total Restaurants", value: stats.total, color: "#C8A96E", trend: "+2 this month" },
            { icon: <CheckCircle sx={{ fontSize: 22 }} />, label: "Active", value: stats.active, color: "#70C0A0" },
            { icon: <Star sx={{ fontSize: 22 }} />, label: "Avg Rating", value: stats.avgRating, color: "#6E9DC8" },
            { icon: <RestaurantIcon sx={{ fontSize: 22 }} />, label: "Total Tables", value: stats.tables, color: "#C870C8" },
        ],
        [stats]
    );

    const handleEditClick = useCallback((r: Restaurant) => {
        setEditTarget(r);
        setFormOpen(true);
    }, []);

    const handleAddClick = useCallback(() => {
        setEditTarget(null);
        setFormOpen(true);
    }, []);

    const handleFormClose = useCallback(() => {
        setFormOpen(false);
        setEditTarget(null);
    }, []);

    const handleFormSave = useCallback(
        (values: RestaurantFormValues) => {
            if (editTarget) {
                console.log(values)
                const updated: Restaurant = {
                    ...editTarget,
                    ...values,
                    cuisineId: Number(values.cuisineId),
                    rating: parseFloat(values.rating) || editTarget.rating,
                    tables: parseInt(values.tables, 10) || editTarget.tables,
                };

                onEdit(updated);
                setEditTarget(null);
            } else {
                onAdd(values);
            }
            setFormOpen(false);
        },
        [editTarget, onAdd, onEdit]
    );

    const handleDeleteConfirm = useCallback(() => {
        if (deleteId) {
            onDelete(deleteId);
            setDeleteId(null);
        }
    }, [deleteId, onDelete]);

    const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((_: ChangeEvent<unknown>, v: number) => setPage(v), []);

    return (
        <Fade in timeout={300}>
            <Box>
                <Box mb={5}>
                    <Typography variant="overline" sx={{ color: "#C8A96E", letterSpacing: "0.22em" }}>
                        Management
                    </Typography>
                    <Typography variant="h3" sx={{ mb: 0.5 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Monitor and manage your entire restaurant portfolio
                    </Typography>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} mb={5}>
                    {statDefs.map((s) => (
                        <Grid size={{ xs: 6, lg: 3 }} key={s.label}>
                            <StatCard {...s} />
                        </Grid>
                    ))}
                </Grid>

                {/* Table */}
                <Card>
                    <Box
                        sx={{
                            p: { xs: 2, sm: 3 },
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2,
                            borderBottom: "1px solid rgba(200,169,110,0.08)",
                        }}
                    >
                        <Typography variant="h6">Restaurant Registry</Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                            <TextField
                                size="small"
                                placeholder="Filter restaurants…"
                                value={search}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: "text.secondary", fontSize: 17 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ minWidth: { xs: "100%", sm: 220 } }}
                            />
                            <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
                                Add Restaurant
                            </Button>
                        </Stack>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Restaurant</TableCell>
                                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Cuisine</TableCell>
                                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Contact</TableCell>
                                    <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>Status</TableCell>
                                    <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>Rating</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {restaurants.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 8, borderBottom: "none" }}>
                                            <RestaurantIcon sx={{ fontSize: 40, color: "rgba(200,169,110,0.15)", display: "block", mx: "auto", mb: 1.5 }} />
                                            <Typography color="text.secondary">No results found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    restaurants.map((r) => {
                                        const cName = r.cuisine?.name || "Unknown";
                                        const cc = cuisineColor(cName);
                                        const rgb = parseRGB(cc);
                                        return (
                                            <TableRow key={r.id}>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar
                                                            sx={{
                                                                width: 34,
                                                                height: 34,
                                                                fontSize: "0.88rem",
                                                                fontFamily: "'Playfair Display', serif",
                                                                fontWeight: 700,
                                                                background: `rgba(${rgb},0.12)`,
                                                                color: cc,
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {r.name.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600} noWrap>
                                                                {r.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: { md: "none" } }}>
                                                                {cName}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                                                    <Chip
                                                        label={cName}
                                                        size="small"
                                                        sx={{
                                                            background: `rgba(${rgb},0.09)`,
                                                            color: cc,
                                                            border: `1px solid rgba(${rgb},0.18)`,
                                                            fontSize: "0.7rem",
                                                            height: 21,
                                                            "& .MuiChip-label": { px: 1 },
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {r.contact}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                                                    <Chip
                                                        label={r.status === "active" ? "Active" : "Inactive"}
                                                        size="small"
                                                        sx={{
                                                            background: r.status === "active" ? "rgba(112,192,160,0.1)" : "rgba(224,112,112,0.1)",
                                                            color: r.status === "active" ? "success.main" : "error.main",
                                                            fontSize: "0.7rem",
                                                            height: 21,
                                                            "& .MuiChip-label": { px: 1 },
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                                                    <Stack direction="row" spacing={0.4} alignItems="center">
                                                        <Star sx={{ color: "#C8A96E", fontSize: 13 }} />
                                                        <Typography variant="body2" sx={{ color: "#C8A96E" }}>
                                                            {r.rating}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={0.3} justifyContent="flex-end">
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEditClick(r)}
                                                                sx={{ color: "text.secondary", "&:hover": { color: "#C8A96E", background: "rgba(200,169,110,0.09)" } }}
                                                            >
                                                                <Edit sx={{ fontSize: 17 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => setDeleteId(r.id)}
                                                                sx={{ color: "text.secondary", "&:hover": { color: "error.main", background: "rgba(224,112,112,0.09)" } }}
                                                            >
                                                                <Delete sx={{ fontSize: 17 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2,
                            borderTop: "1px solid rgba(200,169,110,0.05)",
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""}
                        </Typography>
                        <PaginationComponent count={totalPages} page={page} onChange={handlePageChange} />
                    </Box>
                </Card>

                <RestaurantForm
                    key={editTarget?.id ?? "new"}
                    open={formOpen}
                    onClose={handleFormClose}
                    onSave={handleFormSave}
                    initial={editTarget}
                />

                <ConfirmDialog
                    open={deleteId !== null}
                    title="Remove Restaurant"
                    message="This restaurant will be permanently removed from the registry. This action cannot be undone."
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteId(null)}
                />
            </Box>
        </Fade>
    );
});