import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { useLoader } from "../../Contexts/LoaderContext";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Loader() {
  const { isLoading, isModelLoading } = useLoader();

  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={isLoading}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {isModelLoading && (
          <Typography variant="h4" gutterBottom>
            Loading Model...
          </Typography>
        )}
        <CircularProgress color="inherit" />
      </div>
    </Backdrop>
  );
}
