import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/authContext"; // Importe o AuthProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider> {/* Envolva a aplicação com o AuthProvider */}
    <App />
  </AuthProvider>
);
