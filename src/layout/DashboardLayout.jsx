import { Link, NavLink, Outlet } from "react-router-dom";
import { FaHome, FaUsers, FaMoneyBillWave, FaHistory, FaFileInvoiceDollar, FaUserCog, FaSignOutAlt, FaBars, FaCheckCircle } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useRole from "../hooks/useRole"; // We'll create this hook next

const DashboardLayout = () => {
    const { logOut } = useContext(AuthContext);
    const [role] = useRole(); // Assuming this hook returns [role, isLoading]
    // const role = 'super-admin'; // TEMPORARY FOR VERIFICATION

    // Sidebar items based on role
    const navItems = <>
        {/* Common Items */}
        <li>
            <NavLink to="/dashboard" end>
                <FaHome /> Dashboard Home
            </NavLink>
        </li>
        <li>
            <NavLink to="/dashboard/profile">
                <FaUserCog /> My Profile
            </NavLink>
        </li>

        {/* Borrower Items */}
        {role === 'borrower' && (
            <>
                <li>
                    <NavLink to="/dashboard/my-loans">
                        <FaHistory /> My Loans
                    </NavLink>
                </li>
                 <li>
                    <NavLink to="/dashboard/my-applications">
                        <FaFileInvoiceDollar /> My Applications
                    </NavLink>
                </li>
            </>
        )}

        {/* Manager Items */}
        {role === 'manager' && (
            <>
                <li>
                    <NavLink to="/dashboard/add-loan">
                        <FaMoneyBillWave /> Add Loan
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/manage-loans">
                        <FaHistory /> Manage Loans
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/pending-loans">
                        <FaFileInvoiceDollar /> Pending Applications
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/approved-loans">
                        <FaCheckCircle /> Approved Applications
                    </NavLink>
                </li>
            </>
        )}

        {/* Admin Items */}
        {role === 'admin' && (
            <>
                <li>
                    <NavLink to="/dashboard/manage-users">
                        <FaUsers /> Manage Users
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/all-loan">
                        <FaMoneyBillWave /> All Loans
                    </NavLink>
                </li>
                 <li>
                    <NavLink to="/dashboard/loan-applications">
                        <FaFileInvoiceDollar /> All Applications
                    </NavLink>
                </li>
            </>
        )}

        {/* Super Admin Items */}
        {role === 'super-admin' && (
            <>
                <li>
                    <NavLink to="/dashboard/super-home">
                         <FaHome /> Super Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/manage-admins">
                        <FaUserCog /> Manage Admins
                    </NavLink>
                </li>
                 <li>
                    <NavLink to="/dashboard/system-settings">
                        <FaCheckCircle /> System Settings
                    </NavLink>
                </li>
            </>
        )}

        <div className="divider"></div>
        <li>
            <Link to="/">
                <FaHome /> Home
            </Link>
        </li>
         <li>
            <Link to="/all-loans">
                <FaMoneyBillWave /> All Loans (Public)
            </Link>
        </li>
        <li>
            <button onClick={logOut}>
                <FaSignOutAlt /> Logout
            </button>
        </li>
    </>;

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col p-4 bg-base-200 min-h-screen">
                {/* Page content here */}
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden mb-4 w-fit">
                    <FaBars /> Open Menu
                </label>
                <div className="flex-1">
                    <Outlet />
                </div>
            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
                    {/* Sidebar content here */}
                    <div className="mb-6 px-4">
                        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                             <img src="/logo.png" className="w-8 h-8"/> LoanLink
                        </Link>
                        <div className="badge badge-secondary mt-2 uppercase">{role || 'User'}</div>
                    </div>
                    {navItems}
                </ul>
            
            </div>
        </div>
    );
};


export default DashboardLayout;
