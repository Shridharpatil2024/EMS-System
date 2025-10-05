import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'http://localhost:3000/api/attendance';

  constructor(private http: HttpClient) { }

  markAttendance(name: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark`, { name, email });
  }

  checkAttendance(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/check`, { email });
  }

  getAttendanceSummary(): Observable<{ present: number, onLeave: number, notMarked: number }> {
    return this.http.get<{ present: number, onLeave: number, notMarked: number }>(
      `${this.apiUrl}/summary-of-attendance`
    );
  }
}
