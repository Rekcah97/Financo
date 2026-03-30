import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import GoalsCard from "./GoalsCard";
function Goals() {
  const goals = [
    {
      id: 1,
      name: "Emergency Fund",
      desc: "3 months of living expenses saved",
      allocated: "15,000",
      target: "50,000",
      date: "31 Dec, 2025",
      color: "#10b981",
    },
    {
      id: 2,
      name: "New Laptop",
      desc: "Save up for a dev machine upgrade",
      allocated: "20,000",
      target: "80,000",
      date: "15 Mar, 2026",
      color: "#6366f1",
      priority: true,
    },
    {
      id: 3,
      name: "Vacation Trip",
      desc: "Trip to Pokhara with friends",
      allocated: "5,000",
      target: "25,000",
      date: "10 Jun, 2026",
      color: "#f59e0b",
    },
    {
      id: 4,
      name: "Startup Fund",
      desc: "Initial capital for cafe + gaming hub",
      allocated: "10,000",
      target: "500,000",
      date: "1 Jan, 2027",
      color: "#ef4444",
    },
    {
      id: 5,
      name: "Course & Books",
      desc: "Invest in learning resources",
      allocated: "2,000",
      target: "10,000",
      date: "30 Apr, 2026",
      color: "#3b82f6",
    },
  ];
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
