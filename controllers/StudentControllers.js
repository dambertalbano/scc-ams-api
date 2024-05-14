const express = require('express');
const router = express.Router();
const Student = require('../models/StudentModel');
const DepartmentModel = require('../models/DepartmentModel');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student || student.password !== password) {
            return res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
        }
        res.status(200).json({ loginStatus: true });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ loginStatus: false, error: 'Internal server error' });
    }
});

module.exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).send({ error: "Failed to fetch students" });
    }
};

module.exports.saveStudent = (req, res) => {
    const { name, email, password, department_id } = req.body;
    Student.create({ name, email, password, department_id })
        .then((data) => {
            console.log("Student saved successfully:", data);
            res.status(201).send(data);
        })
        .catch((err) => {
            console.error("Error saving student:", err);
            res.status(500).send({ error: err, msg: "Failed to save student" });
        });
};

module.exports.updateStudent = (req, res) => {
    const { id } = req.params;
    const { name, email, password, department_id } = req.body;
    Student.findByIdAndUpdate(id, { name, email, password, department_id })
        .then(() => res.send("Student updated successfully"))
        .catch((err) => {
            console.error("Error updating student:", err);
            res.status(500).send({ error: err, msg: "Failed to update student" });
        });
};

module.exports.deleteStudent = (req, res) => {
    const { id } = req.params;
    Student.findByIdAndDelete(id)
        .then(() => res.send("Student deleted successfully"))
        .catch((err) => {
            console.error("Error deleting student:", err);
            res.status(500).send({ error: err, msg: "Failed to delete student" });
        });
};

module.exports.addStudent = (req, res) => {
    const { name, email, password, department_id } = req.body;
    Student.create({ name, email, password, department_id })
        .then((data) => {
            console.log("Student added successfully:", data);
            res.status(201).send(data);
        })
        .catch((err) => {
            console.error("Error adding student:", err);
            res.status(500).send({ error: err, msg: "Failed to add student" });
        });
};


// Department

module.exports.getDepartments = async (req, res) => {
    try {
        const departments = await DepartmentModel.find();
        res.send(departments);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).send({ error: "Failed to fetch departments" });
    }
};

module.exports.saveDepartment = (req, res) => {
    const { department } = req.body;
    DepartmentModel.create({ department })
        .then((data) => {
            console.log("Saved Successfully...");
            res.status(201).send(data);
        })  
        .catch((err) => {
            console.error(err);
            res.status(500).send({ error: err, msg: "Something went wrong" });
        });
};

module.exports.updateDepartment = (req, res) => {
    const { id } = req.params;
    const { department } = req.body;
    DepartmentModel.findByIdAndUpdate(id, { department })
        .then(() => res.send("Updated Successfully"))
        .catch((err) => {
            console.error(err);
            res.status(500).send({ error: err, msg: "Something went wrong" });
        });
};

module.exports.deleteDepartment = (req, res) => {
    const { id } = req.params;
    DepartmentModel.findByIdAndDelete(id)
        .then(() => res.send("Deleted Successfully"))
        .catch((err) => {
            console.error(err);
            res.status(500).send({ error: err, msg: "Something went wrong" });
        });
};

module.exports.addDepartment = (req, res) => {
    const { department } = req.body;
    DepartmentModel.create({ department })
        .then((data) => {
            console.log("Department added successfully:", data);
            res.status(201).send(data);
        })
        .catch((err) => {
            console.error("Error adding department:", err);
            res.status(500).send({ error: err, msg: "Failed to add department" });
        });
};

module.exports.getDepartmentByID = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await DepartmentModel.findById(id);
        if (!department) {
            return res.status(404).send({ error: "Department not found" });
        }
        res.send(department);
    } catch (error) {
        console.error("Error fetching department by ID:", error);
        res.status(500).send({ error: "Failed to fetch department" });
    }
};

module.exports = router;


