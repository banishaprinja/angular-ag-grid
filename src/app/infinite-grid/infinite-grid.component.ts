import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-infinite-grid',
  templateUrl: './infinite-grid.component.html',
  styleUrls: ['./infinite-grid.component.scss']
})
export class InfiniteGridComponent {
  title = 'angular-ag-grid';
  private gridApi: GridApi;
  private gridColumnApi;
  private detailData;

  public columnDefs;
  public defaultColDef;
  public components;
  public rowSelection;
  public rowModelType;
  public cacheOverflowSize;
  public maxConcurrentDatasourceRequests;
  public infiniteInitialRowCount;
  public maxBlocksInCache;
  public paginationPageSize;
  public cacheBlockSize;
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
      {
        field: 'gold',
        suppressMenu: true,
      },
      {
        field: 'silver',
        suppressMenu: true,
      },
      {
        field: 'bronze',
        suppressMenu: true,
      },
      {
        field: 'total',
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
    this.rowModelType = 'infinite';
    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.infiniteInitialRowCount = 1;
    this.maxBlocksInCache = 2;
    this.paginationPageSize = 10;
    this.cacheBlockSize = 10;
    this.getRowNodeId = function (item) {
      return item.id;
    };
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
        var dataSource = {
          rowCount: null,
          getRows: (params) => {
            setTimeout(() => {
              var dataAfterSorting = this.sortData(params.sortModel, data);
              var rowsThisPage = dataAfterSorting.slice(
                params.startRow,
                params.endRow
              );
              var lastRow = -1;
              if (dataAfterSorting.length <= params.endRow) {
                lastRow = dataAfterSorting.length;
              }
              params.successCallback(rowsThisPage, lastRow);
            }, 500);
          },
        };
        params.api.setDatasource(dataSource);

      });
  }

  private sortData(sortModel: any, data: any[]): any[] {
    var sortPresent = sortModel && sortModel.length > 0;
    if (!sortPresent) {
      return data;
    }

    var resultOfSort = data.slice();
    resultOfSort.sort(function (a, b) {
      for (var k = 0; k < sortModel.length; k++) {
        var sortColModel = sortModel[k];
        var valueA = a[sortColModel.colId];
        var valueB = b[sortColModel.colId];
        if (valueA == valueB) {
          continue;
        }
        var sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
        if (valueA > valueB) {
          return sortDirection;
        } else {
          return sortDirection * -1;
        }
      }
      return 0;
    });
    return resultOfSort;
  }
}
