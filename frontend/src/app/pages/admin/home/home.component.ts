import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../services/attendance.service';
import { UserService } from '../../../services/user.service';

interface Admin {
  name: string;
  email: string;
  designation: string;
  phone: string;
  department: string;
  profileImage?: string;
}

interface EditForm {
  name: string;
  designation: string;
  phone: string;
  department: string;
  email: string;
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class AdminHomeComponent implements OnInit {
  pageLoaded = false;
  admin: Admin = {} as Admin;
  attendanceMarked = false;
  presence = { present: 0, onLeave: 0, notMarked: 0 };
  showEditModal = false;
  editForm: EditForm = { name: '', designation: '', phone: '', department: '', email: '' };

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  defaultProfileImage = 'https://res.cloudinary.com/devki13o6/image/upload/v1759669980/profile-icon-9_s9tngg.png';

  constructor(
    private attendanceService: AttendanceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAdminData();
    this.loadAttendanceSummary();
  }

  loadAdminData() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return console.error('No user email found in localStorage');

    this.userService.getUserByEmail(userEmail).subscribe({
      next: (res: Admin) => {
        this.admin = res;
        this.editForm = { ...res };

        this.previewUrl = res.profileImage || null;

        this.attendanceService.checkAttendance(res.email).subscribe({
          next: (res: any) => {
            this.attendanceMarked = res.marked;
            this.pageLoaded = true;
          },
          error: () => this.pageLoaded = true
        });
      },
      error: () => this.pageLoaded = true
    });
  }

  loadAttendanceSummary() {
    this.attendanceService.getAttendanceSummary().subscribe({
      next: (res) => this.presence = res,
      error: (err) => console.error(err)
    });
  }

  markAttendance() {
    this.attendanceService.markAttendance(this.admin.name, this.admin.email).subscribe({
      next: () => {
        this.attendanceMarked = true;
        this.loadAttendanceSummary();
      },
      error: (err) => console.error(err)
    });
  }

  openEditModal() {
    this.editForm = { ...this.admin };
    this.previewUrl = this.admin.profileImage || null;
    this.selectedFile = null;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.previewUrl = this.admin.profileImage || null;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveProfile() {
    const formData = new FormData();
    formData.append('name', this.editForm.name);
    formData.append('designation', this.editForm.designation);
    formData.append('phone', this.editForm.phone);
    formData.append('department', this.editForm.department);
    formData.append('email', this.editForm.email);

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.userService.updateUserWithImage(formData).subscribe({
      next: (res: any) => {
        this.admin = res.user;

        this.previewUrl = this.admin.profileImage || null;

        this.closeEditModal();
      },
      error: (err) => console.error(err)
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress() {
    this.closeEditModal();
  }
}
