import LeaveRequest from '../models/leaveRequestModel.js'
import Leave from '../models/leavesModel.js';
import User from '../models/userModel.js'


const newLeaveRequest = async (req, res) => {
    try {
        const leave = new LeaveRequest(req.body);
        await leave.save();
        res.status(201).json({ message: 'Leave request submitted successfully', leave });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting leave request', error: err.message });
    }
}


const getLeaveSummary = async (req, res) => {
    try {
        const userEmail = req.query.email;

        const leaves = await Leave.find();
        const totalLeaves = leaves.reduce((sum, leave) => sum + leave.count, 0);

        const leaveRequests = await LeaveRequest.find({
            email: userEmail,
            status: 'approved'
        });

        let usedLeaves = 0;
        leaveRequests.forEach(lr => {
            const start = new Date(lr.startDate);
            const end = new Date(lr.endDate);
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            usedLeaves += diff;
        });

        res.json({
            totalLeaves,
            usedLeaves,
            remainingLeaves: totalLeaves - usedLeaves
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getLeaveBreakdown = async (req, res) => {
    try {
        const userEmail = req.query.email;

        const leaves = await Leave.find();
        const leaveRequests = await LeaveRequest.find({
            email: userEmail,
            status: 'approved'
        });

        const breakdown = leaves.map(leave => {
            let used = 0;
            leaveRequests.forEach(lr => {
                if (lr.type.toLowerCase() === leave.type.toLowerCase()) {
                    const start = new Date(lr.startDate);
                    const end = new Date(lr.endDate);
                    used += Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                }
            });

            return {
                type: leave.type,
                total: leave.count,
                left: leave.count - used
            };
        });

        res.json(breakdown);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getLeaveHistory = async (req, res) => {
    try {
        const userEmail = req.query.email;

        const leaveRequests = await LeaveRequest.find({ email: userEmail }).sort({ startDate: -1 });

        const history = leaveRequests.map(lr => {
            const totalDays = Math.ceil((new Date(lr.endDate) - new Date(lr.startDate)) / (1000 * 60 * 60 * 24)) + 1;
            return {
                type: lr.type,
                startDate: lr.startDate,
                endDate: lr.endDate,
                totalDays,
                status: lr.status
            };
        });

        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const deleteLeaveRequest = async (req, res) => {
    try {
        const { email, type, startDate, endDate } = req.body;

        const leave = await LeaveRequest.findOne({
            email,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        await LeaveRequest.deleteOne({ _id: leave._id });

        res.json({ message: 'Leave request deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const checkLeaveStatus = async (req, res) => {
    try {
        const userEmail = req.query.email;

        const leave = await LeaveRequest.findOne({ email: userEmail, status: 'pending' });

        if (leave) {
            return res.json({ applied: true });
        } else {
            return res.json({ applied: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const updateLeaveStatus = async (req, res) => {
    try {
        const { email, type, startDate, endDate, status } = req.body;

        if (!['approved', 'rejected'].includes(status.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected".' });
        }

        const leave = await LeaveRequest.findOne({
            email,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = status.toLowerCase();
        await leave.save();

        res.json({ message: `Leave request ${status.toLowerCase()} successfully`, leave });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getAllLeaveRequests = async (req, res) => {
    try {
        
        const leaveRequests = await LeaveRequest.find().sort({ startDate: -1 });

        const enrichedRequests = await Promise.all(
            leaveRequests.map(async (leave) => {
                const user = await User.findOne({ email: leave.email });
                return {
                    _id: leave._id,
                    name: leave.name,
                    email: leave.email,
                    phone: leave.phone,
                    type: leave.type,
                    startDate: leave.startDate,
                    endDate: leave.endDate,
                    status: leave.status,
                    department: user?.department || '-',   
                    designation: user?.designation || '-'
                };
            })
        );

        res.json(enrichedRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


export {
    newLeaveRequest,
    getLeaveSummary,
    getLeaveBreakdown,
    getLeaveHistory,
    deleteLeaveRequest,
    checkLeaveStatus,
    updateLeaveStatus,
    getAllLeaveRequests
}
