import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext";
import {JobReactionsProvider} from './Context/JobReactionsContext'
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <JobReactionsProvider>
        <App />
        </JobReactionsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
