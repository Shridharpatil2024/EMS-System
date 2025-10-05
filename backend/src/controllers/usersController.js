import Department from '../models/departmentModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import Image from '../models/imagesModel.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';


const getUsersByEmailId = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const latestImage = await Image.findOne({ name: user.name })
            .sort({ createdAt: -1 }); 

        res.json({
            name: user.name,
            email: user.email,
            designation: user.designation,
            phone: user.phone,
            department: user.department,
            profileImage: latestImage ? latestImage.url : null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    const { name, phone, designation, department, email } = req.body;

    try {
        let profileImageUrl;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'profile_images',
                public_id: `${email}_profile`,
                overwrite: true
            });

            profileImageUrl = result.secure_url;

            const existingImage = await Image.findOne({ name });

            if (existingImage) {
                existingImage.url = profileImageUrl;
                await existingImage.save();
            } else {
                await Image.create({
                    name,
                    url: profileImageUrl
                });
            }

            fs.unlinkSync(req.file.path);
        }

       
        const updateData = { name, phone, designation, department };

        const updatedUser = await User.findOneAndUpdate(
            { email },
            updateData,
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        const latestImage = await Image.findOne({ name: updatedUser.name });

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                ...updatedUser.toObject(),
                profileImage: latestImage ? latestImage.url : null
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


const createUser = async (req, res) => {
    const { name, email, password, phone, designation, department } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, Email, and Password are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            designation,
            department
        });

        await newUser.save();

        if (department) {
            const dept = await Department.findOne({ name: department });
            if (dept) {
                dept.employeeCount += 1;
                await dept.save();
            } else {
                const newDept = new Department({ name: department, employeeCount: 1 });
                await newDept.save();
            }
        }

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        if (deletedUser.department) {
            const dept = await Department.findOne({ name: deletedUser.department });
            if (dept) {
                dept.employeeCount -= 1;

                if (dept.employeeCount <= 0) {
                    await Department.deleteOne({ name: dept.name });
                } else {
                    await dept.save();
                }
            }
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getImageByName = async (req, res) => {
    const { name } = req.params;

    try {
        const image = await Image.findOne({ name });

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.json({ url: image.url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export { getUsersByEmailId, updateUser, createUser, deleteUser, getAllUsers, getImageByName };
