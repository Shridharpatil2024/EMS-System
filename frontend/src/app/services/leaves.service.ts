import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private apiUrl = 'http://localhost:3000/api/leaves';

  constructor(private http: HttpClient) { }

  submitLeave(leaveData: {
    name: string;
    email: string;
    phone: string;
    type: string;
    startDate: string;
    endDate: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave-request`, leaveData);
  }

  getLeaveSummary(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary?email=${email}`);
  }

  getLeaveBreakdown(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/breakdown?email=${email}`);
  }

  getLeaveHistory(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/history?email=${email}`);
  }

  deleteLeaveRequest(email: string, type: string, startDate: string, endDate: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, { email, type, startDate, endDate });
  }

  checkLeaveStatus(email: string): Observable<{ applied: boolean }> {
    return this.http.get<{ applied: boolean }>(`${this.apiUrl}/status?email=${email}`);
  }

  updateLeaveStatus(data: {
    email: string;
    type: string;
    startDate: string;
    endDate: string;
    status: 'approved' | 'rejected';
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-status`, data);
  }

  getAllLeaveRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-leaves`);
  }
}
