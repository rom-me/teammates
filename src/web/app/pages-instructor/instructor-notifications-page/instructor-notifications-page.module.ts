import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserNotificationsListModule } from '../../components/user-notifications-list/user-notifications-list.module';
import { InstructorNotificationsPageComponent } from './instructor-notifications-page.component';

const routes: Routes = [
  {
    path: '',
    component: InstructorNotificationsPageComponent,
  },
];

/**
 * Module for instructor notifications page.
 */
@NgModule({
  imports: [
    CommonModule,
    UserNotificationsListModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    InstructorNotificationsPageComponent,
  ],
  exports: [
    InstructorNotificationsPageComponent,
  ],
})
export class InstructorNotificationsPageModule { }
