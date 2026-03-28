import React from "react";
import { Link, useLocation } from "react-router-dom";

function PublicNavBar() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  return (
    <header>
      <nav className="flex items-center justify-between w-full p-3 bg-[var(--bg-primary)]">
        <h3 className="font-[Manrope] font-bold text-white text-lg cursor-pointer">
          Financo
        </h3>
        <div className="hidden sm:flex gap-5 items-center">
          <a href="#" className="nav-link">
            About
          </a>
          <a href="#" className="nav-link">
            Contact
          </a>
        </div>
        <Link to={isLogin ? "/register" : "/login"}>
          <button className="font-[Manrope] font-bold text-xs text-[var(--primary)] bg-[var(--element-bg)] px-4  py-2 rounded-full cursor-pointer hover:bg-[var(--element-bg-hover)] w-32">
            {isLogin ? "Create Account" : "Login"}
          </button>
        </Link>
      </nav>
    </header>
  );
}

export default PublicNavBar;
