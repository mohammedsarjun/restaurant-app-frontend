import {
  memo,

} from "react";

import type {
  FC,
  ReactNode,
} from "react";
import {

  Box,

  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Fade,
  Divider,
  Stack,

} from "@mui/material";

import {
  Restaurant as RestaurantIcon,
  Phone,
  LocationOn,
  ArrowBack,

  CalendarToday,
  Description,

  Star,
} from "@mui/icons-material";


// ═══════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════

import type { Restaurant } from "../../../model/Restaurant";

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


interface RestaurantDetailsPageProps {
  restaurant: Restaurant;
  onBack: () => void;
}

interface DetailRow {
  icon: ReactNode;
  label: string;
  value: string;
}

const fmtDate = (d: Date): string =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });


export const RestaurantDetailsPage: FC<RestaurantDetailsPageProps> = memo(({ restaurant, onBack }) => {
  const cc = cuisineColor(restaurant.cuisine);
  const rgb = parseRGB(cc);

  const details: DetailRow[] = [
    { icon: <LocationOn />, label: "Address", value: restaurant.address },
    { icon: <Phone />, label: "Contact", value: restaurant.contact },
    { icon: <Description />, label: "About", value: restaurant.description },
    { icon: <CalendarToday />, label: "Established", value: fmtDate(restaurant.createdAt) },
    { icon: <RestaurantIcon />, label: "Seating", value: `${restaurant.tables} tables` },
  ];

  return (
    <Fade in timeout={350}>
      <Box>
        <Button
          onClick={onBack}
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ mb: 4, borderColor: "rgba(200,169,110,0.2)", color: "text.secondary", "&:hover": { color: "#C8A96E" } }}
        >
          Back to Restaurants
        </Button>

        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, md: 9, lg: 7 }}>
            <Card
              sx={{
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, transparent, ${cc}, transparent)`,
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }} mb={4}>
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      fontSize: "2rem",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      background: `rgba(${rgb},0.14)`,
                      color: cc,
                      border: `2px solid rgba(${rgb},0.25)`,
                      flexShrink: 0,
                    }}
                  >
                    {restaurant.name.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography variant="h4" sx={{ lineHeight: 1.2, mb: 1.5 }}>
                      {restaurant.name}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {restaurant.cuisine && (
                        <Chip
                          label={restaurant.cuisine}
                          size="small"
                          sx={{ background: `rgba(${rgb},0.1)`, color: cc, border: `1px solid rgba(${rgb},0.2)` }}
                        />
                      )}
                      <Chip
                        icon={<Star sx={{ fontSize: "12px !important", color: "#C8A96E !important" }} />}
                        label={restaurant.rating}
                        size="small"
                        sx={{ background: "rgba(200,169,110,0.1)", color: "#C8A96E" }}
                      />
                      <Chip
                        label={restaurant.status === "active" ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          background: restaurant.status === "active" ? "rgba(112,192,160,0.1)" : "rgba(224,112,112,0.1)",
                          color: restaurant.status === "active" ? "success.main" : "error.main",
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Divider sx={{ borderColor: "rgba(200,169,110,0.1)", mb: 4 }} />

                <Stack spacing={3.5}>
                  {details.map(({ icon, label, value }) => (
                    <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
                      <Box sx={{ color: "#C8A96E", opacity: 0.75, mt: 0.2, flexShrink: 0 }}>{icon}</Box>
                      <Box>
                        <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.3 }}>
                          {label}
                        </Typography>
                        <Typography variant="body1">{value}</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
});