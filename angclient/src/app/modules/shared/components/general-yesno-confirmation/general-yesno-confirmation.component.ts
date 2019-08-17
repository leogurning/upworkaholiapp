import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    public modalRef: BsModalRef) { }

  remarks = new FormControl('', Validators.nullValidator);

  ngOnInit() {
    this.cancelAction = true;
    this.inputForm = this.fb.group({
      remarks: this.remarks,
    });
  }

  confirm(formdata): void {
    this.cancelAction = false;
    if (this.isRemarks) { this.returnData = formdata; }
    this.modalRef.hide();
  }

  decline(): void {
    this.cancelAction = true;
    this.modalRef.hide();
  }
}
