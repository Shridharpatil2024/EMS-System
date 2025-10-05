import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Department {
  name: string;
  employeeCount: number;
}

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  imports: [CommonModule, FormsModule]
})
export class AdminDepartmentsComponent implements OnInit {
  departments: Department[] = [];
  showForm = false;
  newDeptName = '';
  newDeptEmployees!: number;
  editingDept: Department | null = null;
  loading = false;

  constructor(private deptService: DepartmentService) {}

  ngOnInit(): void {
    this.fetchDepartments();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.editingDept = null;
    this.newDeptName = '';
    this.newDeptEmployees = 0;
  }

  fetchDepartments() {
    this.loading = true;
    this.deptService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching departments', err);
        this.loading = false;
      }
    });
  }

  addDepartment() {
    if (!this.newDeptName || this.newDeptEmployees == null) return;

    if (this.editingDept) {
      this.deptService.updateDepartment(this.editingDept.name, {
        name: this.newDeptName,
        employeeCount: this.newDeptEmployees
      }).subscribe({
        next: () => {
          this.fetchDepartments();
          this.toggleForm();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.deptService.createDepartment({
        name: this.newDeptName,
        employeeCount: this.newDeptEmployees
      }).subscribe({
        next: () => {
          this.fetchDepartments();
          this.toggleForm();
        },
        error: (err) => console.error(err)
      });
    }
  }

  editDepartment(dept: Department) {
    this.editingDept = dept;
    this.newDeptName = dept.name;
    this.newDeptEmployees = dept.employeeCount;
    this.showForm = true;
  }

  deleteDepartment(dept: Department) {
    if (!confirm(`Are you sure you want to delete ${dept.name}?`)) return;

    this.deptService.deleteDepartment(dept.name).subscribe({
      next: () => this.fetchDepartments(),
      error: (err) => console.error(err)
    });
  }
}
