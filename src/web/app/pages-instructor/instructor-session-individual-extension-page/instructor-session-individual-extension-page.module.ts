import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DatepickerModule } from '../../components/datepicker/datepicker.module';
import { LoadingRetryModule } from '../../components/loading-retry/loading-retry.module';
import { LoadingSpinnerModule } from '../../components/loading-spinner/loading-spinner.module';
import { TeammatesCommonModule } from '../../components/teammates-common/teammates-common.module';
import { TimepickerModule } from '../../components/timepicker/timepicker.module';
import {
  IndividualExtensionConfirmModalComponent,
} from './individual-extension-confirm-modal/individual-extension-confirm-modal.component';
import {
  IndividualExtensionDateModalComponent,
} from './individual-extension-date-modal/individual-extension-date-modal.component';
import {
  InstructorSessionIndividualExtensionPageComponent,
} from './instructor-session-individual-extension-page.component';

const routes: Routes = [
  {
    path: '',
    component: InstructorSessionIndividualExtensionPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TeammatesCommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LoadingSpinnerModule,
    DatepickerModule,
    TimepickerModule,
    LoadingRetryModule,
  ],
  entryComponents: [IndividualExtensionDateModalComponent, IndividualExtensionConfirmModalComponent],
  declarations: [
    InstructorSessionIndividualExtensionPageComponent,
    IndividualExtensionDateModalComponent,
    IndividualExtensionConfirmModalComponent,
  ],
  exports: [InstructorSessionIndividualExtensionPageComponent],
})
export class InstructorSessionIndividualExtensionPageModule {}
