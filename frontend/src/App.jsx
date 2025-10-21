import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EmployeeForm from "./components/EmployeeForm";
import MaterialManagement from "./components/MaterialManagement";
import RestitutionProcess from "./components/RestitutionProcess";
import EmployeeRestitutionPage from "./components/EmployeeRestitutionPage";
import EmployeeFlow from "./components/EmployeeFlow";
import Layout from "./components/Layout";
import "./index.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee/new" element={<EmployeeForm />} />
            <Route path="/employee/edit/:id" element={<EmployeeForm />} />
            <Route path="/employee-flow" element={<EmployeeFlow />} />
            <Route path="/material-management" element={<MaterialManagement />} />
            <Route path="/restitution" element={<RestitutionProcess />} />
            <Route path="/employee-restitution" element={<EmployeeRestitutionPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;