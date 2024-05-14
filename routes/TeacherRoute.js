const express = require('express');
const router = express.Router();
const Teacher = require('../models/TeacherModel');
const Student = require('../models/StudentModel');
const Department = require('../models/DepartmentModel');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the teacher with the provided email
        const teacher = await Teacher.findOne({ email });

        // If teacher doesn't exist or password is incorrect, return error
        if (!teacher || teacher.password !== password) {
            return res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
        }

        // If authentication is successful, return login status and teacher id
        res.status(200).json({ loginStatus: true, id: teacher._id }); // Include teacher id in the response
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ loginStatus: false, error: 'Internal server error' });
    }
});

// Route to get count of teachers
router.get('/teacher_count', async (req, res) => {
    try {
        const teacherCount = await TeacherModel.countDocuments();
        res.json({ success: true, teacherCount });
    } catch (error) {
        console.error('Error fetching teacher count:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch teacher count' });
    }
  });

// Route to get teacher details by ID
router.get('/teacher_detail/:id', async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.json(teacher);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  
router.get('/teacher', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.send(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).send({ error: "Failed to fetch teachers" });
    }
});

router.get('/students', async (req, res) => {
    try {
      const departmentId = req.query.department_id; // Get department_id from query parameter
      // Fetch students with the same department_id
      const students = await Student.find({ department_id: departmentId });
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
// Save a new teacher
router.post('/', (req, res) => {
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
});

// Update a teacher
router.put('/edit_teacher/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, department_id } = req.body;
    // Use { new: true } option to return the updated document
    Teacher.findByIdAndUpdate(id, { name, email, password, department_id }, { new: true })
        .then((updatedTeacher) => {
            if (!updatedTeacher) {
                return res.status(404).send({ error: "Teacher not found" });
            }
            res.json(updatedTeacher);
        })
        .catch((err) => {
            console.error("Error updating teacher:", err);
            res.status(500).send({ error: err, msg: "Failed to update teacher" });
        });
});
// Delete a teacher
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Teacher.findByIdAndDelete(id)
        .then(() => res.send("Teacher deleted successfully"))
        .catch((err) => {
            console.error("Error deleting teacher:", err);
            res.status(500).send({ error: err, msg: "Failed to delete teacher" });
        });
});

router.get('/edit_teacher/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Validate ID format
        if (!id || id === 'undefined') {
            return res.status(400).json({ error: 'Invalid id' });
        }
        // Query database to find teacher by ID
        const teacher = await Teacher.findById(id);
        // If teacher not found, return 404 error
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        // If teacher found, return teacher data
        res.json(teacher);
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ error: 'Failed to fetch teacher' });
    }
});

module.exports = router;


