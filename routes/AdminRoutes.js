const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const AdminModel = require ('../models/AdminModel.js')
const DepartmentModel = require ('../models/DepartmentModel.js')
const TeacherModel = require ('../models/TeacherModel.js')
const StudentModel = require ('../models/StudentModel.js')

const router = express.Router();
router.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;
  try {
      // Find the admin with the provided email
      const admin = await AdminModel.findOne({ email });

      // If admin doesn't exist or password is incorrect, return error
      if (!admin || admin.password !== password) {
          return res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
      }
      res.status(200).json({ loginStatus: true });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ loginStatus: false, error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  // Assuming you're using session-based authentication
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('session-id');
    console.log('User logged out successfully');
    res.json({ message: 'Logged out successfully' });
  });
});


router.get("/get_admin", async (req, res) => {
    const { email } = req.query;
    try {
      const admin = await AdminModel.findOne({ email });
      if (!admin) {
        return res.status(404).json({ Error: 'Admin not found' });
      }
      return res.json(admin);
    } catch (err) {
      console.error('Error fetching admin details:', err);
      return res.status(500).json({ Error: 'Internal server error' });
    }
  });

// Get all departments
router.get('/department', async (req, res) => {
  try {
    const departments = await DepartmentModel.find();
    return res.json({ Status: true, Result: departments });
  } catch (err) {
    console.error('Error fetching departments:', err);
    return res.status(500).json({ Status: false, Error: 'Internal server error' });
  }
});

// Add a new department
router.post('/add_department', async (req, res) => {
  try {
    const { name } = req.body;
    const department = new DepartmentModel({ name });
    await department.save();
    return res.json({ Status: true });
  } catch (err) {
    console.error('Error adding department:', err);
    return res.status(500).json({ Status: false, Error: 'Internal server error' });
  }
});

router.delete('/delete_department/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await DepartmentModel.findByIdAndDelete(id);
      return res.json({ Status: true });
    } catch (err) {
      console.error('Error deleting teacher:', err);
      return res.status(500).json({ Status: false, Error: 'Internal server error' });
    }
  });
  

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage });

// Add a new teacher
router.post('/add_teacher', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, department_id } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const teacher = new TeacherModel({ name, email, password: hash, department_id });
    await teacher.save();
    return res.json({ Status: true });
  } catch (err) {
    console.error('Error adding teacher:', err);
    return res.status(500).json({ Status: false, Error: 'Internal server error' });
  }
});

// Get all teachers
router.get('/teacher', async (req, res) => {
  try {
    const teachers = await TeacherModel.find();
    return res.json({ Status: true, Result: teachers });
  } catch (err) {
    console.error('Error fetching teachers:', err);
    return res.status(500).json({ Status: false, Error: 'Internal server error' });
  }
});

// Get teacher by ID
router.get('/teacher/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await TeacherModel.findById(id);
    if (!teacher) {
      return res.status(404).json({ Status: false, Error: 'Teacher not found' });
    }
    return res.json({ Status: true, Result: teacher });
  } catch (err) {
    console.error('Error fetching teacher:', err);
    return res.status(500).json({ Status: false, Error: 'Internal server error' });
  }
});

// Update teacher
router.put('/edit_teacher/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const { name, email, department_id } = req.body;
      await TeacherModel.findByIdAndUpdate(id, { name, email, department_id });
      return res.json({ Status: true });
  } catch (err) {
      console.error('Error updating teacher:', err);
      return res.status(500).json({ Status: false, Error: 'Internal server error' });
  }
});


// Delete teacher
router.delete('/delete_teacher/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await TeacherModel.findByIdAndDelete(id);
    return res.json({ Status: true });
  } catch (err) {
    console.error('Error deleting teacher:', err);
    return res.status(500).json({ Status: false, Error: 'Internal server error' });
  }
});

const {
    getDepartments,
    saveDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentByID
} = require('../controllers/departmentControllers');

// Endpoint to get all departments
router.get('/department', getDepartments);

// Endpoint to add a new department
router.post('/add_department', saveDepartment);

// Endpoint to update a department by ID
router.put('/update/:id', updateDepartment);

// Endpoint to delete a department by ID
router.delete('/delete/:id', deleteDepartment);

// Endpoint to get a department by its ID
router.get('/department/:id', getDepartmentByID);
// More routes can be added similarly for students, admins, etc.

router.get('/student_detail/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || id === 'undefined') { // Check if id is undefined or 'undefined'
            return res.status(400).json({ error: 'Invalid id' });
        }
        // Convert id to ObjectId before querying the database
        const mongoose = require('mongoose');
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            return res.status(400).json({ error: 'Invalid id format' });
        }
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
router.put('/edit_student/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, department_id } = req.body;
    // Use { new: true } option to return the updated document
    Student.findByIdAndUpdate(id, { name, email, password, department_id }, { new: true })
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return res.status(404).send({ error: "Student not found" });
            }
            res.json(updatedStudent);
        })
        .catch((err) => {
            console.error("Error updating student:", err);
            res.status(500).send({ error: err, msg: "Failed to update student" });
        });
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

// Middleware for input validation (example)
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID' });
  }
  next();
};

// Route to get count of admins
router.get('/admin_count', async (req, res) => {
  try {
      const adminCount = await AdminModel.countDocuments();
      res.json({ success: true, adminCount });
  } catch (error) {
      console.error('Error fetching admin count:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch admin count' });
  }
});

// Route to get count of students
router.get('/student_count', async (req, res) => {
  try {
      const studentCount = await StudentModel.countDocuments();
      res.json({ success: true, studentCount });
  } catch (error) {
      console.error('Error fetching student count:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch student count' });
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

// Route to get admin records
router.get('/admin_records', async (req, res) => {
  try {
      const admins = await AdminModel.find();
      res.json({ success: true, admins });
  } catch (error) {
      console.error('Error fetching admin records:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch admin records' });
  }
});
  
// Login endpoint
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

router.get('/teacher_detail/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || id === 'undefined') { // Check if id is undefined or 'undefined'
            return res.status(400).json({ error: 'Invalid id' });
        }
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ error: 'Failed to fetch teacher' });
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

// Save a new teacher
router.post('/teacher', (req, res) => {
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
router.put('/teacher/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, department_id } = req.body;
    Teacher.findByIdAndUpdate(id, { name, email, password, department_id })
        .then(() => res.send("Teacher updated successfully"))
        .catch((err) => {
            console.error("Error updating teacher:", err);
            res.status(500).send({ error: err, msg: "Failed to update teacher" });
        });
});

// Delete a teacher
router.delete('/teacher/:id', (req, res) => {
    const { id } = req.params;
    Teacher.findByIdAndDelete(id)
        .then(() => res.send("Teacher deleted successfully"))
        .catch((err) => {
            console.error("Error deleting teacher:", err);
            res.status(500).send({ error: err, msg: "Failed to delete teacher" });
        });
});

  module.exports = router;

