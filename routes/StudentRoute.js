const express = require('express');
const router = express.Router();
const Student = require('../models/StudentModel');


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the student with the provided email
        const student = await Student.findOne({ email });

        // If student doesn't exist or password is incorrect, return error
        if (!student || student.password !== password) {
            return res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
        }

        // If authentication is successful, return login status and student id
        res.status(200).json({ loginStatus: true, id: student._id }); // Include student id in the response
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ loginStatus: false, error: 'Internal server error' });
    }
});

// Route to get count of students
router.get('/student_count', async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        res.json({ success: true, studentCount });
    } catch (error) {
        console.error('Error fetching student count:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch student count' });
    }
  });

  router.get('/student_detail/:id', async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(student);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  
router.get('/student', async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).send({ error: "Failed to fetch students" });
    }
});

// Save a new student
router.post('/', (req, res) => {
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
});

// Update a student
router.put('/edit_student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, department_id } = req.body;

        // Check if the ID is valid
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid student ID' });
        }

        // Find the student by ID and update their information
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { name, email, password, department_id },
            { new: true } // Return the updated document
        );

        // If no student is found with the given ID, return a 404 error
        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        // If the update is successful, return the updated student
        res.json(updatedStudent);
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Failed to update student" });
    }
});

// Delete a student
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Student.findByIdAndDelete(id)
        .then(() => res.send("Student deleted successfully"))
        .catch((err) => {
            console.error("Error deleting student:", err);
            res.status(500).send({ error: err, msg: "Failed to delete student" });
        });
});

router.get('/student/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Failed to fetch student' });
    }
});



//Department

const {
    getDepartments,
    addDepartment, // Updated function name
    updateDepartment,
    deleteDepartment,
    getDepartmentByID
} = require('../controllers/DepartmentControllers');

// Endpoint to get all departments
router.get('/department', getDepartments);

// Endpoint to add a new department
router.post('/add_department', addDepartment); // Updated function name

// Endpoint to update a department by ID
router.put('/update/:id', updateDepartment);

// Endpoint to delete a department by ID
router.delete('/delete/:id', deleteDepartment);

// Endpoint to get a department by its ID
router.get('/department/:departmentId', getDepartmentByID);

module.exports = router;
