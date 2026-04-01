import { useContext } from "react";
import { FaPlusCircle } from "react-icons/fa";
import GoalsCard from "./GoalsCard";
import GoalContext from "../../context/GoalsContext";
function Goals() {
  const { goals } = useContext(GoalContext);
  const sortedGoals = [...goals].sort(
    (a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0),
  );
  return (
    <div className="flex flex-col gap-7 ">
      <div className="flex items-end w-full justify-between">
        <div className="flex flex-col gap-2 ">
          <h2 className=" font-bold text-5xl">Goals</h2>
          <p className="text-[var(--text-secondary)]">
            Curate your spending architecture. Define limits that align with
            your lifestyle goals.
          </p>
        </div>
        <div>
          <button className="hidden sm:flex items-center text-[var(--primary)] cursor-pointer gap-2 bg-[var(--button)] px-7 py-4 rounded-3xl hover:opacity-80">
            <FaPlusCircle className="text-xl" />
            New Goal
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-5 ">
        <div>
          <h3 className="font-bold text-2xl">Your Goals</h3>
        </div>

        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {sortedGoals.map((goal) => (
            <GoalsCard
              key={goal.id}
              name={goal.name}
              desc={goal.desc}
              allocated={goal.allocated}
              target={goal.target}
              date={goal.date}
              color={goal.color}
              priority={goal.priority}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Goals;
