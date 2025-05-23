import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { delay, Subscription } from 'rxjs';
import { VariantListService } from '../../services/variant-list.service';

@Component({
  selector: 'app-delete-selected-variant',
  templateUrl: './delete-selected-variant.component.html',
  styleUrl: './delete-selected-variant.component.scss'
})
export class DeleteSelectedVariantComponent {
  @Input() id: number;
  @Input() variant: any;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []

  constructor(
    private variantListService: VariantListService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

  delete() {
    this.isLoading = true;
    let data = {
      chrom: this.variant.chrom,
      pos: this.variant.position,
      ref: this.variant.REF,
      alt: this.variant.ALT,
      gene: this.variant.gene
    };
    const sb = this.variantListService.deleteSelectedVariant(this.id, data)
      .pipe(
        delay(1000)
      )
      .subscribe((response: any) => {
        this.isLoading = false;
        if (response.status === 'success') {
          this.toastr.success(response.message);
          this.modal.close();
        } else {
          this.toastr.error(response.message);
        }
        this.cd.detectChanges();
      });
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
