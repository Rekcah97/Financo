import { useState } from "react";
import { FaChartBar } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { BiCategoryAlt } from "react-icons/bi";
import { FaFlag } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FaQuestionCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function SideBar({ userName }) {
  const [activeLink, SetActiveLink] = useState("Dashboard");
  const location = useLocation();

  const links = [
    {
      name: "Dashboard",
      icon: <FaChartBar />,
      path: "/Dashboards",
    },
    {
      name: "Allocations",
      icon: <GrTransaction />,
      path: "/Allocations",
    },
    {
      name: "Categories",
      icon: <BiCategoryAlt />,
      path: "/categories",
    },
    {
      name: "Goals",
      icon: <FaFlag />,
      path: "/Goals",
    },
  ];
  return (
    <div className="hidden sm:flex flex-col h-full w-3xs bg-[var(--element-bg)] justify-between">
      <div className="flex flex-col gap-5">
        <h2 className="font-[Manrope] font-bold  text-2xl pt-4 pl-4">
          {userName}
        </h2>
        <div className="flex flex-col justify-center">
          {links.map((link) => (
            <Link to={`${link.path}`}>
              <a
                key={link.name}
                className={`dash-link ${location.pathname === link.path ? "active" : ""}`}
                onClick={() => SetActiveLink(link.name)}
              >
                {link.icon}
                {link.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col mb-4 pl-4 gap-4">
        <a className="flex items-center  gap-3 cursor-pointer hover:text-[var(--tertiary-dark)]">
          <IoIosSettings className="text-3xl" />
          Settings
        </a>
        <a className="flex items-center gap-4   cursor-pointer hover:text-[var(--tertiary-dark)]">
          <FaQuestionCircle className="text-2xl ml-1" />
          Support
        </a>
      </div>
    </div>
  );
}
export default SideBar;
