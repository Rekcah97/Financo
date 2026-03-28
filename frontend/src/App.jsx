import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateNavBar from "./components/NavBar/PrivateNavBar";
import PublicNavBar from "./components/NavBar/PublicNavBar";
import SideBar from "./components/PageElement/SideBar";
import Login from "./components/auth/Login";
import Footer from "./components/PageElement/Footer";
import Register from "./components/auth/Register";
function App() {
  const log = true;
  return (
    <BrowserRouter>
      {log ? (
        <div className="flex flex-col h-screen overflow-hidden">
          <PrivateNavBar />
          <div className="flex flex-1 overflow-hidden">
            <SideBar userName={"Arpit"} />
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
