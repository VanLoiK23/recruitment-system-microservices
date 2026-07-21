import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { AuthWrapper } from "./components/context/auth.context.jsx";
import ProtectedRoute from "./route/ProtectedRoute.jsx";
import RoleRoute from "./route/RoleRoute.jsx";
import AuthPage from "./pages/auth/auth.jsx";
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
    element: <App />,
    children: [
      //Public
      {
        index: true, 
        element: <HomePage />,
      },
      {
        path: "jobs/:id",
        element: <JobDetailPage />
      },
      // {
      //   path: "about",
      //   element: <AboutPage />,
      // },

      // Private
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "candidate",
            element: (
              <RoleRoute allowedRoles={["candidate"]}>
                <Outlet />
              </RoleRoute>
            ),
            children: [
              // { index: true, element: <CandidateDashboard /> },
              // { path: "today-schedule", element: <TodaySchedule /> },
            ],
          },
          // {
          //   path: "profile",
          //   element: <ProfilePage />,
          // },
        ],
      },
    ],
  },
  { path: "/", element: <HomePage /> },
  { path: "/auth", element: <AuthPage /> },
  {
    path: "/confirm-email",
    element: <ConfirmEmailPage />,
  },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
  { path: "/403", element: <Forbidden /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrapper>
      <ToastContainer position="top-right" autoClose="3000" />

      <RouterProvider router={router} />
    </AuthWrapper>
  </StrictMode>
);
