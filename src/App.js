import AdminButton from "./components/AdminButton";
import Login from "./components/Login";
import { useAuth } from "./context/Authcontext";

function App() {
  const { user } = useAuth();
  return <>{!user ? <Login></Login> : <AdminButton />}</>;
}

export default App;