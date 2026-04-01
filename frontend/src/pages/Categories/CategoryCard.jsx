import React, { useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import DeleteModal from "../../components/ui/DeleteModal";

function CategoryCard({ category }) {
  const [deleteItem, setDeleteItem] = useState(false);
  const percentage = (category.spent / category.limit) * 100;
  const upperType = category.type.toUpperCase();
  return (
    <>
      {deleteItem && (
        <DeleteModal
          title="Category"
          name={category.name}
          onClose={() => setDeleteItem(false)}
        />
      )}
      <div className="flex flex-col justify-between bg-[var(--button)] rounded-2xl p-5 gap-3 h-52">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <h2 className="font-bold text-xl leading-tight line-clamp-1">
                {category.name}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm line-clamp-1">
                {category.desc}
              </p>
            </div>
            <div className="flex items-center gap-3 text-lg shrink-0 ml-3">
              <button className="cursor-pointer hover:text-[var(--tertiary-dark)]">
                <LuPencil />
              </button>
              <button
                className="cursor-pointer hover:text-red-400"
                onClick={() => setDeleteItem(true)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <div>
            <p className="bg-[#1f2a42] inline-block px-2 py-1 rounded text-sm">
              TYPE: {upperType}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="flex items-center text-sm">
              Spent : <MdCurrencyRupee /> {category.spent}
            </p>
            <p className="flex items-center text-sm text-[var(--text-secondary)]">
              Limit : <MdCurrencyRupee />
              {category.limit}
            </p>
          </div>
        </div>

        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${percentage}%`, backgroundColor: category.color }}
          />
        </div>
      </div>
    </>
  );
}

export default CategoryCard;
