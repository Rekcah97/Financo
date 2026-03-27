import React from "react";
import { IoMdNotifications } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";

function PrivateNavBar() {
  return (
    <header>
      <nav className="flex items-center justify-between w-full p-5 bg-[var(--bg-primary)] cursor-pointer">
        <h3 className="font-[Manrope] font-bold text-white text-lg">Financo</h3>
        <div className="flex items-center gap-5">
          <a href="#" className="icon hidden sm:flex">
            <IoMdNotifications size={20} />
          </a>
          <a href="#" className="icon">
            <BsPersonCircle size={25} />
          </a>
        </div>
      </nav>
    </header>
  );
}

export default PrivateNavBar;
