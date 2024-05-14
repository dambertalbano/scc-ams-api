const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AdminModel = require('../models/AdminModel'); // Assuming AdminModel is defined in this file or imported correctly
const Department = require('../models/DepartmentModel'); // Assuming DepartmentModel is defined in this file or imported correctly

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/admin_count', async (req, res) => {
  try {
      const adminCount = await AdminModel.countDocuments();
      res.json({ Status: true, Result: [{ admin: adminCount }] });
  } catch (error) {
      console.error('Error fetching admin count:', error);
      res.status(500).json({ Status: false, Error: 'Failed to fetch admin count' });
  }
});

app.post('/api/add_department', async (req, res) => {
  try {
    const { task } = req.body;
    const department = new Department({ task });
    await department.save();
    res.json({ Status: true });
  } catch (error) {
    res.status(500).json({ Status: false, Error: error.message });
  }
});

app.post('/adminlogin', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ loginStatus: false, error: 'Invalid credentials' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ loginStatus: false, error: 'Invalid credentials' });
    }
    // If credentials are valid
    return res.status(200).json({ loginStatus: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
