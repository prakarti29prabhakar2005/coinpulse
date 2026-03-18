import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Coin from "./pages/Coin.jsx";
import Compare from "./pages/Compare.jsx";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginSignup from "./components/LoginSignup/LoginSignup.jsx";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3a80e9",
      },
    },
  });

  return (
    <div className="App">
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<LoginSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/coin/:id" element={<Coin />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
