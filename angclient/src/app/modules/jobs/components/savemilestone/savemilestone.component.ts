import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from '../../../../common/toastr.service';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../../../../interfaces/user';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { MilestonesService } from '../../../../services/milestones.service';

@Component({
  selector: 'app-savemilestone',
  templateUrl: './savemilestone.component.html',
  styleUrls: ['./savemilestone.component.css']
})
export class SavemilestoneComponent implements OnInit, AfterViewInit {
  modalTitle: string;
  user: User;
  data;
  jobId: string;
  milestoneId: string;
  cancelAction = false;
  inputForm: FormGroup;

  dateValidationCode = '200'; // intial date validation code 200 (success)
  loading = false;
  datePickerConfig: Partial<BsDatepickerConfig>;
  @ViewChild('inputExpectedCDateRef') inputEndDateElementRef: ElementRef;
  @ViewChild('inputTitleRef') inputTitleElementRef: ElementRef;

  constructor(
    private fb: FormBuilder,
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private milestoneService: MilestonesService,
  ) {
    // Set BsDatePicker (DatePicker component) configuration date format DD/MM/YYYY
    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-red',
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY',
        selectFromOtherMonth: true,
      });
  }

  disabledControl = false;

  milestoneTitle = new FormControl('', [Validators.required]);
  milestoneDescription = new FormControl('', [Validators.required]);
  expectedCompletedDate = new FormControl('', [Validators.required, this.dateValidator]);
  milestoneAmount = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);

  ngOnInit() {
    if (this.data.type === 'edit') {
      this.modalTitle = 'Edit milestone';
    } else if (this.data.type === 'add') {
      this.modalTitle = 'Add milestone';
    } else if (this.data.type === 'view') {
      this.modalTitle = 'View milestone';
      this.disabledControl = true;
    }
    if (this.data.milestone) {
      this.milestoneId = this.data.milestone._id;
    }

    this.inputForm = this.fb.group({
      milestoneTitle: this.milestoneTitle,
      milestoneDescription: this.milestoneDescription,
      expectedCompletedDate: this.expectedCompletedDate,
      milestoneAmount: this.milestoneAmount
    });

    this.populateForm(this.data.milestone);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputTitleElementRef.nativeElement.focus();
    }, 300);
  }

  populateForm(dataArray): void {
    // Check milestone id
    if (this.milestoneId) {
      // Condition edit data
      const milestoneToDisplay = dataArray;
      this.inputForm.patchValue({
        milestoneTitle: milestoneToDisplay.milestoneTitle,
        milestoneDescription: milestoneToDisplay.milestoneDescription,
        expectedCompletedDate: moment(milestoneToDisplay.expectedCompletedDate).utc(false).toDate(),
        milestoneAmount: milestoneToDisplay.milestoneAmount,
      });

    } else {
      // Condition if the add action is from the add button above the timeline.
      // set the initial data of dimension1, 2, firstNight and lastNight
      this.inputForm.patchValue({
        expectedCompletionDate: moment().utc(true).toDate(),
      });
    }
  }

  saveMilestone(formdata): void {
    if (this.inputForm.dirty && this.inputForm.valid) {
      if (this.milestoneId) {
        formdata.milestoneId = this.milestoneId;
      }
      if (this.jobId) {
        formdata.jobId = this.jobId;
      }
      // Save the Job Data
      this.loading = true;
      this.milestoneService.saveMilestone(formdata).subscribe(data => {
        this.loading = false;
        this.milestoneId = data._id;
        this.toastr.success('Milestone data is saved successfully');
        this.modalRef.hide();
      },
      err => {
        this.loading = false;
        const errResponse = (err as ServiceErrorResponse);
        this.toastr.error(errResponse.message);
      });
    }
  }

  cancelModal(): void {
    this.cancelAction = true;
    this.modalRef.hide();
  }

  /**
   * validate date form control as not required and valid date
   * @param control form control to validate
   */
  dateValidator(control: FormControl) {
    const value = control.value;

    // because it is not required
    if (value === '' || value === null) {
      return null;
    }

    const date = moment(value, 'DD/MM/YYYY').utc();

    // if invalid date input
    if (!date.isValid()) {
      return {
        message: 'Please input the correct Date'
      };
    }

    const todayDate = moment().utc();
    if (date.isSameOrBefore(todayDate) === true) {
      return {
        message: 'Date must be greater than today'
      };
    }

    // otherwise no error
    return null;
  }
}
