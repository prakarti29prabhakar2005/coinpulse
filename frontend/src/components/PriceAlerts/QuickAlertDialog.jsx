import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { requestBrowserNotificationPermission } from "../../functions/browserNotifications";
import { createPriceAlert } from "../../functions/createPriceAlert";

const formatPrice = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })}`;

export default function QuickAlertDialog({
  assetType,
  assetId,
  assetName,
  currentPrice,
  buttonLabel = "Alert",
  buttonClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState("above");
  const [submitting, setSubmitting] = useState(false);

  const user = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const openDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user?.email) {
      toast.error("Login to set price alerts");
      return;
    }

    setOpen(true);
  };

  const closeDialog = () => {
    if (submitting) return;
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const parsedTargetPrice = Number(targetPrice);
    if (!Number.isFinite(parsedTargetPrice) || parsedTargetPrice <= 0) {
      toast.error("Enter a valid target price");
      return;
    }

    setSubmitting(true);
    try {
      const permissionRequest = requestBrowserNotificationPermission();

      await createPriceAlert({
        email: user.email,
        assetType,
        assetId,
        assetName,
        targetPrice: parsedTargetPrice,
        direction,
        enabledAt: new Date().toISOString(),
        repeatMinutes: 0,
      });

      await permissionRequest;
      toast.success("Alert created");
      setTargetPrice("");
      setDirection("above");
      setOpen(false);
    } catch (error) {
      toast.error(error?.message || "Failed to create alert");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        onClick={openDialog}
        title={`Create alert for ${assetName || assetId}`}
      >
        <NotificationsActiveOutlinedIcon fontSize="small" />
        <span>{buttonLabel}</span>
      </button>

      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "var(--black)",
            color: "var(--white)",
            borderRadius: "1rem",
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Set Price Alert</DialogTitle>
          <DialogContent
            sx={{
              display: "grid",
              gap: 2,
              paddingTop: "0.5rem !important",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {assetName || assetId}
              </div>
              <div style={{ opacity: 0.75 }}>
                Current price: {formatPrice(currentPrice)}
              </div>
            </div>
            <TextField
              label="Target Price (USD)"
              type="number"
              value={targetPrice}
              onChange={(event) => setTargetPrice(event.target.value)}
              inputProps={{ min: "0", step: "0.00000001" }}
              required
              fullWidth
              sx={{
                "& .MuiInputBase-root": { color: "var(--white)" },
                "& .MuiInputLabel-root": { color: "var(--grey)" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--grey)" },
              }}
            />

            <FormControl fullWidth>
              <InputLabel
                id={`alert-direction-${assetType}-${assetId}`}
                sx={{ color: "var(--grey)" }}
              >
                Notify When
              </InputLabel>
              <Select
                labelId={`alert-direction-${assetType}-${assetId}`}
                value={direction}
                label="Notify When"
                onChange={(event) => setDirection(event.target.value)}
                sx={{
                  color: "var(--white)",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--grey)" },
                  "& .MuiSvgIcon-root": { color: "var(--white)" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "var(--black)",
                      color: "var(--white)",
                    },
                  },
                }}
              >
                <MenuItem value="above">Price goes above or equals target</MenuItem>
                <MenuItem value="below">Price goes below or equals target</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ padding: "0 1.5rem 1.25rem" }}>
            <Button
              onClick={closeDialog}
              disabled={submitting}
              sx={{ color: "var(--grey)" }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Creating..." : "Create Alert"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
