import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimezoneService } from '../../../../services/timezone.service';
import {
  FeedbackSession,
  FeedbackSessionPublishStatus,
  FeedbackSessionSubmissionStatus,
  ResponseVisibleSetting,
  SessionVisibleSetting,
} from '../../../../types/api-output';
import { StudentExtensionTableColumnModel } from '../extension-table-column-model';
import { InstructorSessionIndividualExtensionPageModule } from '../instructor-session-individual-extension-page.module';
import { IndividualExtensionConfirmModalComponent } from './individual-extension-confirm-modal.component';

describe('IndividualExtensionConfirmModalComponent', () => {
  const testFeedbackSession: FeedbackSession = {
    courseId: 'testId1',
    timeZone: 'Asia/Singapore',
    feedbackSessionName: 'Test Session',
    instructions: 'Instructions',
    submissionStartTimestamp: 1000000000000,
    submissionEndTimestamp: 1500000000000,
    gracePeriod: 0,
    sessionVisibleSetting: SessionVisibleSetting.AT_OPEN,
    responseVisibleSetting: ResponseVisibleSetting.AT_VISIBLE,
    submissionStatus: FeedbackSessionSubmissionStatus.OPEN,
    publishStatus: FeedbackSessionPublishStatus.PUBLISHED,
    isClosingEmailEnabled: true,
    isPublishedEmailEnabled: true,
    createdAtTimestamp: 0,
    studentDeadlines: {},
    instructorDeadlines: {},
  };

  const studentModel1: StudentExtensionTableColumnModel = {
    sectionName: 'Test Section 1',
    teamName: 'Test Section 1',
    name: 'Test Student 1',
    email: 'testStudent1@gmail.com',
    extensionDeadline: 1500000000000,
    hasExtension: false,
    isSelected: true,
  };
  const studentModel2: StudentExtensionTableColumnModel = {
    sectionName: 'Test Section 2',
    teamName: 'Test Section 2',
    name: 'Test Student 2',
    email: 'testStudent2@gmail.com',
    extensionDeadline: 1510000000000,
    hasExtension: true,
    isSelected: true,
  };
  const studentModel3: StudentExtensionTableColumnModel = {
    sectionName: 'Test Section 3',
    teamName: 'Test Section 3',
    name: 'Test Student 3',
    email: 'testStudent3@gmail.com',
    extensionDeadline: 1510000000000,
    hasExtension: true,
    isSelected: true,
  };

  const testTimeString = '5 Apr 2000 2:00:00';

  let component: IndividualExtensionConfirmModalComponent;
  let fixture: ComponentFixture<IndividualExtensionConfirmModalComponent>;
  let timeZoneService: TimezoneService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, InstructorSessionIndividualExtensionPageModule],
        providers: [NgbActiveModal],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualExtensionConfirmModalComponent);
    timeZoneService = TestBed.inject(TimezoneService);
    jest.spyOn(timeZoneService, 'formatToString').mockReturnValue(testTimeString);
    component = fixture.componentInstance;
    component.feedbackSessionTimeZone = 'Asia/Singapore';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should snap with the extended students and instructors', () => {
    component.selectedStudents = [studentModel1, studentModel2, studentModel3];
    component.extensionTimestamp = testFeedbackSession.submissionEndTimestamp;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
