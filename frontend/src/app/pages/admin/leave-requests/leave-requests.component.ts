import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../../services/leaves.service';
import { CommonModule } from '@angular/common';

interface LeaveRequest {
  name: string;
  designation?: string;
  department?: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  email: string;
}

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LeaveRequestsComponent implements OnInit {

  leaveRequests: LeaveRequest[] = [];

  leaveTypeColor: Record<string, string> = {
    'Sick': 'text-red-600 font-semibold',
    'Maternity/Paternity': 'text-purple-600 font-semibold',
    'Casual': 'text-green-600 font-semibold',
    'Earned': 'text-indigo-600 font-semibold'
  };

  constructor(private leaveService: LeaveService) { }

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    this.leaveService.getAllLeaveRequests().subscribe({
      next: (res: LeaveRequest[]) => this.leaveRequests = res,
      error: (err) => console.error('Error fetching leave requests:', err)
    });
  }

  updateLeaveStatus(leave: LeaveRequest, newStatus: 'approved' | 'rejected') {
    this.leaveService.updateLeaveStatus({
      email: leave.email,
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: newStatus
    }).subscribe({
      next: () => leave.status = newStatus, 
      error: (err) => console.error('Error updating leave status:', err)
    });
  }

  acceptLeave(leave: LeaveRequest) {
    this.updateLeaveStatus(leave, 'approved');
  }

  rejectLeave(leave: LeaveRequest) {
    this.updateLeaveStatus(leave, 'rejected');
  }
}
