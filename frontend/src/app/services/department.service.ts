import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private baseUrl = 'http://localhost:3000/api/department'; // adjust if needed

  constructor(private http: HttpClient) {}

  createDepartment(deptData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-department`, deptData);
  }

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get-all-department`);
  }

  updateDepartment(oldName: string, deptData: { name: string; employeeCount: number }): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-department`, { ...deptData, oldName });
  }

  deleteDepartment(name: string): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete-department`, { body: { name } });
  }
}
