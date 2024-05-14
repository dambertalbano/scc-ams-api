// teacherRoutes.js

const express = require('express');
const router = express.Router();
const Teacher = require('../models/TeacherModel'); // Assuming you have a model for Teacher

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the teacher with the provided email
        const teacher = await Teacher.findOne({ email });

        // If teacher doesn't exist or password is incorrect, return error
        if (!teacher || teacher.password !== password) {
            return res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
        }

        // If authentication is successful, set a session or JWT token and return success
        // For demonstration purposes, setting a simple flag in localStorage
        // You may want to use a more secure method like JWT
        res.status(200).json({ loginStatus: true });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ loginStatus: false, error: 'Internal server error' });
    }
});

module.exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.send(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).send({ error: "Failed to fetch teachers" });
    }
};

module.exports.saveTeacher = (req, res) => {
    const { name, email, password, department_id } = req.body;
    Teacher.create({ name, email, password, department_id })
        .then((data) => {
            console.log("Teacher saved successfully:", data);
            res.status(201).send(data);
        })
        .catch((err) => {
            console.error("Error saving teacher:", err);
            res.status(500).send({ error: err, msg: "Failed to save teacher" });
        });
};

module.exports.updateTeacher = (req, res) => {
    const { id } = req.params;
    const { name, email, password, department_id } = req.body;
    Teacher.findByIdAndUpdate(id, { name, email, password, department_id })
        .then(() => res.send("Teacher updated successfully"))
        .catch((err) => {
            console.error("Error updating teacher:", err);
            res.status(500).send({ error: err, msg: "Failed to update teacher" });
        });
};

module.exports.deleteTeacher = (req, res) => {
    const { id } = req.params;
    Teacher.findByIdAndDelete(id)
        .then(() => res.send("Teacher deleted successfully"))
        .catch((err) => {
            console.error("Error deleting teacher:", err);
            res.status(500).send({ error: err, msg: "Failed to delete teacher" });
        });
};

module.exports.addTeacher = (req, res) => {
    const { name, email, password, department_id } = req.body;
    Teacher.create({ name, email, password, department_id })
        .then((data) => {
            console.log("Teacher added successfully:", data);
            res.status(201).send(data);
        })
        .catch((err) => {
            console.error("Error adding teacher:", err);
            res.status(500).send({ error: err, msg: "Failed to add teacher" });
        });
};

module.exports = router;



