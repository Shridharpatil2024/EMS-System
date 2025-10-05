import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Employee {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  designation: string;
}

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminDirectoryComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  showForm = false;
  isEditing = false;
  formData: Employee = { name: '', email: '', password: '', phone: '', department: '', designation: '' };
  searchTerm = '';
  selectedDepartment = 'All Departments';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.employees = res;
        this.filteredEmployees = [...this.employees];
      },
      error: (err) => console.error(err)
    });
  }

  saveEmployee() {
    if (this.isEditing) {
      const fd = new FormData();
      fd.append('name', this.formData.name);
      fd.append('email', this.formData.email);
      fd.append('phone', this.formData.phone);
      fd.append('designation', this.formData.designation);
      fd.append('department', this.formData.department);

      this.userService.updateUserWithImage(fd).subscribe({
        next: (res: any) => {
          this.fetchEmployees();
          this.resetForm();
        },
        error: (err: any) => console.error(err)
      });
    } else {
      this.userService.addUser(this.formData).subscribe({
        next: (res: any) => {
          this.fetchEmployees();
          this.resetForm();
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  editEmployee(emp: Employee) {
    this.formData = { ...emp };
    this.isEditing = true;
    this.showForm = true;
  }


  deleteEmployee(email: string) {
    this.userService.deleteUser(email).subscribe({
      next: () => this.fetchEmployees(),
      error: (err) => console.error(err)
    });
  }

  applyFilters() {
    this.filteredEmployees = this.employees.filter(emp => {
      const matchesSearch = Object.values(emp)
        .join(' ')
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesDept =
        this.selectedDepartment === 'All Departments' ||
        emp.department === this.selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }

  resetForm() {
    this.showForm = false;
    this.isEditing = false;
    this.formData = { name: '', email: '', password: '', phone: '', department: '', designation: '' };
  }
}
