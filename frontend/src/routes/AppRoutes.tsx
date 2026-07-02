import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoutes";
import Dashboard from "../pages/Dashboard";
import Services from "../pages/Services";
import Layout from "../components/Layout";
import Users from "../pages/Users";
import Appointments from "../pages/Appointments";
import Profile from "../pages/Profile";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    )
}