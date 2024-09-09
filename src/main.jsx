import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";

axios.defaults.withCredentials = true;

if (import.meta.env.DEV) {
  console.log("Running in development mode");
  console.log(import.meta.env.VITE_LOCALHOST);
  axios.defaults.baseURL = import.meta.env.VITE_LOCALHOST;
} else {
  console.log("Running in production mode");
  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
