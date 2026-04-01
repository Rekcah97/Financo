import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateNavBar from "./components/NavBar/PrivateNavBar";
import PublicNavBar from "./components/NavBar/PublicNavBar";
import SideBar from "./components/layout/SideBar";
import Login from "./components/auth/Login";
import Footer from "./components/layout/Footer";
import Register from "./components/auth/Register";
import Categories from "./components/pages/Categories/Categories";
import Goals from "./components/pages/Goals/Goals";

function App() {
  const log = true;
  return (
    <BrowserRouter>
      {log ? (
        <div className="flex flex-col h-screen overflow-hidden">
          <PrivateNavBar />
          <div className="flex flex-1 overflow-hidden">
            <SideBar userName={"Arpit"} />
            <main className="p-7 w-full overflow-y-auto">
              <Routes>
                <Route path="/Categories" element={<Categories />} />
                <Route path="/Goals" element={<Goals />} />
                <Route path="*" element={<Categories />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen overflow-hidden">
          <PublicNavBar />
          <div className="flex flex-1 overflow-hidden">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
