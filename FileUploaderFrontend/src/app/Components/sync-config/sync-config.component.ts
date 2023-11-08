import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExcelSyncConfig } from 'src/app/Models/ExcelSyncConfig';
import { ExcelUploaderService } from 'src/app/Services/exceluploader.service';
import { MetadataService } from 'src/app/Services/metadata.service';
import { SyncConfigProcessorService } from 'src/app/Services/sync-config-processor.service';
import { environment } from 'src/env/environment';

@Component({
  selector: 'app-sync-config',
  templateUrl: './sync-config.component.html',
  styleUrls: ['./sync-config.component.scss']
})
export class SyncConfigComponent {

  private excelServiceSubscription?: Subscription;
  private metadataSubscription: Subscription | undefined;

  public excelValuesTotal: number = 0;
  public dbTable: string = environment.dbTableName;

  public dbColNames: Array<string> = [];
  public dbColTypes: Array<string> = [];
  public excelColumns?: Record<string, string>;

  private syncConfig: Array<ExcelSyncConfig> = [];
  // private excelSyncConfigsSubject = new BehaviorSubject<ExcelSyncConfig[]>(this.syncConfig);
  // public excelSyncConfigs$: Observable<ExcelSyncConfig[]> = this.excelSyncConfigsSubject.asObservable();

  public displayedColumns: string[] = ['dbCol', 'dbType', 'excelCol', 'defaultValue'];
  public dataSource?: MatTableDataSource<ExcelSyncConfig>;
  ;

  constructor(
    private mdService: MetadataService,
    private excelService: ExcelUploaderService,
    private syncConfigService: SyncConfigProcessorService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.excelService.restoreExcelData();

    this.metadataSubscription = this.mdService.getTableSchema(this.dbTable).subscribe(res => {
      this.dbColNames = Object.keys(res).filter(key => {
        const isToInclude = !environment.dbTableAutomaticFields.includes(key);  // Gets all db table cols except automatic ones
        if (isToInclude) {
          const colType = res[key];
          this.dbColTypes.push(colType);
        } return isToInclude;
      });

      let idx = 0;
      while (idx < this.dbColNames.length) {
        let colSyncConfig = new ExcelSyncConfig();
        colSyncConfig.dbColName = this.dbColNames[idx];
        colSyncConfig.dbColType = this.parseColType(this.dbColTypes[idx]);
        this.syncConfig.push(colSyncConfig);
        idx++;
      }

      this.dataSource = new MatTableDataSource(this.syncConfig);
    })

    this.excelServiceSubscription = this.excelService.response$.subscribe(response => {
      if (response.sheetData != undefined) {
        this.excelColumns = response.sheetData[0] as Record<string, string>;
        this.excelValuesTotal = response.sheetData.length - 1;  // ttl of lines except col names
      }
      else if (response.errorMessage != undefined) {
        this._snackBar.open("The server responded with an error: " + response.errorMessage, "Ok", { duration: 5000 });
      }
      else {
        this._snackBar.open("Couldn't retrieve a response from the server", "Ok", { duration: 5000 });
        this.router.navigate(['/start']);
      }
    });

    this.syncConfigService.setSyncConfigs(this.syncConfig);
  }

  ngOnDestroy() {
    if (this.excelServiceSubscription) {
      this.excelServiceSubscription.unsubscribe();
    }

    if (this.metadataSubscription) {
      this.metadataSubscription.unsubscribe();
    }
  }

  getCurrentExcelCols(): string[] {
    return this.excelColumns ? Object.keys(this.excelColumns!) : [];
  }

  public excelColumnsKeysSorted(): string[] {
    if (!this.excelColumns) {
      return [];
    }
    return Object.keys(this.excelColumns)
      .sort((a, b) => this.excelColumns![a].localeCompare(this.excelColumns![b]));
  }

  createRecord(key: string, val: string): Record<string, string> {
    const record: Record<string, string> = {};
    record[key] = val;
    return record;
  }

  validateDefaultValue(element: any) {
    const dbType = element.dbColType;
    const defaultValue = element.defaultValue;

    if (dbType === "string") {
      if (typeof defaultValue !== "string") {  // TODO: define the check for prohibited chars
        console.log("Wrong input! Only text data allowed");
        // TODO: display error label
        element.defaultValue = "";
      }
    }
    else if (dbType === "number") {
      if (isNaN(defaultValue)) {
        console.log("Wrong input! Only numbers data allowed");
        // TODO: display error label
        element.defaultValue = null;
      }
    }
    else if (dbType === "Boolean") {
      if (defaultValue != "true" && defaultValue != "false") {
        console.log("Wrong input! Only true or false allowed");
        // TODO: display error label
        element.defaultValue = null;
      }
    }

    // TODO: Define validation for Date
  }

  private parseColType(typeFetched: string): string {
    const stringPattern = /^string$/i;  // i deactivated Case Sensitivity
    const boolPattern = /^bool.*/i;  // .* == however many incl. none
    const datePattern = /^date.*/i;  // Date, DateTime, date etc.
    if (stringPattern.test(typeFetched)) return "string";
    else {
      if (boolPattern.test(typeFetched)) return "Boolean";
      if (datePattern.test(typeFetched)) return "Date";
      else return "number";
    }
  }
}

