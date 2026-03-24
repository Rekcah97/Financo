import PrivateNavBar from "./components/NavBar/PrivateNavBar";
import PublicNavBar from "./components/NavBar/PublicNavBar";

function App() {
  const log = true;
  return <>{log ? <PrivateNavBar /> : <PublicNavBar />}</>;
}

export default App;
