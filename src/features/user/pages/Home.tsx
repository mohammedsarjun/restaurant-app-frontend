import {
  useState,
  useMemo,
  useCallback,
  memo,

} from "react";

import type {
  FC,
  ChangeEvent,

} from "react";
import {

  Box,

  Typography,
  Card,
  CardContent,
  Grid,

  Skeleton,
  InputAdornment,
  Fade,
  Stack,
  Pagination,
  TextField,

} from "@mui/material";

import {
  Restaurant as RestaurantIcon,
  Search,
} from "@mui/icons-material";
import { RestaurantCard } from "../components/RestaurantCard";


import type { Restaurant } from "../../../model/Restaurant";
import { INITIAL_RESTAURANTS } from "../../../DummyData/dummyData";


const PER_PAGE_USER = 6;





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



interface UserRestaurantsPageProps {

  onViewDetails: (r: Restaurant) => void;
}

export const UserRestaurantsPage: FC<UserRestaurantsPageProps> = memo(({ onViewDetails }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  console.log("setRestaurants", setRestaurants);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const filtered = useMemo<Restaurant[]>(
    () =>
      restaurants.filter((r) =>
        [r.name, r.address, r.cuisine, r.contact].some((v) =>
          v?.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [restaurants, search]
  );

  const pageCount = useMemo<number>(() => Math.ceil(filtered.length / PER_PAGE_USER), [filtered.length]);

  const paginated = useMemo<Restaurant[]>(
    () => filtered.slice((page - 1) * PER_PAGE_USER, page * PER_PAGE_USER),
    [filtered, page]
  );

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    setLoading(true);
    setTimeout(() => setLoading(false), 280);
  }, []);

  const handlePage = useCallback((_: ChangeEvent<unknown>, v: number) => setPage(v), []);

  return (
    <Fade in timeout={300}>
      <Box>
        <Box mb={5}>
          <Typography variant="overline" sx={{ color: "#C8A96E", letterSpacing: "0.22em" }}>
            Discover
          </Typography>
          <Typography variant="h3" sx={{ mb: 0.5 }}>
            Our Restaurants
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore our curated collection of extraordinary dining experiences worldwide
          </Typography>
        </Box>

        <Box mb={4}>
          <TextField
            sx={{ maxWidth: 480 }}
            fullWidth
            placeholder="Search by name, cuisine, or location…"
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="circular" width={44} height={44} sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.04)" }} />
                    <Skeleton variant="text" width="65%" height={26} sx={{ bgcolor: "rgba(255,255,255,0.04)" }} />
                    <Skeleton variant="text" width="35%" height={21} sx={{ bgcolor: "rgba(255,255,255,0.04)", mb: 2 }} />
                    <Skeleton variant="text" width="90%" height={18} sx={{ bgcolor: "rgba(255,255,255,0.04)" }} />
                    <Skeleton variant="text" width="55%" height={18} sx={{ bgcolor: "rgba(255,255,255,0.04)" }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : paginated.length === 0 ? (
          <Box textAlign="center" py={12}>
            <RestaurantIcon sx={{ fontSize: 64, color: "rgba(200,169,110,0.15)", display: "block", mx: "auto", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No restaurants found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginated.map((r) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={r.id}>
                  <RestaurantCard restaurant={r} onClick={onViewDetails} />
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={4} flexWrap="wrap" gap={2}>
              <Typography variant="caption" color="text.secondary">
                Showing {(page - 1) * PER_PAGE_USER + 1}–{Math.min(page * PER_PAGE_USER, filtered.length)} of{" "}
                {filtered.length}
              </Typography>
              <PaginationComponent count={pageCount} page={page} onChange={handlePage} />
            </Stack>
          </>
        )}
      </Box>
    </Fade>
  );
});