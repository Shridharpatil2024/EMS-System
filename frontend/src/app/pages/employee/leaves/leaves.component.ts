import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../../services/leaves.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Leave {
  type: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  total?: number;
  left?: number;
  typeCapitalized?: string;
  statusCapitalized?: string;
}

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LeavesComponent implements OnInit {
  email!: string;

  totalLeaves = 0;
  usedLeaves = 0;
  remainingLeaves = 0;

  leaveBreakdown: Leave[] = [];
  leaveHistory: Leave[] = [];

  selectedType = '';
  selectedStatus = '';

  message: string = '';
  messageType: 'success' | 'error' = 'success';

  dataLoaded = false;
  private apiCallsCompleted = 0;
  private totalApiCalls = 3;

  // Mapping from dropdown values to actual leave.type
  typeMap: { [key: string]: string } = {
    casual: 'Casual Leave',
    sick: 'Sick Leave',
    earned: 'Earned Leave',
    maternity: 'Maternity/Paternity Leave'
  };

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.email = user.email;
        this.fetchSummary();
        this.fetchBreakdown();
        this.fetchHistory();
      }
    });
  }

  private checkDataLoaded() {
    this.apiCallsCompleted++;
    if (this.apiCallsCompleted >= this.totalApiCalls) {
      this.dataLoaded = true;
    }
  }

  fetchSummary() {
    this.leaveService.getLeaveSummary(this.email).subscribe({
      next: (res) => {
        this.totalLeaves = res.totalLeaves;
        this.usedLeaves = res.usedLeaves;
        this.remainingLeaves = res.remainingLeaves;
        this.checkDataLoaded();
      },
      error: (err) => {
        console.error(err);
        this.checkDataLoaded();
      }
    });
  }

  fetchBreakdown() {
    this.leaveService.getLeaveBreakdown(this.email).subscribe({
      next: (res: Leave[]) => {
        this.leaveBreakdown = res.map((leave: Leave) => ({
          ...leave,
          typeCapitalized: leave.type.charAt(0).toUpperCase() + leave.type.slice(1)
        }));
        this.checkDataLoaded();
      },
      error: (err) => {
        console.error(err);
        this.checkDataLoaded();
      }
    });
  }

  fetchHistory() {
    this.leaveService.getLeaveHistory(this.email).subscribe({
      next: (res: Leave[]) => {
        this.leaveHistory = res.map((leave: Leave) => ({
          ...leave,
          typeCapitalized: leave.type.charAt(0).toUpperCase() + leave.type.slice(1),
          statusCapitalized: leave.status!.charAt(0).toUpperCase() + leave.status!.slice(1)
        }));
        this.checkDataLoaded();
      },
      error: (err) => {
        console.error(err);
        this.checkDataLoaded();
      }
    });
  }

  cancelLeave(l: Leave) {
    this.leaveService.deleteLeaveRequest(
      this.email,
      l.type,
      l.startDate!,
      l.endDate!
    ).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Leave canceled successfully!';
        this.fetchSummary();
        this.fetchBreakdown();
        this.fetchHistory();
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.messageType = 'error';
        this.message = 'Failed to cancel leave. Try again!';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  hasBreakdownData(): boolean {
    return this.leaveBreakdown && this.leaveBreakdown.length > 0;
  }

  hasHistoryData(): boolean {
    return this.filteredLeaveHistory.length > 0;
  }

  get filteredLeaveHistory() {
    return this.leaveHistory.filter(leave => {
      // Map the selectedType to actual leave.type
      const typeMatch = this.selectedType
        ? leave.type === this.typeMap[this.selectedType]
        : true;

      const statusMatch = this.selectedStatus
        ? leave.status!.toLowerCase() === this.selectedStatus.toLowerCase()
        : true;

      return typeMatch && statusMatch;
    });
  }
}
