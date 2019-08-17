import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../interfaces/user';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ProfileService } from '../../../../services/profile.service';
import { ServiceErrorResponse } from './../../../../interfaces/service-response';

@Component({
  selector: 'app-employerprofile',
  templateUrl: './employerprofile.component.html',
  styleUrls: ['./employerprofile.component.css']
})
export class EmployerprofileComponent implements OnInit {

  inputForm: FormGroup;
  currentUser$: User;
  userData: User;
  loading = false;
  subscriptions: Subscription[] = [];
  displayImg: string;
  private filesToUpload: File[];
  private photoname: string;
  private profileuploadpath = environment.profileUploadpath;
  maxfilesize: number;

  profileId: string;

  constructor(
    private fb: FormBuilder,
      public authenticationService: AuthService,
      private userService: UserService,
      private profileService: ProfileService,
      private router: Router,
      private route: ActivatedRoute,
      private toastr: ToastrService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser$ = x);
  }

  companyName = new FormControl('', [Validators.required]);
  title = new FormControl('', [Validators.required]);
  summary = new FormControl('', [Validators.required]);
  address1 = new FormControl('', [Validators.required]);
  address2 = new FormControl('', [Validators.nullValidator]);
  city = new FormControl('', [Validators.required]);
  province = new FormControl('', [Validators.required]);
  country = new FormControl('', [Validators.required]);
  contactNo = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.maxfilesize = 6000000;
    this.inputForm = this.fb.group({
      companyName: this.companyName,
      title: this.title,
      summary: this.summary,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      province: this.province,
      country: this.country,
      contactNo: this.contactNo,
    });

    this.displayImg = 'assets/images/default_profile.jpg';
    // Get user data
    this.loading = true;
    this.profileService.getEmployerProfile(this.currentUser$.userName).subscribe(data => {
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

    this.profileId = data._id;
    this.inputForm.patchValue({
      companyName: data.companyName,
      title: data.title,
      summary: data.summary,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      province: data.province,
      country: data.country,
      contactNo: data.contactNo,
    });
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

      // Save the employer profile
      this.loading = true;
      this.profileService.saveEmployerProfile(formdata).subscribe(data => {
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
    this.profileService.changeEmployerProfilePhoto(lformData)
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
    this.profileService.getEmployerProfile(this.currentUser$.userName).subscribe(data => {
      this.loading = false;
      this.populateForm(data);
    },
    err => {
      this.loading = false;
    });
  }
}
