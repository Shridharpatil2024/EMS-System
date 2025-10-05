import Department from '../models/departmentModel.js';


const createDepartment = async (req, res) => {
  try {
    const { name, employeeCount } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const existingDept = await Department.findOne({ name });
    if (existingDept) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const newDepartment = new Department({ name, employeeCount });
    await newDepartment.save();

    res.status(201).json({ message: "Department created successfully", department: newDepartment });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const updateDepartment = async (req, res) => {
  try {
    const { oldName, name, employeeCount } = req.body;

    if (!oldName) {
      return res.status(400).json({ message: "Original department name is required" });
    }

    const updatedDept = await Department.findOneAndUpdate(
      { name: oldName },               
      { name, employeeCount },         
      { new: true }                    
    );

    if (!updatedDept) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department updated successfully", department: updatedDept });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteDepartment = async (req, res) => {
  try {
    const { name } = req.body; 

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const deletedDept = await Department.findOneAndDelete({ name });

    if (!deletedDept) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export{
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment
}