import PrivateNavBar from "./components/NavBar/PrivateNavBar";
import PublicNavBar from "./components/NavBar/PublicNavBar";
import SideBar from "./components/SideBar";

function App() {
  const log = true;
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        {log ? <PrivateNavBar /> : <PublicNavBar />}
        <div className="flex flex-1 overflow-hidden">
          <SideBar userName={"Arpit"} />
        </div>
      </div>
    </>
  );
}

export default App;
