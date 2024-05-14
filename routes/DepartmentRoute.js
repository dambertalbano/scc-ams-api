const { Router } = require("express");

const {
    getDepartments,
    addDepartment, 
    updateDepartment,
    deleteDepartment,
    getDepartmentByID
} = require('../controllers/DepartmentControllers');

const router = Router();

// Endpoint to get all departments
router.get('/department', getDepartments);

// Endpoint to add a new department
router.post('/add_department', addDepartment); 

// Endpoint to update a department by ID
router.put('/update/:id', updateDepartment);

// Endpoint to delete a department by ID
router.delete('/delete/:id', deleteDepartment);

// Endpoint to get a department by its ID
router.get('/department/:id', getDepartmentByID); // Updated parameter name

module.exports = router;
