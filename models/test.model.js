const mongoose = require("mongoose");
const TestSchema = new mongoose.Schema({
  examineeId: {
    type: String,
    required: true,
  },
  doctorEmail: {
    type: String,
    required: true,
  },
  testDate: {
    type: Date,
    default: Date.now,
  },
  testResult: {
    type: Boolean,
    required: true,
  },
});

module.exports = Test = mongoose.model("TestSchema", TestSchema);
