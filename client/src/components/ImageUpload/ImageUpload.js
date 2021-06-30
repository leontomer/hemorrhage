import React, { useEffect } from "react";
import ImageUploader from "react-images-upload";
import * as tf from "@tensorflow/tfjs";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useLoader } from "../../Contexts/LoaderContext";

import "./imageUpload.css";

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: 500,
  },
  card: {
    maxWidth: "150px",
    maxHeight: "150px",
  },

  root2: {
    maxWidth: "450px",
    display: "flex",
    boxShadow: "0px 5px 10px -2px #000000",
    margin: 30,
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
});
export default function ImageUpload() {
  const [file, setFile] = React.useState(null);
  const [model, setModel] = React.useState(null);
  const [examineeId, setExamineeId] = React.useState("");
  const [doctors, setDoctors] = React.useState([]);
  const [doctorEmail, setDoctorEmail] = React.useState("");
  const { startLoading, startLoadingModel, finishLoading } = useLoader();

  const [msg, setMsg] = React.useState(false);
  const [res, setRes] = React.useState("");
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen2(false);
  };

  useEffect(() => {
    startLoadingModel();
    (async function loadModel() {
      const brainModel = await tf.loadLayersModel(
        `${process.env.PUBLIC_URL}/model/model.json`
      );
      setModel(brainModel);
    })();
  }, []);

  useEffect(() => {
    if (model) {
      finishLoading();
    }
  }, [model]);

  useEffect(() => {
    (async function loadDoctors() {
      const docs = await axios.get("/actions/getDoctors");
      setDoctors(docs.data);
    })();
  }, []);

  const handleChange = (event) => {
    try {
      setFile(URL.createObjectURL(event.target.files[0]));
    } catch (error) {
      console.log(error);
    }
  };

  const predict = async () => {
    try {
      startLoading();
      if (!file || examineeId == "" || doctorEmail == "") {
        setOpen2(true);
        finishLoading();
        return;
      }
      const im = new Image();
      im.src = file;
      const data = tf.browser
        .fromPixels(im, 3)
        .resizeNearestNeighbor([224, 224])
        // .mean(2)
        // .toFloat()
        .expandDims(0);
      // .expandDims(3);

      let answer = model.predict(data);
      const answer2 = answer.dataSync();

      const testResult = answer2[0] > 0.5 ? true : false;

      const body = { testResult, examineeId, doctorEmail };
      await axios.post("/actions/test", body);

      if (testResult) setRes("positive-have hemorrhage");
      else setRes("negative-doesn't have hemorrhage");
      setOpen(true);
      setMsg(true);
      finishLoading();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pond">
      <Card className={classes.root2}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <div>
              <Typography variant="h3" gutterBottom>
                Upload Brain Image
              </Typography>
            </div>
            <div>
              <input type="file" onChange={handleChange} />
            </div>
            <div>
              <TextField
                required
                id="standard-required"
                label="patient id"
                onChange={(id) => setExamineeId(id.target.value)}
              />
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Doctor</InputLabel>
                <Select
                  native
                  value={doctorEmail}
                  onChange={(doctor) => setDoctorEmail(doctor.target.value)}
                  inputProps={{
                    name: "age",
                    id: "age-native-simple",
                  }}
                >
                  <option aria-label="None" value="" />
                  {doctors.map((doctor) => (
                    <option>{doctor.email}</option>
                  ))}
                </Select>
              </FormControl>
            </div>
            <br />

            <div>{file && <img src={file} width="200" height="200" />}</div>
            <div>
              <br />
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={predict}
              >
                Submit
              </Button>
            </div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="info">
                Result Saved
              </Alert>
            </Snackbar>

            <Snackbar
              open={open2}
              autoHideDuration={6000}
              onClose={handleClose2}
            >
              <Alert onClose={handleClose2} severity="error">
                you must fill all fields!
              </Alert>
            </Snackbar>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
