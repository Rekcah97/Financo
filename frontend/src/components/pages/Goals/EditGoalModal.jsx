import React, { useState } from "react";
import { IoIosInformationCircle } from "react-icons/io";

function EditGoalModal({ allocated, onClose }) {
  const [form, SetForm] = useState({ name: "", desc: "", allocate: "" });
  const onChange = (e) => {
    SetForm({ ...form, [e.target.name]: e.target.value });
  };
  const money = 200;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <form action="">
        <div className="bg-[#111a2c] rounded-2xl p-8 w-2xl max-w-md flex flex-col gap-8 shadow-2xl ">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">Edit Goal</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="font-bold text-sm text-[var(--text-secondary)]"
                >
                  GOAL NAME
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  required
                  onChange={onChange}
                  className="input-box bg-[#1f2a42] "
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="desc"
                  className="font-bold text-sm text-[var(--text-secondary)]"
                >
                  DESCRIPTION
                </label>
                <textarea
                  type="text"
                  name="desc"
                  id="desc"
                  value={form.desc}
                  required
                  onChange={onChange}
                  className="input-box resize-none bg-[#1f2a42] "
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="allocate"
                  className="font-bold text-sm text-[var(--text-secondary)]"
                >
                  ALLOCATE
                </label>
                <input
                  type="text"
                  name="allocate"
                  id="allocate"
                  value={form.allocate}
                  required
                  onChange={onChange}
                  className="input-box bg-[#1f2a42] "
                />
                <p className="flex items-center gap-1 text-[var(--tertiary-dark)]">
                  <IoIosInformationCircle />
                  Currently Alloacted: ${allocated}
                </p>
              </div>

              <div className="flex justify-between p-4 bg-[#1f2a42] rounded-lg">
                <p>Set as Priority Goal</p>
                <label className="relative inline-block w-14 h-7">
                  <input type="checkbox" className="opacity-0 w-0 h-0 peer" />
                  <span
                    className="absolute cursor-pointer inset-0 bg-gray-400 rounded-full transition-all duration-400 peer-checked:bg-[var(--primary)]
      before:content-[''] before:absolute before:h-6 before:w-6 before:left-0.5 before:bottom-0.5 
      before:bg-white before:rounded-full before:transition-all before:duration-400
      peer-checked:before:translate-x-7"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 p-4 cursor-pointer  font-bold text-[var(--box-bg)] bg-[linear-gradient(90deg,_#9b9efd_0%,_#8588f7_50%,_#6265ee_100%)] rounded-full hover:opacity-70">
              Save Change
            </button>
            <button
              onClick={onClose}
              className="flex-1 p-4 cursor-pointer font-bold bg-[#1f2a42] rounded-full hover:opacity-70"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditGoalModal;
