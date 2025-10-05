import { Routes } from '@angular/router';
import { HomeComponent } from './pages/employee/home/home.component';
import { DepartmentsComponent } from './pages/employee/departments/departments.component';
import { LeavesComponent } from './pages/employee/leaves/leaves.component';
import { AdminDepartmentsComponent } from './pages/admin/departments/departments.component'
import { AdminDirectoryComponent } from './pages/admin/directory/directory.component';
import { LeaveRequestsComponent } from './pages/admin/leave-requests/leave-requests.component';
import { AdminHomeComponent } from './pages/admin/home/home.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { 
        path: "", 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },

    { 
        path: 'login', 
        component: LoginComponent
    },
    {
        path: "home", 
        component: HomeComponent
    },
    {
        path: "departments",
        component: DepartmentsComponent
    },
    {
        path: "leaves",
        component: LeavesComponent
    },
    {
        path: "admin/home",
        component: AdminHomeComponent
    },
    {
        path: 'admin/departments',
        component: AdminDepartmentsComponent
    },
    {
        path: 'admin/directory',
        component: AdminDirectoryComponent
    },
    {
        path: 'admin/leave-requests',
        component: LeaveRequestsComponent
    },
    { 
        path: '**', 
        redirectTo: 'login' 
    }
];