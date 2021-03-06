import React, { useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./Navbar.css";
import axios from "axios";
import { useAuth } from "../../Contexts/auth-context";
import { useLoader } from "../../Contexts/LoaderContext";

const Navbar = () => {
  const [role, setRole] = React.useState("");
  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();
  const { startLoading, finishLoading } = useLoader();

  const [userIsAuthenticated, setUserIsAuthenticated] =
    React.useState(isAuthenticated);

  useEffect(() => {
    (async function getFields() {
      try {
        const role = await axios.get("/auth/getRole");
        setRole(role.data);
      } catch (error) {
        console.log("");
      }
    })();
  }, [userIsAuthenticated, isAuthenticated]);

  const handleLogout = async () => {
    startLoading();
    await axios.post("/auth/logout");
    logout();
    setUserIsAuthenticated(false);
    finishLoading();
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    table: {
      minWidth: 750,
    },
  }));

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {isAuthenticated && role == "Admin" && (
            <Typography variant="h4" className={classes.title}>
              <Link to="/GetLogs">Hemorrhage Ct Scan</Link>
            </Typography>
          )}
          {isAuthenticated && role == "Doctor" && (
            <Typography variant="h4" className={classes.title}>
              <Link to="/GetResults">Hemorrhage Ct Scan</Link>
            </Typography>
          )}

          {isAuthenticated && role == "User" && (
            <Typography variant="h4" className={classes.title}>
              <Link to="/ImageUpload">Hemorrhage Ct Scan</Link>
            </Typography>
          )}

          <div
            style={{
              width: "750px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {isAuthenticated && role == "Admin" && (
              <Link to="/GetLogs">
                <Button
                  style={{
                    background: " #5499c7 ",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Get Logs
                </Button>
              </Link>
            )}
            {isAuthenticated && (role == "Doctor" || role == "Admin") && (
              <Link to="/GetResults">
                <Button
                  style={{
                    background: " #5499c7 ",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Get Results
                </Button>
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/ImageUpload">
                <Button
                  style={{
                    background: " #5499c7 ",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Upload Brain Image
                </Button>
              </Link>
            )}

            {isAuthenticated && (
              <Button
                style={{
                  background: "#FF0000 ",
                  color: "white",
                  fontWeight: "bold",
                }}
                onClick={handleLogout}
              >
                logout
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
