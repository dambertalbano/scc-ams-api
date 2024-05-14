const mongoose = require("mongoose")

const departmentSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Department", departmentSchema);