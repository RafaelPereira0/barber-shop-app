import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoutes";
import Dashboard from "../pages/Dashboard";
import Services from "../pages/Services";
import Layout from "../components/Layout";
import Users from "../pages/Users";
import Profile from "../pages/Profile";
import Schedule from "../pages/Schedule";
import NewAppointments from "../pages/NewAppointments";
import Appointments from "../pages/Appointments";
import { Register } from "../pages/Register";
import { ForgotPassword } from "../pages/Password/ForgotPassword";
import { ResetPassword } from "../pages/Password/ResetPassword";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgot-password"  element={<ForgotPassword/>}/>
                <Route path="/reset-password"  element={<ResetPassword/>}/>
                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/newappointment" element={<NewAppointments />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Route>
                <Route element={<PrivateRoute allowedRoles={["ADMIN", "BARBER"]} />}>
                    <Route element={<Layout />}>
                        <Route path="/agenda" element={<Schedule />} />
                    </Route>

                </Route>
                <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
                    <Route element={<Layout />}>
                        <Route path="/users" element={<Users />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    )
}