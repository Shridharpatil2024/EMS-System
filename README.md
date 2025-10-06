# EMS-System

## Project Overview

The **Employee Management System (EMS)** is a full-stack web application designed to streamline and automate HR processes. It allows organizations to efficiently manage employee information, track daily attendance, handle leave requests, and maintain role-based access for admins and employees. This system is scalable, secure, and built with modern web technologies to provide a seamless user experience.

## Tech Stack

- **Frontend:** Angular
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  

## Key Features

- **Employee Management:** Add, edit, and delete employee records.  
- **Attendance Tracking:** Record daily attendance and monitor employee presence.  
- **Leave Management:** Submit, approve, and track leave requests.  
- **Role-Based Access:** Admin and Employee dashboards with different permissions.  
- **Responsive Design:** Works well across devices and screen sizes.  

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shridharpatil2024/EMS-System.git

2. Backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
   - Create a .env file inside backend folder and add these variables 
   ```bash
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install
   ng serve


## Folder Structure
```
Main-folder/
│
├── backend/          # Node.js / Express server
├── frontend/         # Angular frontend
├── README.md
└── .gitignore
```

## Test Cases
| **Test Case ID** | **Scenario**                 | **Steps to Reproduce**                                                                                                        | **Expected Result**                                                                                |
| ---------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| TC001            | **New User Registration**    | 1. Open the app.<br>2. Register with valid details.                                                                           | User account is created successfully and redirected to the Admin Dashboard.                        |
| TC002            | **Admin Dashboard**          | 1. Log in as admin.                                                                                                           | The sidebar displays all admin-related routes: Admin Home, Departments, Directory, Leave Requests. |
| TC003            | **Add Employee**             | 1. Go to “Directory”.<br>2. View the list of all employees (including admin).<br>3. Click "Add Employee" and submit the form. | New employee record appears in the list.                                                           |
| TC004            | **Edit Employee**            | 1. In the employee list, click Edit on any employee.<br>2. Update fields (except password) and save.                          | Updated details are reflected instantly.                                                           |
| TC005            | **Delete Employee**          | 1. In the employee list, click Delete on any employee.                                                                        | Employee is removed from the list.                                                                 |
| TC006            | **Mark Attendance**          | 1. Log in as Admin or Employee.<br>2. Click “Mark Now”.                                                                       | Attendance is marked; the button is disabled after marking for the day.                            |
| TC007            | **Leave Request Submission** | 1. Log in as Employee.<br>2. On the "Request Time Off" card, click "Apply Now".<br>3. Submit valid leave details.             | Leave request is submitted successfully and visible in the admin panel.                            |
| TC008            | **Leave Approval (Admin)**   | 1. Log in as Admin.<br>2. Open the Leave Requests page.<br>3. Approve or Reject a request.                                    | Status is updated correctly and visible in the employee's Leave History panel.                     |
| TC009            | **Role-Based Access**        | 1. Log in as Admin → should access employee management.<br>2. Log in as Employee → should not access admin routes.            | Access is restricted based on user role.                                                           |
| TC010            | **Profile Image Handling**   | 1. Try adding an employee without an image.<br>2. Then add an image and submit.                                               | Default image is shown if none provided; Cloudinary image is displayed when uploaded.              |
| TC012            | **Logout Functionality**     | 1. Click Logout from the dashboard.                                                                                           | Session is cleared and redirected to the Login screen.                                             |


## Future Enhancements

- Email notifications for leave approvals.
- Dashboard analytics with charts and reports.
- Integration with third-party authentication (OAuth, Google, etc.).