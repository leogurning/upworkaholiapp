import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { User } from '../../../../interfaces/user';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ProfileService } from '../../../../services/profile.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  inputForm: FormGroup;
  currentUser$: User;
  userData: User;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  displayImg: string;
  private filesToUpload: File[];
  private photoname: string;
  private profileuploadpath = environment.profileUploadpath;
  maxfilesize: number;

  profileId: string;
  datePickerConfig: Partial<BsDatepickerConfig>;
  showAvailableDate = false;

  constructor(
    private fb: FormBuilder,
      public authenticationService: AuthService,
      private userService: UserService,
      private profileService: ProfileService,
      private router: Router,
      private route: ActivatedRoute,
      private toastr: ToastrService,
      private modalService: BsModalService
  ) {

    // Set BsDatePicker (DatePicker component) configuration date format DD/MM/YYYY
    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-red',
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY',
        selectFromOtherMonth: true,
      });

    this.authenticationService.currentUser.subscribe(x => this.currentUser$ = x);
  }

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  title = new FormControl('', [Validators.required]);
  summary = new FormControl('', [Validators.required]);
  skills = new FormControl('', [Validators.required]);
  address1 = new FormControl('', [Validators.required]);
  address2 = new FormControl('', [Validators.nullValidator]);
  city = new FormControl('', [Validators.required]);
  province = new FormControl('', [Validators.required]);
  country = new FormControl('', [Validators.required]);
  contactNo = new FormControl('', [Validators.required]);
  languages = new FormControl('', [Validators.required]);
  isAvailable = new FormControl(true, [Validators.required]);
  availableDate = new FormControl('', [Validators.nullValidator, this.dateValidator]);

  ngOnInit() {
    this.maxfilesize = 6000000;
    this.inputForm = this.fb.group({
      firstName: this.firstName,
      lastName: this.lastName,
      title: this.title,
      summary: this.summary,
      skills: this.skills,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      province: this.province,
      country: this.country,
      contactNo: this.contactNo,
      languages: this.languages,
      isAvailable: this.isAvailable,
      availableDate: this.availableDate
    });

    this.displayImg = 'assets/images/default_profile.jpg';
    // Get user data
    this.loading = true;
    this.profileService.getFreelancerProfile(this.currentUser$.userName).subscribe(data => {
      this.loading = false;
      this.populateForm(data);
    },
    err => {
      this.loading = false;
    });

  }
  // Populate form data if profile exists
  populateForm(data) {

    if (data.profilePhotoPath) {
      this.displayImg = data.profilePhotoPath;
    }

    if (data.profilePhotoName) {
      this.photoname = data.profilePhotoName;
    }

    this.showAvailableDate = data.isAvailable ? false : true ;
    this.profileId = data._id;
    this.inputForm.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      summary: data.summary,
      skills: data.skills,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      province: data.province,
      country: data.country,
      contactNo: data.contactNo,
      languages: data.languages,
      isAvailable: data.isAvailable
    });

    if (data.availableDate) {
      this.inputForm.patchValue({
        availableDate: moment(data.availableDate).utc(true).toDate()
      });
    } else {
      this.inputForm.patchValue({
        availableDate: data.availableDate
      });
    }
  }

  saveProfile(formdata) {
    if (this.inputForm.dirty && this.inputForm.valid) {
      formdata.userName = this.currentUser$.userName;
      if (this.profileId) {
        formdata.profileId = this.profileId;
      } else if (this.photoname) {
        formdata.profilePhotoPath = this.displayImg;
        formdata.profilePhotoName = this.photoname;
      }

      if (this.showAvailableDate) {
        formdata = {
          ...formdata,
          availableDate: moment(formdata.availableDate).utc(true).toDate()
        };
      }
      // Save the freelancer profile
      this.loading = true;
      this.profileService.saveFreelancerProfile(formdata).subscribe(data => {
        this.loading = false;
        this.profileId = data._id;
        this.toastr.success('Profile data is saved successfully');
      },
      err => {
        this.loading = false;
        const errResponse = (err as ServiceErrorResponse);
        this.toastr.error(errResponse.message);
      });
    } else {
      this.toastr.info('No data changes yet.');
    }
  }

  // Check if a field already been modified with invalid value
  isFieldInvalid(fieldName: string) {
    const fieldObj = this.inputForm.get(fieldName);
    if (fieldObj !== null) {
      return (fieldObj.dirty && fieldObj.invalid);
    }

    return false;
  }

  onIsAvailable(event) {
    this.showAvailableDate = event.target.checked ? false : true ;
    if (this.showAvailableDate) {
      this.inputForm.patchValue({
        availableDate: moment().utc(true).add(2, 'days').toDate()
      });
    } else {
      this.inputForm.patchValue({
        availableDate: ''
      });
    }
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

  fileChangeEvent(fileInput: any): void {
    const files: Array<File> = <Array<File>>fileInput.target.files;

    // if (~files[0].type.indexOf('image/') ) { --> bitwise operation ~, isnot allowed
    if (files[0].type.indexOf('image/') >= 0) {
      if (files[0].size <= +this.maxfilesize) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        this.updateprofilePhoto();
      } else {
        const mfsize = +this.maxfilesize / 1000000 ;
        alert(`Error file size. File size is maximum ${mfsize} Mb`);
      }
    } else  {
      alert('Error file type. You must input image file type.');
    }
  }

  updateprofilePhoto(): void {

    const files: Array<File> = this.filesToUpload;
    const lformData = new FormData();
    lformData.append('fileinputsrc', files[0], files[0]['name']);
    lformData.append('userName', this.currentUser$.userName);
    lformData.append('uploadPath', this.profileuploadpath);
    lformData.append('photoName', this.photoname);
    lformData.append('profileId', this.profileId);
    // Call change profile photo service
    this.loading = true;
    this.profileService.changeProfilePhoto(lformData)
    .subscribe(data => {
        this.loading = false;
        if (this.profileId) {
          this.toastr.success('Photo is updated successfully');
        } else {
          this.photoname = data.newPhotoName;
        }
        this.displayImg = data.newPhotoPath;
    },
    err => {
      this.loading = false;
      const errResponse = (err as ServiceErrorResponse);
      this.toastr.error(errResponse.message);
    });
  }
  onCancel() {
    // Get user data
    this.loading = true;
    this.profileService.getFreelancerProfile(this.currentUser$.userName).subscribe(data => {
      this.loading = false;
      this.populateForm(data);
    },
    err => {
      this.loading = false;
    });
  }
}
