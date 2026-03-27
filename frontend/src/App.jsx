import PrivateNavBar from "./components/NavBar/PrivateNavBar";
import PublicNavBar from "./components/NavBar/PublicNavBar";
import SideBar from "./components/PageElement/SideBar";
import Login from "./components/auth/Login";
import Footer from "./components/PageElement/Footer";
function App() {
  const log = false;
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        {log ? <PrivateNavBar /> : <PublicNavBar />}
        <div className="flex flex-1 overflow-hidden">
          {/* <SideBar userName={"Arpit"} /> */}
          <Login />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
