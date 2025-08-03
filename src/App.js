import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Excavators from "./pages/Excavators";
import AddExcavator from "./pages/AddExcavator";
import LogsReport from "./pages/LogsReport";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/excavators" element={<Excavators token={token} />} />
      <Route path="/add-excavator" element={<AddExcavator token={token} />} />
      <Route path="/logs-report" element={<LogsReport token={token} />} />
    </Routes>
  );
}
