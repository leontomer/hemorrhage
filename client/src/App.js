import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Modal from "./components/Modal/Modal";
import Loader from "./components/Loader/Loader";

import { ScanBleedProvider } from "./Contexts/ScanBleedContext";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import { useAuth } from "./Contexts/auth-context";
import setAuthToken from "./utilities/setAuthToken";
import PrivateRoute from "./components/Routes/PrivateRoute";
import getLogs from "./components/getLogs/getLogs";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import GetResults from "./components/getResults/getResults";
import axios from "axios";

function App() {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  const [role, setRole] = React.useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    (async function getFields() {
      const role = await axios.get("/auth/getRole");
      setRole(role.data);
    })();
  }, [isAuthenticated]);

  return (
    <ScanBleedProvider>
      <Router>
        <Navbar />
        <Modal />
        <Loader />
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/login" component={LoginPage} />

          {role == "Admin" && (
            <PrivateRoute exact path="/GetLogs" component={getLogs} />
          )}
          {role == "Doctor" && (
            <PrivateRoute exact path="/GetResults" component={GetResults} />
          )}
          <PrivateRoute exact path="/ImageUpload" component={ImageUpload} />
        </Switch>
      </Router>
    </ScanBleedProvider>
  );
}

export default App;
