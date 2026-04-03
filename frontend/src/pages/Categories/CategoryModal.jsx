import { useState } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import CustomSelect from "./CustomSelect";

function CategoryModal({ mode = "create", categoryData = null, onClose }) {
  const isEdit = mode === "edit";
  const [form, SetForm] = useState({
    name: isEdit ? categoryData.name : "",
    desc: isEdit ? categoryData.desc : "",
  });

  const onChange = (e) => {
    SetForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <form action="">
        <div className="bg-[#111a2c] rounded-2xl p-8 w-2xl max-w-md flex flex-col gap-8 shadow-2xl ">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">
              {isEdit ? "Edit Category" : "Create Category"}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="font-bold text-sm text-[var(--text-secondary)]"
                >
                  CATEGORY NAME
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
                  htmlFor="type"
                  className="font-bold text-sm text-[var(--text-secondary)]"
                >
                  TYPE
                </label>
                <CustomSelect
                  type={categoryData.type}
                  options={[
                    { value: "income", label: "INCOME" },
                    { value: "expense", label: "EXPENSE" },
                    { value: "saving", label: "SAVING" },
                  ]}
                />
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

export default CategoryModal;
