import {
    useState,
    useMemo,
    useCallback,
    memo,
    useEffect,
} from "react";
import type { ChangeEvent } from "react";
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
    Add,
    Edit,
    Delete,
    Search,
    RestaurantMenu,
    TrendingUp,
    CheckCircle,
} from "@mui/icons-material";
import { CuisineForm } from "../components/CuisineForm";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { createCuisine, deleteCuisine, getAllCuisines, updateCuisine } from "../../../services/admin/adminCuisineServices";
import { toast } from "react-toastify";
import type { Cuisine, CuisineFormValues } from "../../../model/Cuisine";

const PER_PAGE_ADMIN = 6;

// ═══════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    trend?: string;
}

const StatCard: React.FC<StatCardProps> = memo(({ icon, label, value, color, trend }) => (
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
                <Avatar sx={{ background: `rgba(200,169,110,0.12)`, color, width: 44, height: 44 }}>
                    {icon}
                </Avatar>
            </Stack>
        </CardContent>
    </Card>
));

export const AdminCuisinesPage = memo(() => {
    const [cuisines, setCuisines] = useState<Cuisine[]>([]);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [totalPages, setTotalPages] = useState<number>(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [editTarget, setEditTarget] = useState<Cuisine | null>(null);

    useEffect(() => {
        const fetchCuisines = async () => {
            const response = await getAllCuisines(page, PER_PAGE_ADMIN, search);
            if (response.success && response.data) {
                setCuisines(response.data.cuisines);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(response.message);
            }
        };
        fetchCuisines();
    }, [page, search]);

    const onAdd = useCallback(async (values: CuisineFormValues) => {
        const response = await createCuisine(values);
        if (response.success && response.data) {
            toast.success("Cuisine added successfully");
            setCuisines((cs) => [response.data!, ...cs]);
        } else {
            toast.error(response.message);
        }
    }, []);

    const onEdit = useCallback(async (values: Cuisine) => {
        const payload: Partial<CuisineFormValues> = {
            name: values.name,
            description: values.description || undefined
        };
        const response = await updateCuisine(values.id, payload);
        if (response.success && response.data) {
            toast.success("Cuisine updated successfully");
            setCuisines((cs) => cs.map((c) => (c.id === values.id ? response.data! : c)));
        } else {
            toast.error(response.message);
        }
    }, []);

    const onDelete = useCallback(async (id: number) => {
        const response = await deleteCuisine(id);
        if (response.success) {
            toast.success("Cuisine deleted successfully");
            setCuisines((cs) => cs.filter((c) => c.id !== id));
        } else {
            toast.error(response.message);
        }
    }, []);

    const handleEditClick = useCallback((c: Cuisine) => {
        setEditTarget(c);
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

    const handleFormSave = useCallback((values: CuisineFormValues) => {
        if (editTarget) {
            const updated: Cuisine = {
                ...editTarget,
                ...values,
            };
            onEdit(updated);
        } else {
            onAdd(values);
        }
        setFormOpen(false);
    }, [editTarget, onAdd, onEdit]);

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

    const stats = useMemo(() => ({
        total: cuisines.length,
        active: cuisines.filter((c) => c.status === "active").length,
    }), [cuisines]);

    return (
        <Fade in timeout={300}>
            <Box>
                <Box mb={5}>
                    <Typography variant="overline" sx={{ color: "#C8A96E", letterSpacing: "0.22em" }}>
                        Cuisine Management
                    </Typography>
                    <Typography variant="h3" sx={{ mb: 0.5 }}>
                        Admin Cuisines
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage available cuisines across the platform
                    </Typography>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} mb={5}>
                    <Grid size={{ xs: 6, lg: 4 }}>
                        <StatCard icon={<RestaurantMenu sx={{ fontSize: 22 }} />} label="Total Cuisines" value={stats.total} color="#C870C8" />
                    </Grid>
                    <Grid size={{ xs: 6, lg: 4 }}>
                        <StatCard icon={<CheckCircle sx={{ fontSize: 22 }} />} label="Active" value={stats.active} color="#70C0A0" />
                    </Grid>
                </Grid>

                {/* Table */}
                <Card>
                    <Box sx={{ p: { xs: 2, sm: 3 }, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, borderBottom: "1px solid rgba(200,169,110,0.08)" }}>
                        <Typography variant="h6">Cuisine Registry</Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                            <TextField
                                size="small"
                                placeholder="Filter cuisines…"
                                value={search}
                                onChange={handleSearchChange}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "text.secondary", fontSize: 17 }} /></InputAdornment> }}
                                sx={{ minWidth: { xs: "100%", sm: 220 } }}
                            />
                            <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
                                Add Cuisine
                            </Button>
                        </Stack>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cuisine</TableCell>
                                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Description</TableCell>
                                    <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cuisines.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 8, borderBottom: "none" }}>
                                            <RestaurantMenu sx={{ fontSize: 40, color: "rgba(200,169,110,0.15)", display: "block", mx: "auto", mb: 1.5 }} />
                                            <Typography color="text.secondary">No results found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cuisines.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar sx={{ width: 34, height: 34, fontSize: "0.88rem", background: `rgba(200,169,110,0.12)`, color: "#C8A96E" }}>
                                                        {c.name.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600} noWrap>{c.name}</Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                                                <Typography variant="body2" color="text.secondary">{c.description || "—"}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                                                <Chip label={c.status === "active" ? "Active" : "Inactive"} size="small" sx={{ background: c.status === "active" ? "rgba(112,192,160,0.1)" : "rgba(224,112,112,0.1)", color: c.status === "active" ? "success.main" : "error.main" }} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={0.3} justifyContent="flex-end">
                                                    <Tooltip title="Edit">
                                                        <IconButton size="small" onClick={() => handleEditClick(c)} sx={{ color: "text.secondary", "&:hover": { color: "#C8A96E", background: "rgba(200,169,110,0.09)" } }}>
                                                            <Edit sx={{ fontSize: 17 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton size="small" onClick={() => setDeleteId(c.id)} sx={{ color: "text.secondary", "&:hover": { color: "error.main", background: "rgba(224,112,112,0.09)" } }}>
                                                            <Delete sx={{ fontSize: 17 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {totalPages > 1 && (
                        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                            <Pagination count={totalPages} page={page} onChange={handlePageChange} />
                        </Box>
                    )}
                </Card>

                <CuisineForm key={editTarget?.id ?? "new"} open={formOpen} onClose={handleFormClose} onSave={handleFormSave} initial={editTarget} />

                <ConfirmDialog open={deleteId !== null} title="Remove Cuisine" message="Are you sure you want to remove this cuisine?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteId(null)} />
            </Box>
        </Fade>
    );
});
