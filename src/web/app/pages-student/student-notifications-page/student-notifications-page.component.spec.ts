import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserNotificationsListModule } from '../../components/user-notifications-list/user-notifications-list.module';
import { StudentNotificationsPageComponent } from './student-notifications-page.component';

describe('StudentNotificationsPageComponent', () => {
  let component: StudentNotificationsPageComponent;
  let fixture: ComponentFixture<StudentNotificationsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StudentNotificationsPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        UserNotificationsListModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentNotificationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
