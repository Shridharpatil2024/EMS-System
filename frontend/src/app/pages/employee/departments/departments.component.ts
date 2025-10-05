import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './departments.component.html'
})
export class DepartmentsComponent implements OnInit {
  departments: any[] = [];

  dataLoaded = false;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        this.dataLoaded = true; 
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.dataLoaded = true; 
      }
    });
  }
}
