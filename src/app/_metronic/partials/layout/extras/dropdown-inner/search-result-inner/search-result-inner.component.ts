import {ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from './search.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-result-inner',
  templateUrl: './search-result-inner.component.html',
})
export class SearchResultInnerComponent implements OnInit {
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @HostBinding('attr.data-kt-search-element') dataKtSearch = 'content';

  // resultModels: Array<ResultModel> = resultModels;
  // recentlySearchedModels: Array<ResultModel> = recentlySearchedModels;

  keyword: string = '';
  searching: boolean = false;

  @ViewChild('searchModal') searchModal: TemplateRef<any>;

  // search results
  searchSamples: any[] = [];
  searchAnalyses: any[] = [];
  searchWorkspaces: any[] = [];

  constructor(private cdr: ChangeDetectorRef,
              private modalService: NgbModal,
              private searchService: SearchService,
              public router: Router) {
  }

  ngOnInit(): void {
  }

  search(keyword: string) {
    this.keyword = keyword;
    if (!keyword || keyword.trim().length === 0) {
      this.searchSamples = this.searchAnalyses = this.searchWorkspaces = [];
      return;
    }

    this.searching = true;

    // call three services in parallel (first page, small page size)
    const search$ = this.searchService.search({ searchTerm: keyword });

    forkJoin([search$]).subscribe((res: any) => {
      // responses expected to have { status, data }
      const analysesRes: any = res[0].data.analysis.items;
      const samplesRes: any = res[0].data.samples.items;
      const workspacesRes: any = res[0].data.workspaces.items;

      this.searchSamples = (samplesRes ) ? samplesRes : [];
      this.searchAnalyses = (analysesRes) ? analysesRes: [];
      this.searchWorkspaces = (workspacesRes) ? workspacesRes: [];

      this.searching = false;
      this.cdr.detectChanges();

    }, (err) => {
      this.searching = false;
      this.cdr.detectChanges();
    });
  }

  clearSearch() {
    this.keyword = '';
  }
}


