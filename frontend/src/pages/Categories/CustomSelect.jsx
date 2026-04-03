import { useState } from "react";

const CustomSelect = ({ type, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selected, setSelected] = useState(
    options.find((o) => o.value === type) || options[0],
  );

  const handleSelect = (option) => {
    setSelected(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-[#1f2a42] rounded-lg text-white text-left flex justify-between items-center"
      >
        {selected.label}
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-[#1f2a42] rounded-lg overflow-hidden shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`p-4 cursor-pointer hover:bg-[#2a3a5c] text-white transition-colors
                ${selected.value === option.value ? "bg-[#2a3a5c]" : ""}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default CustomSelect;
