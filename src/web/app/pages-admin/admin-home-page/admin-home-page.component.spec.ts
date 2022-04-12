import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { CourseService } from '../../../services/course.service';
import { LinkService } from '../../../services/link.service';
import { SimpleModalService } from '../../../services/simple-modal.service';
import { StatusMessageService } from '../../../services/status-message.service';
import { createMockNgbModalRef } from '../../../test-helpers/mock-ngb-modal-ref';
import { AjaxLoadingModule } from '../../components/ajax-loading/ajax-loading.module';
import { LoadingSpinnerModule } from '../../components/loading-spinner/loading-spinner.module';
import { AdminHomePageComponent } from './admin-home-page.component';
import { InstructorData } from './instructor-data';
import { NewInstructorDataRowComponent } from './new-instructor-data-row/new-instructor-data-row.component';

describe('AdminHomePageComponent', () => {
  let component: AdminHomePageComponent;
  let fixture: ComponentFixture<AdminHomePageComponent>;
  let accountService: AccountService;
  let courseService: CourseService;
  let linkService: LinkService;
  let simpleModalService: SimpleModalService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminHomePageComponent,
        NewInstructorDataRowComponent,
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        LoadingSpinnerModule,
        AjaxLoadingModule,
      ],
      providers: [
        AccountService,
        CourseService,
        SimpleModalService,
        StatusMessageService,
        LinkService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHomePageComponent);
    accountService = TestBed.inject(AccountService);
    courseService = TestBed.inject(CourseService);
    simpleModalService = TestBed.inject(SimpleModalService);
    linkService = TestBed.inject(LinkService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add one instructor to list if all fields are filled', () => {
    component.instructorName = 'Instructor Name';
    component.instructorEmail = 'instructor@example.com';
    component.instructorInstitution = 'Instructor Institution';
    fixture.detectChanges();

    const button: any = fixture.debugElement.nativeElement.querySelector('#add-instructor');
    button.click();

    expect(component.instructorName).toEqual('');
    expect(component.instructorEmail).toEqual('');
    expect(component.instructorInstitution).toEqual('');
    expect(component.instructorsConsolidated.length).toEqual(1);
    expect(component.instructorsConsolidated[0]).toEqual({
      email: 'instructor@example.com',
      institution: 'Instructor Institution',
      name: 'Instructor Name',
      status: 'PENDING',
      isCurrentlyBeingEdited: false,
    });
  });

  it('should not add one instructor to list if some fields are empty', () => {
    component.instructorName = 'Instructor Name';
    component.instructorEmail = '';
    component.instructorInstitution = 'Instructor Institution';
    fixture.detectChanges();

    const button: any = fixture.debugElement.nativeElement.querySelector('#add-instructor');
    button.click();

    expect(component.instructorName).toEqual('Instructor Name');
    expect(component.instructorEmail).toEqual('');
    expect(component.instructorInstitution).toEqual('Instructor Institution');
    expect(component.instructorsConsolidated.length).toEqual(0);

    component.instructorName = '';
    component.instructorEmail = 'instructor@example.com';

    button.click();

    expect(component.instructorName).toEqual('');
    expect(component.instructorEmail).toEqual('instructor@example.com');
    expect(component.instructorInstitution).toEqual('Instructor Institution');
    expect(component.instructorsConsolidated.length).toEqual(0);

    component.instructorName = 'Instructor Name';
    component.instructorInstitution = '';

    button.click();

    expect(component.instructorName).toEqual('Instructor Name');
    expect(component.instructorEmail).toEqual('instructor@example.com');
    expect(component.instructorInstitution).toEqual('');
    expect(component.instructorsConsolidated.length).toEqual(0);
  });

  it('should only add valid instructor details in the single line field', () => {
    component.instructorDetails = [
        'Instructor A | instructora@example.com | Institution A',
        'Instructor B | instructorb@example.com',
        'Instructor C | | instructorc@example.com',
        'Instructor D | instructord@example.com | Institution D',
        '| instructore@example.com | Institution E',
    ].join('\n');
    fixture.detectChanges();

    const button: any = fixture.debugElement.nativeElement.querySelector('#add-instructor-single-line');
    button.click();

    expect(component.instructorDetails).toEqual([
      'Instructor B | instructorb@example.com',
      'Instructor C | | instructorc@example.com',
      '| instructore@example.com | Institution E',
    ].join('\r\n'));
    expect(component.instructorsConsolidated.length).toEqual(2);
    expect(component.instructorsConsolidated[0]).toEqual({
      email: 'instructora@example.com',
      institution: 'Institution A',
      name: 'Instructor A',
      status: 'PENDING',
      isCurrentlyBeingEdited: false,
    });
    expect(component.instructorsConsolidated[1]).toEqual({
      email: 'instructord@example.com',
      institution: 'Institution D',
      name: 'Instructor D',
      status: 'PENDING',
      isCurrentlyBeingEdited: false,
    });
  });

  it('should remove instructor out of queue if REMOVE is requested', () => {
    const instructorData: InstructorData = {
      name: 'Instructor A',
      email: 'instructora@example.com',
      institution: 'Sample Institution A',
      status: 'PENDING',
      isCurrentlyBeingEdited: false,
      joinLink: 'This should not be displayed',
      message: 'This should not be displayed',
    };
    component.instructorsConsolidated = [instructorData];
    fixture.detectChanges();

    const index: number = 0;
    component.removeInstructor(index);

    expect(component.instructorsConsolidated.includes(instructorData)).toBeFalsy();
    expect(component.instructorsConsolidated.length).toEqual(0);
  });

  it('should add instructor and update field when successful', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
    ];
    jest.spyOn(accountService, 'createAccountRequest').mockReturnValue(of({
      joinLink: 'http://localhost:4200/web/join',
    }));
    fixture.detectChanges();

    const index: number = 0;
    component.addInstructor(index);

    expect(component.instructorsConsolidated[index].status).toEqual('SUCCESS');
    expect(component.instructorsConsolidated[index].joinLink).toEqual('http://localhost:4200/web/join');
    expect(component.activeRequests).toEqual(0);
  });

  it('should not add instructor and update field during failure', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
    ];
    jest.spyOn(accountService, 'createAccountRequest').mockReturnValue(throwError({
      error: {
        message: 'This is the error message',
      },
    }));
    fixture.detectChanges();

    const index: number = 0;
    component.addInstructor(index);

    expect(component.instructorsConsolidated[index].status).toEqual('FAIL');
    expect(component.instructorsConsolidated[index].message).toEqual('This is the error message');
    expect(component.activeRequests).toEqual(0);
  });

  it('should enter edit mode for only the specified instructor', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor B',
        email: 'instructorb@example.com',
        institution: 'Sample Institution B',
        status: 'SUCCESS',
        statusCode: 200,
        isCurrentlyBeingEdited: false,
        joinLink: 'http://localhost:4200/web/join',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor C',
        email: 'instructorc@example.com',
        institution: 'Sample Institution C',
        status: 'FAIL',
        statusCode: 400,
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'The instructor cannot be added for some reason',
      },
    ];

    const index: number = 2;
    component.setInstructorRowEditModeEnabled(index, true);

    for (let i: number = 0; i < component.instructorsConsolidated.length; i += 1) {
      expect(component.instructorsConsolidated[i].isCurrentlyBeingEdited).toEqual(i === index);
    }
  });

  it('should exit edit mode for only the specified instructor', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor B',
        email: 'instructorb@example.com',
        institution: 'Sample Institution B',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor C',
        email: 'instructorc@example.com',
        institution: 'Sample Institution C',
        status: 'FAIL',
        statusCode: 400,
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'The instructor cannot be added for some reason',
      },
    ];
    for (let i: number = 0; i < component.instructorsConsolidated.length; i += 1) {
      component.setInstructorRowEditModeEnabled(i, true);
    }
    fixture.detectChanges();

    const index: number = 1;
    component.setInstructorRowEditModeEnabled(index, false);

    for (let i: number = 0; i < component.instructorsConsolidated.length; i += 1) {
      expect(component.instructorsConsolidated[i].isCurrentlyBeingEdited).toEqual(i !== index);
    }
  });

  it('should add all instructors when prompted', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor B',
        email: 'instructorb@example.com',
        institution: 'Sample Institution B',
        status: 'SUCCESS',
        statusCode: 200,
        isCurrentlyBeingEdited: false,
        joinLink: 'http://localhost:4200/web/join',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor C',
        email: 'instructorc@example.com',
        institution: 'Sample Institution C',
        status: 'FAIL',
        statusCode: 400,
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'The instructor cannot be added for some reason',
      },
    ];
    // No need to spy here as this test only tests the number of active requests added
    // Testing of adding individual instructors have been done before
    fixture.detectChanges();

    const button: any = fixture.debugElement.nativeElement.querySelector('#add-all-instructors');
    button.click();

    expect(component.instructorsConsolidated[0].status).toEqual('ADDING');
    expect(component.instructorsConsolidated[1].status).toEqual('SUCCESS');
    expect(component.instructorsConsolidated[2].status).toEqual('ADDING');
    expect(component.activeRequests).toEqual(2);
  });

  it('should add only instructors that are not currently in edit mode when trying to add all', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor B',
        email: 'instructorb@example.com',
        institution: 'Sample Institution B',
        status: 'PENDING',
        isCurrentlyBeingEdited: true,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor C',
        email: 'instructorc@example.com',
        institution: 'Sample Institution C',
        status: 'FAIL',
        statusCode: 400,
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'The instructor cannot be added for some reason',
      },
    ];
    fixture.detectChanges();

    const addAllButton: any = fixture.debugElement.nativeElement.querySelector('#add-all-instructors');
    addAllButton.click();

    expect(component.instructorsConsolidated[0].status).toEqual('ADDING');
    expect(component.instructorsConsolidated[1].status).toEqual('PENDING');
    expect(component.instructorsConsolidated[2].status).toEqual('ADDING');
    expect(component.activeRequests).toEqual(2);
  });

  it('should snap with default view', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should snap with some instructors details', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor B',
        email: 'instructorb@example.com',
        institution: 'Sample Institution B',
        status: 'SUCCESS',
        statusCode: 200,
        isCurrentlyBeingEdited: false,
        joinLink: 'http://localhost:4200/web/join',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor C',
        email: 'instructorc@example.com',
        institution: 'Sample Institution C',
        status: 'FAIL',
        statusCode: 400,
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'The instructor cannot be added for some reason',
      },
      {
        name: 'Instructor D',
        email: 'instructord@example.com',
        institution: 'Sample Institution C',
        status: 'FAIL',
        statusCode: 409,
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'Cannot create account request as instructor has already registered.',
      },
    ];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should snap with disabled adding instructor button if there are active requests', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'ADDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
      {
        name: 'Instructor B',
        email: 'instructorb@example.com',
        institution: 'Sample Institution B',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'This should not be displayed',
      },
    ];
    component.activeRequests = 1;
    component.isAddingInstructors = true;

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should add multiple instructors split by tabs', () => {
    component.instructorDetails = `Instructor A   \t  instructora@example.com \t  Sample Institution A\n
     Instructor B \t instructorb@example.com \t Sample Institution B`;

    fixture.detectChanges();

    const button: any = fixture.debugElement.nativeElement.querySelector('#add-instructor-single-line');
    button.click();

    expect(component.instructorsConsolidated.length).toEqual(2);
    expect(component.instructorsConsolidated[0]).toEqual(
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
      },
    );
    expect(component.instructorsConsolidated[1]).toEqual(
      {
        name: 'Instructor B',
        email: 'instructorb@example.com',
        institution: 'Sample Institution B',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
      },
    );
  });

  it('should add multiple instructors split by vertical bars', () => {
    component.instructorDetails = `Instructor A | instructora@example.com | Sample Institution A\n
        Instructor B | instructorb@example.com | Sample Institution B`;

    fixture.detectChanges();

    const button: any = fixture.debugElement.nativeElement.querySelector('#add-instructor-single-line');
    button.click();

    expect(component.instructorsConsolidated.length).toEqual(2);
    expect(component.instructorsConsolidated[0]).toEqual(
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
      },
    );
    expect(component.instructorsConsolidated[1]).toEqual(
      {
        name: 'Instructor B',
        email: 'instructorb@example.com',
        institution: 'Sample Institution B',
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
      },
    );
  });

  it('should call showRegisteredInstructorModal when info button for registered instructors clicked', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'FAIL',
        statusCode: 409,
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'message',
      },
    ];

    fixture.detectChanges();

    const spy = jest.spyOn(component, 'showRegisteredInstructorModal').mockImplementation(() => {});

    const infoButton = fixture.debugElement.nativeElement.querySelector('#instructor-0-registered-info-button');
    infoButton.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should fetch account and course information when showRegisteredInstructorModal is called', () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'FAIL',
        statusCode: 409,
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'message',
      },
    ];

    const modalSpy = jest
      .spyOn(simpleModalService, 'openInformationModal')
      .mockReturnValue(createMockNgbModalRef());
    const getAccountsSpy = jest
      .spyOn(accountService, 'getAccounts')
      .mockReturnValue(of({
        accounts: [
          {
            googleId: 'googleId',
            name: 'name',
            email: 'email',
            readNotifications: {},
          },
        ],
      }));
    const getStudentCoursesSpy = jest
      .spyOn(courseService, 'getStudentCoursesInMasqueradeMode')
      .mockReturnValue(of({
        courses: [
          {
            courseId: 'courseId',
            courseName: 'courseName',
            timeZone: 'not used',
            institute: 'institute',
            creationTimestamp: 0,
            deletionTimestamp: 0,
          },
        ],
      }));
    const getInstructorCoursesSpy = jest
      .spyOn(courseService, 'getInstructorCoursesInMasqueradeMode')
      .mockReturnValue(of({
        courses: [
          {
            courseId: 'courseId',
            courseName: 'courseName',
            timeZone: 'not used',
            institute: 'institute',
            creationTimestamp: 0,
            deletionTimestamp: 0,
          },
        ],
      }));
    const generateAccountLinkSpy = jest
      .spyOn(linkService, 'generateManageAccountLink')
      .mockReturnValue('manageAccountLink');

    fixture.detectChanges();

    component.showRegisteredInstructorModal(0);

    expect(modalSpy).toHaveBeenCalledTimes(1);
    expect(getAccountsSpy).toHaveBeenCalledTimes(1);
    expect(getAccountsSpy).toHaveBeenCalledWith('instructora@example.com');
    expect(getStudentCoursesSpy).toHaveBeenCalledTimes(1);
    expect(getStudentCoursesSpy).toHaveBeenCalledWith('googleId');
    expect(getInstructorCoursesSpy).toHaveBeenCalledTimes(1);
    expect(getInstructorCoursesSpy).toHaveBeenCalledWith('googleId');
    expect(generateAccountLinkSpy).toHaveBeenCalledTimes(1);
    expect(generateAccountLinkSpy).toHaveBeenCalledWith('googleId', '/admin/accounts');
    expect(component.isRegisteredInstructorModalLoading).toBeFalsy();
  });

  it('should call reset account endpoint when resetAccountRequest called', async () => {
    component.instructorsConsolidated = [
      {
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'FAIL',
        statusCode: 409,
        isCurrentlyBeingEdited: false,
        joinLink: 'This should not be displayed',
        message: 'message',
      },
    ];

    fixture.detectChanges();

    const resetAccountSpy = jest.spyOn(accountService, 'resetAccountRequest').mockReturnValue(of({
      joinLink: 'link',
    }));

    const modalSpy = jest
      .spyOn(simpleModalService, 'openConfirmationModal')
      .mockImplementation(() => {
        return createMockNgbModalRef();
      });

    component.resetAccountRequest(0);

    await fixture.whenStable().then(() => {
      expect(modalSpy).toHaveBeenCalledTimes(1);
      expect(resetAccountSpy).toBeCalledTimes(1);
      expect(resetAccountSpy).toBeCalledWith('instructora@example.com', 'Sample Institution A');
      expect(component.instructorsConsolidated[0]).toEqual({
        name: 'Instructor A',
        email: 'instructora@example.com',
        institution: 'Sample Institution A',
        status: 'SUCCESS',
        statusCode: 200,
        isCurrentlyBeingEdited: false,
        joinLink: 'link',
        message: 'message',
      });
    });
  });
});
