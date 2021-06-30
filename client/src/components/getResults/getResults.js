import React, { useState, useEffect } from "react";
import axios from "axios";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import Moment from "moment";

import { CSVLink } from "react-csv";

export default function GetResults(props) {
  const [results, setResults] = useState([]);
  let TempResults = [];
  const ref = React.createRef();

  useEffect(() => {
    (async function getResults() {
      const resultsFromServer = await axios.get("/actions/getResults");

      resultsFromServer.data.map((result) => {
        TempResults.push({
          examineeId: result.examineeId,
          testResult: result.testResult ? "Positive" : "Negative",

          testDate: Moment(result.testDate).format("MMMM Do YYYY, h:mm:ss a"),
        });
      });
      setResults(TempResults);
    })();
  }, []);

  const useStyles = makeStyles((theme) => ({
    table: {
      maxWidth: 650,
      marginTop: theme.spacing(3),
      width: "100%",
      overflowX: "auto",
      marginBottom: theme.spacing(2),
      margin: "auto",
    },
  }));
  const classes = useStyles();
  return (
    <div style={{ textAlign: "center", minHeight: 650 }}>
      <br />

      <br />

      <TableContainer component={Paper} ref={ref} className={classes.table}>
        <div>
          <Table aria-label="simple table" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Patient Id</TableCell>
                <TableCell>Test Date</TableCell>
                <TableCell>Test Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result._id}>
                  <TableCell component="th" scope="row">
                    {result.examineeId}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {result.testDate}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {result.testResult}
                  </TableCell>
                </TableRow>
              ))}{" "}
            </TableBody>{" "}
          </Table>{" "}
        </div>
      </TableContainer>
      <CSVLink data={results}>Download Results</CSVLink>
    </div>
  );
}
