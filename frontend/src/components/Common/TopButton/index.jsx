import React, { useEffect } from "react";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
function TopButton() {
  useEffect(() => {
    const scrollFunction = () => {
      const mybutton = document.getElementById("top-btn");
      if (!mybutton) return;
      if (
        document.body.scrollTop > 500 ||
        document.documentElement.scrollTop > 500
      ) {
        mybutton.style.display = "flex";
      } else {
        mybutton.style.display = "none";
      }
    };

    window.addEventListener("scroll", scrollFunction);
    scrollFunction();
    return () => window.removeEventListener("scroll", scrollFunction);
  }, []);

  return (
    <div
      className="top-btn"
      id="top-btn"
      onClick={() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }}
    >
      <ExpandLessRoundedIcon />
    </div>
  );
}

export default TopButton;
