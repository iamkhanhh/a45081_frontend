import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-sample-vcf',
  templateUrl: './create-sample-vcf.component.html',
  styleUrl: './create-sample-vcf.component.scss'
})
export class CreateSampleVcfComponent {
  constructor(
    public modal: NgbActiveModal,
  ) {}

  close() {
    this.modal.close();
  }
}
