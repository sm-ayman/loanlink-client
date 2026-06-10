import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((error) => console.log(error));
  };

  /* Theme Management */
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "winter");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("night");
    } else {
      setTheme("winter");
    }
  };

  const navLinkClass = ({ isActive }) => 
    `font-medium tracking-wide transition-all duration-300 rounded-lg ${
      isActive 
        ? "!bg-brand-primary/10 !text-brand-primary" 
        : "text-base-content/80 hover:!bg-base-200 hover:text-base-content"
    }`;

  const navOptions = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>Home</NavLink>
      </li>
      <li>
        <NavLink to="/all-loans" className={navLinkClass}>All Loans</NavLink>
      </li>
      {!user && (
        <>
        <li>
          <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </li>
        </>
      )}
      {user && (
        <li>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
        </li>
      )}
    </>
  );

  const dropdownItems = [
    { label: user?.displayName || 'User' },
    { label: 'Dashboard', onClick: () => navigate("/dashboard") },
    { label: 'Logout', onClick: handleLogOut, danger: true }
  ];

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-xl border-b border-base-200/50 shadow-sm fixed top-0 w-full z-50 px-4 md:px-8 lg:px-12 transition-all duration-300">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navOptions}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl text-primary font-bold px-0 hover:bg-transparent">
          <img src={theme === "night" ? "/logo_dark.png" : "/logo.png"} alt="LoanLink Logo" className="h-20 w-auto logo-blend" />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navOptions}
        </ul>
      </div>
      <div className="navbar-end gap-2">
         {/* Theme Toggle */}
         <label className="swap swap-rotate btn btn-ghost btn-circle hover:bg-base-200">
            {/* this hidden checkbox controls the state */}
            <input 
                type="checkbox" 
                onChange={handleToggle} 
                checked={theme === "night"}
            />
            
            {/* sun icon */}
            <svg className="swap-on fill-current w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,4.93,1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
            
            {/* moon icon */}
            <svg className="swap-off fill-current w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z"/></svg>
        </label>

        {user ? (
          <Dropdown
            align="right"
            trigger={
              <div className="btn btn-ghost btn-circle avatar select-none cursor-pointer">
                <div className="w-10 rounded-full">
                  {user.photoURL ? (
                      <img src={user.photoURL} alt="User" />
                  ) : (
                      <FaUserCircle className="w-full h-full text-brand-text" />
                  )}
                </div>
              </div>
            }
            items={dropdownItems}
          />
        ) : (
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="rounded-full shadow-md shadow-brand-primary/20">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
