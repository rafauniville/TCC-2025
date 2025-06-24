import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import FormPage from "./pages/FormPage";
import PrivateRoute from "./auth/PrivateRoute"; // Importe o componente de rota privada

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />  {/* Página de Login */}
        
        {/* Protegendo a rota do formulário */}
        <Route
          path="/form"
          element={
            <PrivateRoute element={<FormPage />} /> // Protege a rota com o PrivateRoute
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
