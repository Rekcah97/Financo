import { useContext } from "react";
import CategoryContext from "../../context/CategoryContext";
import { FaPlusCircle } from "react-icons/fa";
import CategoryCard from "./CategoryCard";
function Categories() {
  const { category } = useContext(CategoryContext);
  return (
    <div className="flex flex-col gap-7 ">
      <div className="flex items-end w-full justify-between">
        <div className="flex flex-col gap-2 ">
          <h2 className=" font-bold text-5xl">Categories</h2>
          <p className="text-[var(--text-secondary)]">
            Curate your spending architecture. Define limits that align with
            your lifestyle goals.
          </p>
        </div>
        <div>
          <button className="hidden sm:flex items-center text-[var(--primary)] cursor-pointer gap-2 bg-[var(--button)] px-7 py-4 rounded-3xl hover:opacity-80">
            <FaPlusCircle className="text-xl" />
            Create a New Category
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-5 ">
        <div>
          <h3 className="font-bold text-2xl">Active Categories</h3>
        </div>

        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {category.map((cat) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              desc={cat.desc}
              type={cat.type}
              spent={cat.spent}
              lastMonth={cat.limit}
              color={cat.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
