import AdminButton from "./components/AdminButton";
import { BrowserRouter as Router, Route, Navigate } from "react-router-dom";
import AdminPage from "./components/AdminPage";

function App() {
  return (
    <>
      <Router>
        <Route path="/admin">
          <AdminPage />
        </Route>
        <Route path="/">
          <h1 className="text-3xl font-bold underline">My App</h1>
        </Route>
      </Router>
    </>
  );
}

export default App;
