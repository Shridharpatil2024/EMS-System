import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-users-by-email?email=${email}`);
  }

  addUser(userData: { name: string; email: string; password: string; phone: string; designation: string; department: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-user`, userData);
  }

  updateUserWithImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-user`, formData);
  }

  deleteUser(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-user`, { email });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-all-users`);
  }
}
