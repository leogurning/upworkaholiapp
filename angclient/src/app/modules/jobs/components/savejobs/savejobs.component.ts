import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from '../../../../common/toastr.service';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../../../../interfaces/user';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';
import { JobsService } from '../../../../services/jobs.service';

@Component({
  selector: 'app-savejobs',
  templateUrl: './savejobs.component.html',
  styleUrls: ['./savejobs.component.css']
})
export class SavejobsComponent implements OnInit, AfterViewInit {
  modalTitle: string;
  user: User;
  data;
  jobId: string;
  cancelAction = false;
  inputForm: FormGroup;
  jobCategoryList = [
    { displayValue: 'Project' },
    { displayValue: 'Operation' },
    { displayValue: 'Maintenance/Support' },
  ];
  projectTypeList = [
    { displayValue: 'One-time' },
    { displayValue: 'Continual' },
  ];

  paymentTermList = [
    { displayValue: 'Full Payment' },
    { displayValue: 'Stage Payment' },
  ];

  dateValidationCode = '200'; // intial date validation code 200 (success)
  @ViewChild('inputEndDateRef') inputEndDateElementRef: ElementRef;
  @ViewChild('inputTitleRef') inputTitleElementRef: ElementRef;
  datePickerConfig: Partial<BsDatepickerConfig>;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private jobService: JobsService,
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

  jobTitle = new FormControl('', [Validators.required]);
  jobDescription = new FormControl('', [Validators.required]);
  jobCategory = new FormControl('', [Validators.required]);
  jobType = new FormControl('', [Validators.required]);
  startDate = new FormControl('', [Validators.required, this.dateValidator]);
  endDate = new FormControl('', [Validators.required, this.dateValidator]);
  skills = new FormControl('', [Validators.required]);
  paymentTerm = new FormControl('', [Validators.required]);
  paymentDescription = new FormControl('', [Validators.required]);
// tslint:disable-next-line: max-line-length
  jobAmount = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);

  ngOnInit() {
    /* if (this.jobId) {
      this.modalTitle = 'Edit jobs';
    } else {
      this.modalTitle = 'Add jobs';
    } */

    if (this.data.type === 'edit') {
      this.modalTitle = 'Edit job';
    } else if (this.data.type === 'add') {
      this.modalTitle = 'Add job';
    } else if (this.data.type === 'view') {
      this.modalTitle = 'View job';
      this.disabledControl = true;
    }

    this.inputForm = this.fb.group({
      jobTitle: this.jobTitle,
      jobDescription: this.jobDescription,
      jobCategory: this.jobCategory,
      jobType: this.jobType,
      startDate: this.startDate,
      endDate: this.endDate,
      jobAmount: this.jobAmount,
      skills: this.skills,
      paymentTerm: this.paymentTerm,
      paymentDescription: this.paymentDescription,
    });

    this.populateForm(this.data.jobs);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputTitleElementRef.nativeElement.focus();
    }, 300);
  }

  populateForm(dataArray): void {
    if (this.jobId) {
      // Condition edit data
      const jobToDisplay = dataArray[0];
      this.inputForm.patchValue({
        jobTitle: jobToDisplay.jobTitle,
        jobDescription: jobToDisplay.jobDescription,
        jobCategory: jobToDisplay.jobCategory,
        jobType: jobToDisplay.jobType,
        startDate: moment(jobToDisplay.startDate).utc(true).toDate(),
        endDate: moment(jobToDisplay.endDate).utc(true).toDate(),
        jobAmount: jobToDisplay.jobAmount,
        skills: jobToDisplay.skills,
        paymentTerm: jobToDisplay.paymentTerm,
        paymentDescription: jobToDisplay.paymentDescription,
      });

    } else {
      // Condition if the add action is from the add button above the table.
      // set the initial data of job,stardate and end date
      this.inputForm.patchValue({
        jobCategory: this.jobCategoryList[0].displayValue,
        jobType: this.projectTypeList[0].displayValue,
        paymentTerm: this.paymentTermList[0].displayValue,
        startDate: moment().utc(true).toDate(),
        endDate: moment().utc(true).toDate(),
      });
    }
  }

  saveJob(formdata): void {
    if (this.inputForm.dirty && this.inputForm.valid) {
      formdata.userName = this.user.userName;
      if (this.jobId) {
        formdata.jobId = this.jobId;
      }
      // Save the Job Data
      this.loading = true;
      this.jobService.saveJob(formdata).subscribe(data => {
        this.loading = false;
        this.jobId = data._id;
        this.toastr.success('Job data is saved successfully');
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

  // Function to check input startDate and endDate
  dateInputValidation(firstDate: Date, lastDate: Date): string {
    let resultCode = '200';
    if (lastDate < firstDate) {
      // Error condition when endDate date before startDate date
      resultCode = '500';
      this.toastr.error('Error! End Date must be after Start date');
    }
    return resultCode;
  }

  // Method fired when there is changes in startDate date and endDate date input
  dateInputChange(event: Date, codeDate: string) {
    if (event) {
      if (codeDate === 'first') {
        // Change in the startDate date. Validate the input date.
        this.dateValidationCode = this.dateInputValidation(event, moment.utc(this.inputForm.get('endDate').value).toDate());
      } else if (codeDate === 'last') {
        // Change in the endDate date. Validate the input date.
        this.dateValidationCode = this.dateInputValidation(moment.utc(this.inputForm.get('startDate').value).toDate(), event);
      }
      if (this.dateValidationCode === '500') {
        this.inputEndDateElementRef.nativeElement.focus();
      }
    }
  }
}
