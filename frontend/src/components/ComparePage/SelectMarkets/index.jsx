import { MenuItem, Select } from "@mui/material";
import React from "react";
import SelectDays from "../../CoinPage/SelectDays";
import "./styles.css";

function SelectMarkets({
  allMarkets,
  market1,
  market2,
  onMarketChange,
  days,
  handleDaysChange,
}) {
  const style = {
    height: "2.5rem",
    color: "var(--white)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--white)",
    },
    "& .MuiSvgIcon-root": {
      color: "var(--white)",
    },
    "&:hover": {
      "&& fieldset": {
        borderColor: "#3a80e9",
      },
    },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        backgroundColor: "var(--black)",
        color: "var(--white)",
        "& .MuiMenuItem-root:hover": {
          backgroundColor: "var(--darkgrey)",
        },
        "& .Mui-selected": {
          backgroundColor: "var(--blue) !important",
          color: "white !important",
        },
      },
    },
  };

  return (
    <div className="select-coins-div">
      <div className="select-flex">
        <p>Stock 1</p>
        <Select
          value={market1}
          onChange={(e) => onMarketChange(e, false)}
          sx={style}
          MenuProps={menuProps}
        >
          {allMarkets
            .filter((m) => m.id != market2)
            .map((m, i) => (
              <MenuItem value={m.id} key={i}>
                {m.name}
              </MenuItem>
            ))}
        </Select>
      </div>

      <div className="select-flex">
        <p>Stock 2</p>
        <Select
          value={market2}
          onChange={(e) => onMarketChange(e, true)}
          sx={style}
          MenuProps={menuProps}
        >
          {allMarkets
            .filter((m) => m.id != market1)
            .map((m, i) => (
              <MenuItem value={m.id} key={i}>
                {m.name}
              </MenuItem>
            ))}
        </Select>
      </div>

      <SelectDays
        days={days}
        handleDaysChange={handleDaysChange}
        noPTag={true}
      />
    </div>
  );
}

export default SelectMarkets;

