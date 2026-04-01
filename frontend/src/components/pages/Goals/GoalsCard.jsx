import React, { useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import EditGoalModal from "./EditGoalModal";
import DeleteModal from "../../ui/DeleteModal";

function GoalsCard({ name, desc, allocated, target, date, color, priority }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const percentage =
    (parseFloat(allocated.replace(/,/g, "")) /
      parseFloat(target.replace(/,/g, ""))) *
    100;

  return (
    <>
      {isOpen && (
        <EditGoalModal allocated={allocated} onClose={() => setIsOpen(false)} />
      )}
      {deleteItem && (
        <DeleteModal
          title="Goal"
          name={name}
          onClose={() => setDeleteItem(false)}
        />
      )}
      {priority === true ? (
        <div className="col-span-1 sm:col-span-2 flex flex-col justify-between bg-[var(--button)] rounded-2xl p-5 gap-3 h-55">
          <div className="flex justify-between">
            <div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h2 className="font-bold text-xl leading-tight line-clamp-1">
                      {name}
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm line-clamp-1">
                      {desc}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="bg-[#1f2a42] inline-block px-2 py-1 rounded text-sm font-bold text-[var(--neon-Blue)]">
                    Pirority
                  </p>
                </div>
                <div className="flex items-center justify-between ">
                  <p className="flex flex-col items-center text-sm">
                    Allocated Money
                    <b className="flex items-center text-3xl">
                      <MdCurrencyRupee /> {allocated}
                    </b>
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-3">
                {" "}
                <div>
                  <p className="text-[var(--text-secondary)]">
                    Target Deadline
                  </p>
                  <p className="flex justify-center">{date}</p>
                </div>
                <div className="flex items-center gap-3 text-lg shrink-0 ml-3">
                  <button
                    className="cursor-pointer hover:text-[var(--tertiary-dark)] p-2"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    <LuPencil />
                  </button>

                  <button
                    className="cursor-pointer hover:text-red-400 p-2"
                    onClick={() => {
                      setDeleteItem(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex items-center justify-between ">
                  <p className="flex flex-col items-center text-sm text-[var(--text-secondary)]">
                    Target Amount
                    <b className="flex items-center text-xl">
                      <MdCurrencyRupee /> {target}
                    </b>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between bg-[var(--button)] rounded-2xl p-5 gap-3 h-52">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <h2 className="font-bold text-xl leading-tight line-clamp-1">
                  {name}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm line-clamp-1">
                  {desc}
                </p>
              </div>
              <div className="flex items-center gap-3 text-lg shrink-0 ml-3">
                <button
                  className="cursor-pointer hover:text-[var(--tertiary-dark)]"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <LuPencil />
                </button>

                <button
                  className="cursor-pointer hover:text-red-400"
                  onClick={() => {
                    setDeleteItem(true);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="flex items-center text-sm">
                <b className="flex items-center text-sm">
                  <MdCurrencyRupee /> {allocated}
                </b>{" "}
                /{" "}
                <span className="flex items-center text-sm text-[var(--text-secondary)]">
                  {" "}
                  <MdCurrencyRupee /> {target}
                </span>
              </p>
            </div>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <MdOutlineDateRange />
              <p>Due</p>
              {date}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GoalsCard;
