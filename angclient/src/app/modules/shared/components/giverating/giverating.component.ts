import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-giverating',
  templateUrl: './giverating.component.html',
  styleUrls: ['./giverating.component.css']
})
export class GiveratingComponent implements OnInit {
  title: string;
  data;
  inputForm: FormGroup;
  loading = false;

  cancelAction: boolean;
  returnData;

  constructor(
    private fb: FormBuilder,
    public modalRef: BsModalRef
  ) { }

  ratingClicked: number;

  ngOnInit() {
    this.cancelAction = true;
  }

  decline(): void {
    this.cancelAction = true;
    this.modalRef.hide();
  }

  confirm(): void {
    if (this.ratingClicked) {
      this.cancelAction = false;
      this.returnData = this.ratingClicked; 
      this.modalRef.hide();
    } else {
      alert('Please give your rating.')
    }
  }

  ratingComponentClick(clickObj: any): void {
    this.ratingClicked = clickObj.rating;
  }
}
