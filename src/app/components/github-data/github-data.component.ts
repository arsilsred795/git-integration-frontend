import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.config';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GithubService } from '../../services/github.service';
import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  Module,
  ModuleRegistry,
  PaginationModule,
  QuickFilterModule,
  TextFilterModule,
} from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { Router } from '@angular/router';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  PaginationModule,
  QuickFilterModule,
]);
@Component({
  selector: 'app-github-data',
  imports: [...MATERIAL_IMPORTS, CommonModule, AgGridModule],
  templateUrl: './github-data.component.html',
  styleUrl: './github-data.component.scss',
  standalone: true,
})
export class GithubDataComponent {
  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public gridApi!: GridApi;
  public modules: Module[] = [ClientSideRowModelModule];
  isBrowser: boolean;
  selectedIntegration: any;
  selectedRepo: any;
  organizations: any[] = [];
  selectedEntity = 'commits';
  searchText = '';
  repos: any[] = [];

  rowData: any[] = [];
  columnDefs: ColDef[] = [];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
  };

  isAgGridLoaded: boolean;
  userInfo: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private gitHubService: GithubService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isAgGridLoaded = false;
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') ?? '{}');
    if (JSON.stringify(this.userInfo) === '{}') {
      this.router.navigate(['']);
    }
    this.loadAgGrid();
    this.fetchOrganization();
  }

  ngAfterViewInit() {
    if (this.agGrid) {
      this.gridApi = this.agGrid.api;
    }
  }

  onGridReady(event: any) {
    this.gridApi = event.api;
  }

  async loadAgGrid() {
    if (typeof window !== 'undefined') {
      this.isAgGridLoaded = true;
    }
  }

  fetchOrganization() {
    this.gitHubService
      .fetchOrganizations(this.userInfo.accessToken)
      .subscribe((res) => {
        this.organizations = res;
        this.selectedIntegration = this.organizations[0]?.login;
        this.fetchRepos();
      });
  }
  fetchRepos() {
    this.gitHubService
      .fetchRepos(this.userInfo.accessToken, this.selectedIntegration)
      .subscribe((res) => {
        this.repos = res;
        this.selectedRepo = this.repos[0]?.name;
        this.fetchEntity();
      });
  }
  fetchEntity() {
    if (this.selectedEntity === 'commits') {
      this.gitHubService
        .fetchCommits(
          this.userInfo.accessToken,
          this.selectedRepo,
          this.selectedIntegration
        )
        .subscribe((res) => {
          this.updateGrid(res);
        });
    }
    if (this.selectedEntity === 'pulls') {
      this.gitHubService
        .fetchPulls(
          this.userInfo.accessToken,
          this.selectedRepo,
          this.selectedIntegration
        )
        .subscribe((res) => {
          this.updateGrid(res);
        });
    }
    if (this.selectedEntity === 'users') {
      this.gitHubService
        .fetchUsers(this.userInfo.accessToken, this.selectedIntegration)
        .subscribe((res) => {
          this.updateGrid(res);
        });
    }
    if (this.selectedEntity === 'issues') {
      this.gitHubService
        .fetchIssues(
          this.userInfo.accessToken,
          this.selectedRepo,
          this.selectedIntegration
        )
        .subscribe((res) => {
          this.updateGrid(res);
        });
    }
    if (this.selectedEntity === 'changelogs') {
      this.gitHubService
        .fetchChangelogs(
          this.userInfo.accessToken,
          this.selectedRepo,
          this.selectedIntegration
        )
        .subscribe((res) => {
          this.updateGrid(res);
        });
    }
  }

  // Dynamically update the grid
  updateGrid(data: any) {
    if (data.length > 0) {
      const firstIntegration = data[0];
      this.columnDefs = this.getDynamicColumnDefs(firstIntegration);
      this.rowData = data;
      this.isAgGridLoaded = true;
    } else {
      this.rowData = [];
      this.columnDefs = [];
      this.isAgGridLoaded = true;
    }
  }

  getDynamicColumnDefs(row: any): ColDef[] {
    return Object.keys(row).map((key) => {
      const columnDef: ColDef = {
        headerName: this.formatHeader(key),
        field: key,
        filter: 'agTextColumnFilter',
      };

      if (key === 'commit') {
        columnDef.valueGetter = (params) => params.data[key]?.message || '';
      }
      if (key === 'author') {
        columnDef.valueGetter = (params) => params.data[key]?.login || '';
      }
      if (key === 'committer') {
        columnDef.valueGetter = (params) => params.data[key]?.login || '';
      }
      if (key === 'parents') {
        columnDef.valueGetter = (params) => '';
      }
      if (key === 'reactions') {
        columnDef.valueGetter = (params) => params.data[key]?.total_count || '';
      }
      if (key === 'user') {
        columnDef.valueGetter = (params) => params.data[key]?.login || '';
      }
      return columnDef;
    });
  }

  private formatHeader(key: string): string {
    return key.replace(/_/g, ' ').toUpperCase();
  }

  onSearch(): void {
    this.gridApi.setGridOption(
      'quickFilterText',
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  isExternalFilterPresent(): boolean {
    return this.searchText.trim() !== ''; // Check if filter text exists
  }

  doesExternalFilterPass(node: any): boolean {
    const rowData = node.data;
    return Object.values(rowData).some((value) => {
      const stringValue = value != null ? String(value).toLowerCase() : '';
      return stringValue.includes(this.searchText.toLowerCase());
    });
  }

  removeIntegration() {
    this.gitHubService
      .removeIntegration(this.userInfo.userId)
      .subscribe((res) => {
        if (res) {
          this.redirectToHome();
        }
      });
  }
  redirectToHome() {
    localStorage.removeItem('userInfo');
    this.router.navigate(['']);
  }
}
