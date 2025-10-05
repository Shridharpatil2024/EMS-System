import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((res: any) => {

          localStorage.setItem('token', res.token);
          this.currentUserSubject.next(res.user);
        })
      );
  }

  register(payload: { name: string; email: string; password: string; designation: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload)
      .pipe(
        tap((res: any) => {
          if (res.token && res.user) {
            localStorage.setItem('token', res.token);
            this.currentUserSubject.next(res.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
