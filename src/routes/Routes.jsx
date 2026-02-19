import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllLoans from "../pages/AllLoans";
import LoanDetails from "../pages/LoanDetails";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import PrivateRoute from "./PrivateRoute";

// Dashboard Pages
import Profile from "../pages/dashboard/Profile";
import MyLoans from "../pages/dashboard/borrower/MyLoans";
import AddLoan from "../pages/dashboard/manager/AddLoan";
import PendingApplications from "../pages/dashboard/manager/PendingApplications";
import ApprovedApplications from "../pages/dashboard/manager/ApprovedApplications";
import ManageLoans from "../pages/dashboard/manager/ManageLoans";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import AllLoansAdmin from "../pages/dashboard/admin/AllLoansAdmin";
import AllApplications from "../pages/dashboard/admin/AllApplications";
import SuperAdminDashboard from "../pages/dashboard/super-admin/SuperAdminDashboard";
import ManageAdmins from "../pages/dashboard/super-admin/ManageAdmins";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "all-loans",
        element: <AllLoans />,
      },
      {
        path: "loans/:id",
        element: <LoanDetails />,
      },
      {
         path: "login",
         element: <Login />
      },
      {
         path: "register",
         element: <Register />
      },
       {
         path: "about",
         element: <div className="p-10 text-center text-2xl">About Page - Content Coming Soon</div>
      },
      {
         path: "contact",
         element: <div className="p-10 text-center text-2xl">Contact Page - Content Coming Soon</div>
      },
      {
         path: "payment-success",
         element: <PaymentSuccess />
      },
      {
         path: "payment-cancel",
         element: <PaymentCancel />
      },
      {
        path: "*",
        element: <div className="text-center p-20">
            <h1 className="text-4xl font-bold text-error">404</h1>
            <p className="text-xl">Page Not Found</p>
        </div>,
      }
    ],
  },
  {
    path: "dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
        {
            index: true,
            element: <Profile /> // Default to profile or a specific dashboard home
        },
        {
            path: "profile",
            element: <Profile />
        },
        // Borrower Routes
        {
            path: "my-loans",
            element: <MyLoans />
        },
        
        // Manager Routes
        {
            path: "add-loan",
            element: <AddLoan />
        },
        {
             path: "manage-loans",
             element: <ManageLoans />
        },
        {
             path: "pending-applications",
             element: <PendingApplications />
        },
        {
             path: "approved-applications",
             element: <ApprovedApplications />
        },

        // Admin Routes
        {
            path: "manage-users",
            element: <ManageUsers />
        },
        {
             path: "all-loans-admin",
             element: <AllLoansAdmin />
        },
        {
             path: "all-applications",
             element: <AllApplications />
        },

        // Super Admin Routes
        {
            path: "super-home",
            element: <SuperAdminDashboard />
        },
        {
            path: "manage-admins",
            element: <ManageAdmins />
        },
        {
            path: "system-settings",
            element: <div>System Settings Page</div>
        }
    ]
  }
]);

export default router;
