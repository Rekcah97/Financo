import { useState } from "react";
import { FaChartBar } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { BiCategoryAlt } from "react-icons/bi";
import { FaFlag } from "react-icons/fa";

function SideBar({ userName }) {
  const [activeLink, SetActiveLink] = useState("Dashboard");
  const links = [
    {
      name: "Dashboard",
      icon: <FaChartBar />,
    },
    {
      name: "Allocations",
      icon: <GrTransaction />,
    },
    {
      name: "Categories",
      icon: <BiCategoryAlt />,
    },
    {
      name: "Goals",
      icon: <FaFlag />,
    },
  ];
  return (
    <div className="flex flex-col h-screen w-3xs bg-[var(--element-bg)] gap-5 ">
      <h2 className="font-[Manrope] font-bold  text-2xl pt-4 pl-4">
        {userName}
      </h2>
      <div className="flex flex-col justify-center">
        {links.map((link) => (
          <a
            key={link.name}
            className={`dash-link ${activeLink === link.name ? "active" : ""}`}
            onClick={() => SetActiveLink(link.name)}
          >
            {link.icon}
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
export default SideBar;
