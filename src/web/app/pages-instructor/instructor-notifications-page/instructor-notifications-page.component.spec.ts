import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserNotificationsListModule } from '../../components/user-notifications-list/user-notifications-list.module';
import { InstructorNotificationsPageComponent } from './instructor-notifications-page.component';

describe('InstructorNotificationsPageComponent', () => {
  let component: InstructorNotificationsPageComponent;
  let fixture: ComponentFixture<InstructorNotificationsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorNotificationsPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        UserNotificationsListModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorNotificationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
