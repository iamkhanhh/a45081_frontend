import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateSampleVcfComponent } from '../create-sample-vcf/create-sample-vcf.component';
import { CreateSampleFastqComponent } from '../create-sample-fastq/create-sample-fastq.component';

@Component({
  selector: 'dropdown-create-sample',
  templateUrl: './dropdown-create-sample.component.html',
})
export class DropdownCreateSampleComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @Output() reloadSamples = new EventEmitter<void>();


  constructor(
    private readonly modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  openModalUploadVcf() {
    const modalRef = this.modalService.open(CreateSampleVcfComponent, { size: 'xl' });
    modalRef.result.then(() =>
      this.reloadSamples.emit(),
      () => {}
    );
  }

  openModalUploadFastq() {
    const modalRef = this.modalService.open(CreateSampleFastqComponent, { size: 'xl' , scrollable: true});
    modalRef.result.then(() =>
      this.reloadSamples.emit(),
      () => {}
    );
  }
}
