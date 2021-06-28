const express = require("express");
const router = express.Router();
const Log = require("../../models/log.model");
const User = require("../../models/user.model");

const userAuth = require("../../middleware/userAuth");
const adminAuth = require("../../middleware/adminAuth");
const doctorAuth = require("../../middleware/doctorAuth");
const logs = require("../../models/log.model");
const Test = require("../../models/test.model");
router.get("/getLogs", adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    finalLogs = await logs.find({
      actionDate: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.json(finalLogs);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.get("/getResults", doctorAuth, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    result = await Test.find({
      doctorEmail: user.email,
    });
    const newlog = new Log({ actionName: "Show Test/s", user: user.email });
    await newlog.save();
    res.json(result);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.get("/getDoctors", userAuth, async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" });

    res.json(doctors);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.post("/test", userAuth, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    const { examineeId, doctorEmail, testResult } = req.body;
    const newTest = new Test({ examineeId, testResult, doctorEmail });
    await newTest.save();
    const newlog = new Log({ actionName: "Test Sent", user: user.email });
    await newlog.save();
    res.json("test sent");
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

module.exports = router;
