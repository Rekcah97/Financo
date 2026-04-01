import { createContext, useState } from "react";

const GoalContext = createContext();

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([
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
  ]);

  return (
    <GoalContext.Provider value={{ goals, setGoals }}>
      {children}
    </GoalContext.Provider>
  );
};

export default GoalContext;
