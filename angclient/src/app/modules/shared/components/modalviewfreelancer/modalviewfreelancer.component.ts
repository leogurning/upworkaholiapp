import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modalviewfreelancer',
  templateUrl: './modalviewfreelancer.component.html',
  styleUrls: ['./modalviewfreelancer.component.css']
})
export class ModalviewfreelancerComponent implements OnInit {
  data: string;
  urlToAccess: SafeResourceUrl;

  constructor(
    public modalRef: BsModalRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const urlRoomAvailability = `${window.location.protocol}//${window.location.host}/freelancer/view/${this.data}`;
    this.urlToAccess = this.sanitizer.bypassSecurityTrustResourceUrl(urlRoomAvailability);
  }

  closePage(): void {
    this.modalRef.hide();
  }

}
