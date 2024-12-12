import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.config';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GithubService } from '../../services/github.service';
import { ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
@Component({
  selector: 'app-github-data',
  imports: [...MATERIAL_IMPORTS,CommonModule,AgGridModule],
  templateUrl: './github-data.component.html',
  styleUrl: './github-data.component.scss'
})
export class GithubDataComponent {
  isBrowser: boolean;
  selectedIntegration = 'github';
  selectedEntity: keyof MockDataType | undefined;
  searchText = '';
  gridApi: any

  entities: (keyof MockDataType)[] = [
    'organizations',
    'repos',
    'commits',
    'pulls',
    'issues',
  ]; // Entities

  rowData: any[] = []; // Data for ag-Grid
  columnDefs: any[] = []; // Column definitions for ag-Grid

  defaultColDef = {
    filter: true,
    sortable: true,
    resizable: true,
  };

  // Mock data
  mockData: MockDataType = {
    organizations: [
      { id: 1, name: 'Org1', description: 'Description for Org1' },
      { id: 2, name: 'Org2', description: 'Description for Org2' },
    ],
    repos: [
      { id: 1, name: 'Repo1', language: 'JavaScript', stars: 150 },
      { id: 2, name: 'Repo2', language: 'TypeScript', stars: 200 },
    ],
    commits: [
      { id: 'abc123', author: 'Author1', message: 'Initial commit' },
      { id: 'def456', author: 'Author2', message: 'Bug fix' },
    ],
    pulls: [
      { id: 'pr1', title: 'Add feature', status: 'Open' },
      { id: 'pr2', title: 'Fix bug', status: 'Closed' },
    ],
    issues: [
      { id: 'issue1', title: 'Bug in feature X', status: 'Open' },
      { id: 'issue2', title: 'UI issue', status: 'In Progress' },
    ],
  };
  isAgGridLoaded: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isAgGridLoaded = false;
  }

  ngOnInit() {
    this.selectedEntity = this.entities[0];  // Set default selectedEntity if it's undefined
    this.loadAgGrid();
    this.fetchEntityData();  // Ensure feth

  }

  onGridReady(event: any) {
    this.gridApi = event.api;
  }

  async loadAgGrid() {
    debugger
    if (typeof window !== 'undefined') {
      this.isAgGridLoaded = true;
    }
  }

  async fetchEntityData(value = "") {
    debugger
    if (this.selectedEntity && this.mockData[this.selectedEntity]) {
      this.updateGrid(this.mockData[this.selectedEntity]);
    }
  }


  // Dynamically update the grid
  updateGrid(data: any[]) {
    if (data.length) {
      this.columnDefs = Object.keys(data[0]).map((key) => ({
        field: key,
        filter: true,
      }));
      debugger
      this.rowData = data;
      this.isAgGridLoaded = true
    }
  }

  onSearch() {
    debugger
    if (this.gridApi) {
      this.gridApi.setQuickFilter(this.searchText);
    }
  }
}

type MockDataType = {
  organizations: { id: number; name: string; description: string }[];
  repos: { id: number; name: string; language: string; stars: number }[];
  commits: { id: string; author: string; message: string }[];
  pulls: { id: string; title: string; status: string }[];
  issues: { id: string; title: string; status: string }[];
};
