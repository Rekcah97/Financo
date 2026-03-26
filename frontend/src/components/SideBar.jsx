import React from "react";
import { FaChartBar } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { BiCategoryAlt } from "react-icons/bi";
import { FaFlag } from "react-icons/fa";

function SideBar() {
  return (
    <div className="flex flex-col h-screen w-3xs bg-[var(--element-bg)] gap-5 ">
      <h2 className="font-[Manrope] font-bold  text-2xl pt-4 pl-4">Arpit</h2>
      <div className="flex flex-col justify-center">
        <a href="#" className="dash-link">
          <FaChartBar /> Dashboard
        </a>
        <a href="#" className="dash-link">
          <GrTransaction /> Allocation
        </a>
        <a href="#" className="dash-link">
          <BiCategoryAlt /> Categories
        </a>
        <a href="#" className="dash-link">
          <FaFlag /> Goals
        </a>
      </div>
    </div>
  );
}
export default SideBar;
