import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {AuthWrapper} from "./components/context/auth.context.jsx"
import ProtectedRoute from "./route/ProtectedRoute.jsx";
import RoleRoute from "./route/RoleRoute.jsx";
import LoginPage from "./pages/auth/login.jsx";
import RegisterPage from "./pages/auth/register.jsx";
import HomePage from "./pages/client/homepage.jsx";
import JobDetailPage from "./pages/client/job-detail.jsx";
import ConfirmEmailPage from "./pages/auth/confirm-email.jsx";
import Forbidden from "./pages/error/Forbidden.jsx";
import NotFound from "./pages/error/NotFound.jsx";
import ForgotPasswordPage from "./pages/auth/forgot-password.jsx";
import ResetPasswordPage from "./pages/auth/reset-password.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "candidate",
        element: (
          <RoleRoute allowedRoles={["candidate"]}>
            <Outlet />
          </RoleRoute>
        ),
        children: [
          { index: true, element: <HomePage /> },
          // { path: "today-schedule", element: <TodaySchedule role="student" /> },
        ],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/confirm-email", element: <ConfirmEmailPage />
  },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
  { path: "/403", element: <Forbidden /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrapper>
      <ToastContainer position="top-right" autoClose="3000"/>

      <RouterProvider router={router}/>
    </AuthWrapper>
  </StrictMode>
);
