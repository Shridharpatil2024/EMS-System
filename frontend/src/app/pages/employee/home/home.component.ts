import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AttendanceService } from '../../../services/attendance.service';
import { LeaveService } from '../../../services/leaves.service';

interface User {
  name: string;
  email: string;
  designation: string;
  phone: string;
  department: string;
  profileImage?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  employee: User = {} as User;


  attendanceMarked = false;
  attendanceLoaded = false;
  leaveApplied = false;
  showLeaveModal = false;
  showEditModal = false;
  dataLoaded = false;


  leaveName = '';
  leaveEmail = '';
  leavePhone = '';
  leaveType = '';
  startDate = '';
  endDate = '';

  editName = '';
  editPhone = '';
  editDesignation = '';
  editDepartment = '';
  selectedFile: File | null = null;   
  previewImage: string | ArrayBuffer | null = null;


  defaultProfileImage = 'https://res.cloudinary.com/devki13o6/image/upload/v1759669980/profile-icon-9_s9tngg.png';

  constructor(
    private userService: UserService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService
  ) { }

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (res: User) => {
          this.employee = res;

        
          this.leaveName = res.name;
          this.leaveEmail = res.email;
          this.editName = res.name;
          this.editDesignation = res.designation;
          this.editPhone = res.phone;
          this.editDepartment = res.department;

          this.dataLoaded = true;

          
          this.checkAttendance(res.email);
          this.checkLeaveStatus(res.email);
        },
        error: (err) => {
          console.error('Error fetching user details', err);
          this.dataLoaded = true;
        }
      });
    } else {
      this.dataLoaded = true;
    }
  }

  checkAttendance(email: string): void {
    this.attendanceService.checkAttendance(email).subscribe({
      next: (res: any) => {
        this.attendanceMarked = res.marked;
        this.attendanceLoaded = true;
      },
      error: (err) => {
        console.error('Error checking attendance', err);
        this.attendanceLoaded = true;
      }
    });
  }

  markAttendance(): void {
    if (!this.employee.name || !this.employee.email || this.attendanceMarked) return;

    this.attendanceService.markAttendance(this.employee.name, this.employee.email).subscribe({
      next: () => {
        this.attendanceMarked = true;
        sessionStorage.setItem('attendanceMarked', 'true');
      },
      error: (err) => console.error('Error marking attendance!', err)
    });
  }

  checkLeaveStatus(email: string): void {
    this.leaveService.checkLeaveStatus(email).subscribe({
      next: (res: any) => {
        this.leaveApplied = res.applied;
        sessionStorage.setItem('leaveApplied', String(this.leaveApplied));
      },
      error: (err) => console.error('Error checking leave status', err)
    });
  }

  openLeaveModal(): void {
    this.resetLeaveForm();
    this.showLeaveModal = true;
    this.showEditModal = false;
  }

  openEditModal(): void {
    this.editName = this.employee.name;
    this.editDesignation = this.employee.designation;
    this.editPhone = this.employee.phone;
    this.editDepartment = this.employee.department;
    this.previewImage = this.employee.profileImage || null;
    this.showEditModal = true;
    this.showLeaveModal = false;
  }

  closeModals(): void {
    this.showLeaveModal = false;
    this.showEditModal = false;
    this.selectedFile = null;
    this.previewImage = null;
  }

  resetLeaveForm(): void {
    this.leaveName = this.employee.name || '';
    this.leaveEmail = this.employee.email || '';
    this.leavePhone = '';
    this.leaveType = '';
    this.startDate = '';
    this.endDate = '';
  }

  submitLeave(): void {
    const leaveData = {
      name: this.leaveName,
      email: this.leaveEmail,
      phone: this.leavePhone,
      type: this.leaveType,
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.leaveService.submitLeave(leaveData).subscribe({
      next: (res) => {
        console.log('Leave submitted', res);
        this.leaveApplied = true;
        sessionStorage.setItem('leaveApplied', 'true');
        this.closeModals();
      },
      error: (err) => console.error('Error submitting leave', err)
    });
  }

  deleteLeave(type: string, startDate: string, endDate: string): void {
    this.leaveService.deleteLeaveRequest(this.leaveEmail, type, startDate, endDate)
      .subscribe({
        next: () => {
          console.log('Leave deleted');
          this.checkLeaveStatus(this.leaveEmail);
        },
        error: (err) => console.error('Error deleting leave', err)
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.previewImage = this.employee.profileImage || null;
    }
  }

  submitEdit(): void {
    const formData = new FormData();
    formData.append('name', this.editName);
    formData.append('phone', this.editPhone);
    formData.append('designation', this.editDesignation);
    formData.append('department', this.editDepartment);
    formData.append('email', this.employee.email);

    if (this.selectedFile) formData.append('profileImage', this.selectedFile);

    this.userService.updateUserWithImage(formData).subscribe({
      next: (res: any) => {
        console.log('User updated', res);
        this.employee.name = this.editName;
        this.employee.designation = this.editDesignation;
        this.employee.phone = this.editPhone;
        this.employee.department = this.editDepartment;
        if (res.user?.profileImage) this.employee.profileImage = res.user.profileImage;

        this.closeModals();
      },
      error: (err: any) => console.error('Error updating user', err)
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(): void {
    this.closeModals();
  }
}
