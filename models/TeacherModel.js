const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    department_id: String
  });

module.exports = mongoose.model("Teacher", teacherSchema);
