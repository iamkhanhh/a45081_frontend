import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-sample',
  templateUrl: './delete-sample.component.html',
  styleUrl: './delete-sample.component.scss'
})
export class DeleteSampleComponent {
  @Input() id: any;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []
}
