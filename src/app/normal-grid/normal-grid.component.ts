import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-normal-grid',
  templateUrl: './normal-grid.component.html',
  styleUrls: ['./normal-grid.component.scss']
})
export class NormalGridComponent {
    title = 'angular-ag-grid';
  private gridApi: GridApi;
  private gridColumnApi;
  private detailData;

  public columnDefs;
  public defaultColDef;
  public components;
  public rowSelection;
  public rowModelType;
  public paginationPageSize;
  public getRowNodeId;
  public rowData: [];
  public detailCellRendererParams;
  public isFullWidthCell;
  public fullWidthCellRenderer;
  public getRowHeight;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: 'ID',
        maxWidth: 100,
        valueGetter: 'node.id',
        cellRenderer: 'loadingRenderer',
        sortable: false,
        suppressMenu: true,
      },
      {
        headerName: 'Athlete',
        field: 'athlete',
        width: 150,
        suppressMenu: true,
      },
      {
        field: 'age',
        filter: 'agNumberColumnFilter',
        filterParams: {
          filterOptions: ['equals', 'lessThan', 'greaterThan'],
        },
      },
      {
        field: 'country',
        filter: 'agSetColumnFilter',
      },
      {
        field: 'year',
        filter: 'agSetColumnFilter',
        filterParams: {
          values: ['2000', '2004', '2008', '2012'],
        },
      },
      { field: 'date' },
      {
        field: 'sport',
        suppressMenu: true,
      },
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
    };
    this.components = {
      loadingRenderer: function (params) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return "<img src=\"https://www.ag-grid.com/example-assets/loading.gif\">";
        }
      },
    };
    this.rowSelection = 'multiple';
    this.rowModelType = 'clientSide'; 
    this.paginationPageSize = 10;
    this.getRowNodeId = function (item) {
      return item.id;
    };
    

    // Normal Full Width Row Feature without using ag-Grid Enterprise version

    this.isFullWidthCell = function (rowNode) {
      return rowNode.data?.total > 0;
    };

    this.fullWidthCellRenderer = (params) => {
      // pinned rows will have node.rowPinned set to either 'top' or 'bottom' - see docs for row pinning
      var eDiv = document.createElement('div');
      eDiv.innerHTML = this.getFullRowTemplate(params.data);
      eDiv.className = "full-row-container";
      return eDiv;
    };

    this.getRowHeight = (params) => {
      // you can have normal rows and full width rows any height that you want
      var isBodyRow = params.node.rowPinned === undefined;
      var isFullWidth = params.data?.total > 0;
      if (isFullWidth) {
        return 120;
      }
    };
  }

  onFirstDataRendered(params) {
    setTimeout(function () {
      params.api.getDisplayedRowAtIndex(1).setExpanded(true);
    }, 0);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .subscribe((data: any) => {
        data.forEach(function (data, index) {
          data.id = 'R' + (index + 1);
        });
        this.rowData = data.slice(
          params.startRow,
          params.endRow
        );

      });
  }

  private getFullRowTemplate(data): string {
    const parent = `<div class="row"><div class="col-1 custom-cell id-cell">${data?.id}</div><div class="col-2 custom-cell">${data?.athlete}</div>
                        <div class="col-1 custom-cell age-cell">${data?.age}</div><div class="col-2 custom-cell">${data?.country}</div>
                        <div class="col-2 custom-cell">${data?.year}</div><div class="col-2 custom-cell">${data?.date}</div>
                        <div class="col-2 custom-cell">${data?.sport}</div></div>`;
    const childHeader = `<div class="row header-row"><div class="custom-cell">Gold</div>
                         <div class="custom-cell">Silver</div>
                         <div class="custom-cell">Bronze</div><div class="custom-cell">Total</div></div>`
    const childData = `<div class="row child-row">
                       <div class="custom-cell gold">${data?.gold}</div>
                       <div class="custom-cell silver">${data?.silver}</div>
                       <div class="custom-cell bronze">${data?.bronze}</div>
                       <div class="custom-cell">${data?.total}</div>
                       </div>`;
    const template = `${parent}${childHeader}${childData}`;
    return template;
  }

}
