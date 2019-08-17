import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from '../../../../common/toastr.service';

@Component({
  selector: 'app-general-yesno-confirmation',
  templateUrl: './general-yesno-confirmation.component.html',
  styleUrls: ['./general-yesno-confirmation.component.css']
})
export class GeneralYesnoConfirmationComponent implements OnInit {
  title: string;
  data;
  isRemarks: boolean;
  inputForm: FormGroup;
  loading = false;

  cancelAction: boolean;
  returnData;

  constructor(
    private fb: FormBuilder,
    public modalRef: BsModalRef,
    private toastr: ToastrService,
  ) { }

  remarks = new FormControl('', Validators.nullValidator);

  ngOnInit() {
    this.cancelAction = true;
    this.inputForm = this.fb.group({
      remarks: this.remarks,
    });
  }

  confirm(formdata): void {
    this.cancelAction = false;
    if (this.isRemarks && formdata.remarks) {
      this.returnData = formdata;
      this.modalRef.hide();
    } else if (!this.isRemarks) {
      this.modalRef.hide();
    } else if (!formdata.remarks) {
      this.toastr.error('Please input the cancel remarks !');
    }
  }

  decline(): void {
    this.cancelAction = true;
    this.modalRef.hide();
  }
}
