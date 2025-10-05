import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Department from '../models/departmentModel.js'; 


const register = async (req, res) => {
  const { name, email, password, designation, phone, department } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      department,
      designation,
      role: 'admin',
    });

    await newUser.save();


    let dept = await Department.findOne({ name: department });
    if (dept) {
      dept.employeeCount += 1;
      await dept.save();
    } else {
      dept = new Department({ name: department, employeeCount: 1 });
      await dept.save();
    }

    res.status(201).json({
      message: 'User created successfully as admin',
      token: 'your_generated_jwt_here',
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginPage = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role, designation: user.designation }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { loginPage, register }