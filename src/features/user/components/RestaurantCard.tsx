import {
  memo,

} from "react";

import type {
  FC,
} from "react";
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  Phone,
  LocationOn,
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



interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (r: Restaurant) => void;
}



export const RestaurantCard: FC<RestaurantCardProps> = memo(({ restaurant, onClick }) => {
  const cName = restaurant.cuisine?.name || "Unknown";
  const cc = cuisineColor(cName);
  const rgb = parseRGB(cc);

  const cardSx: SxProps<Theme> = {
    height: "100%",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: `0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(200,169,110,0.18)`,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "2px",
      background: `linear-gradient(90deg, transparent, ${cc}, transparent)`,
      opacity: 0.5,
    },
    animation: "fadeSlideUp 0.5s ease both",
    "@keyframes fadeSlideUp": {
      from: { opacity: 0, transform: "translateY(16px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  };

  return (
    <Card sx={cardSx} onClick={() => onClick(restaurant)}>
      <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Avatar
            sx={{
              background: `rgba(${rgb},0.14)`,
              color: cc,
              width: 44,
              height: 44,
              fontSize: "1.1rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
            }}
          >
            {restaurant.name.charAt(0)}
          </Avatar>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Star sx={{ color: "#C8A96E", fontSize: 13 }} />
            <Typography sx={{ color: "#C8A96E", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontWeight: 600 }}>
              {restaurant.rating}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "1.05rem", lineHeight: 1.3, mb: 0.8 }}
        >
          {restaurant.name}
        </Typography>

        <Chip
          label={cName}
          size="small"
          sx={{
            mb: 2,
            width: "fit-content",
            background: `rgba(${rgb},0.1)`,
            color: cc,
            border: `1px solid rgba(${rgb},0.22)`,
            fontSize: "0.7rem",
            height: 21,
            "& .MuiChip-label": { px: 1 },
          }}
        />

        <Stack direction="row" spacing={1} alignItems="flex-start" mb={1.5}>
          <LocationOn sx={{ color: "text.secondary", fontSize: 14, mt: 0.2, flexShrink: 0 }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.83rem", lineHeight: 1.4 }}>
            {restaurant.address}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" mt="auto">
          <Phone sx={{ color: "text.secondary", fontSize: 13 }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.83rem" }}>
            {restaurant.contact}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
});