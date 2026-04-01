import { createContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [category, setCategory] = useState([
    {
      name: "Food & Dining",
      desc: "Restaurants, Groceries, Takeout",
      type: "expense",
      spent: 320,
      limit: 500,
      color: "#ef4444",
    },
    {
      name: "Entertainment",
      desc: "Streaming, Cinema, Events",
      type: "expense",
      spent: 245,
      limit: 300,
      color: "#a855f7",
    },
    {
      name: "Health",
      desc: "Gym, Medicine, Checkups",
      type: "expense",
      spent: 180,
      limit: 250,
      color: "#ec4899",
    },
    {
      name: "Transport",
      desc: "Fuel, Bus, Taxi",
      type: "expense",
      spent: 90,
      limit: 150,
      color: "#f97316",
    },
    {
      name: "Shopping",
      desc: "Clothes, Gadgets, Accessories",
      type: "expense",
      spent: 410,
      limit: 400,
      color: "#eab308",
    },
    {
      name: "Utilities",
      desc: "Electricity, Water, Internet",
      type: "expense",
      spent: 60,
      limit: 100,
      color: "#64748b",
    },
    {
      name: "Freelance",
      desc: "Web Dev, Design Projects",
      type: "income",
      spent: 1200,
      limit: 1500,
      color: "#22c55e",
    },
    {
      name: "Salary",
      desc: "Monthly Job Income",
      type: "income",
      spent: 2000,
      limit: 2000,
      color: "#10b981",
    },
    {
      name: "Side Business",
      desc: "Reselling, Consulting",
      type: "income",
      spent: 450,
      limit: 600,
      color: "#06b6d4",
    },
    {
      name: "Emergency Fund",
      desc: "Unexpected Expenses Buffer",
      type: "saving",
      spent: 300,
      limit: 500,
      color: "#3b82f6",
    },
    {
      name: "Vacation",
      desc: "Travel, Hotels, Activities",
      type: "saving",
      spent: 150,
      limit: 400,
      color: "#f43f5e",
    },
    {
      name: "Investment",
      desc: "Stocks, Crypto, Mutual Funds",
      type: "saving",
      spent: 500,
      limit: 800,
      color: "#6366f1",
    },
  ]);
  return (
    <CategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
