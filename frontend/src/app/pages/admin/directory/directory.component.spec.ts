import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDirectoryComponent } from './directory.component';

describe('DirectoryComponent', () => {
  let component: AdminDirectoryComponent;
  let fixture: ComponentFixture<AdminDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDirectoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
