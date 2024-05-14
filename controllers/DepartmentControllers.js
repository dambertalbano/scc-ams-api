const DepartmentModel = require('../models/DepartmentModel'); 
const express = require('express');

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
