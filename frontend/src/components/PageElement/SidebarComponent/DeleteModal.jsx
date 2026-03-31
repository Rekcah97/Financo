import React from "react";

function DeleteModal({ title, name, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-[#111a2c] rounded-2xl p-8 w-2xl max-w-md flex flex-col gap-3 shadow-2xl">
        <div>
          <h2 className="font-bold text-xl">
            Delete {title} -{" "}
            <span className="font-bold text-md text-[var(--text-secondary)]">
              [{name}]
            </span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 p-4 cursor-pointer font-bold bg-red-700 opacity-80 rounded-xl hover:opacity-50">
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 p-4 cursor-pointer font-bold bg-[#1f2a42] rounded-xl hover:opacity-70"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
