const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  body: String,
  isComplete: { type: String, required: true },
  synopsis: String,
  date: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;