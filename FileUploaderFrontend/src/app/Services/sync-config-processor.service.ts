import { Injectable } from '@angular/core';
import { ExcelUploaderService } from './exceluploader.service';
import { MetadataService } from './metadata.service';
import { ExcelSyncConfig } from '../Models/ExcelSyncConfig';
import { DcMetadata } from '../Models/DcMetadata';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SyncConfigProcessorService {

  private static readonly processedDataKey = 'processedData'; // Key for localStorage

  private excelServiceSubscription?: Subscription;

  public sheetData: Array<Object> = [];
  private syncConfigs: Array<ExcelSyncConfig> = [];

  private processedEntitiesSubject = new BehaviorSubject<Array<DcMetadata>>([]);
  processedEntities$: Observable<Array<DcMetadata>> = this.processedEntitiesSubject.asObservable();

  constructor(
    private excelService: ExcelUploaderService,
    private metadataService: MetadataService,
    private _snackBar: MatSnackBar
  ) {
    this.excelServiceSubscription = this.excelService.response$.subscribe(response => {

      this.restoreProcessedData();  // try to restore the processedEntitiesSubject value from LocalStorage

      if (response.sheetData != undefined) {
        // Extract Excel data (skip the first object as it contains column names)
        this.sheetData = response.sheetData.slice(1);
      }
    });
  }

  public processExcelRows(): void {
    // null check not necessary since this.sheetData = []
    const processedRows = this.sheetData
      .filter(row => !this.isObjectEmpty(row))
      .map(row => this.createDbInstance<DcMetadata>(row, this.syncConfigs, DcMetadata));
    this.processedEntitiesSubject.next(processedRows);
    this.saveProcessedData(this.processedEntitiesSubject.value);  // save processed entities to LS
  }


  public async synchronizeExcelData(): Promise<number | Error> {

    this.restoreProcessedData();  // try to restore the processedEntitiesSubject value from LocalStorage
    var caughtError = new Error("No data found to synchronize to the database!");

    if (this.processedEntitiesSubject.value.length > 0) {
      let entitiesWrittenCount = 0;

      // DROP ALL DATA FROM DB TABLE
      try {
        let tableDro$ = this.metadataService.deleteAllMetadata().subscribe(
          response => {
            // TODO: Display drop success to the user?
            console.log(response);
          },
          error => {
            caughtError = error as Error;
            return caughtError;
          });
      }
      catch (error) {
        caughtError = error as Error;
        return caughtError;
      }

      // START WRITING ENTITIES TO DB
      for (const md of this.processedEntitiesSubject.value) {
        try {
          await this.metadataService.createMetadata(md).toPromise();
          entitiesWrittenCount++;
        }
        catch (error: any) {
          caughtError = error as Error;
          break;
        }
      }
      return entitiesWrittenCount;  // IF SUCCESS
    }
    return caughtError;  // OTHERWISE
  }

  public setSyncConfigs(configs: Array<ExcelSyncConfig>) {
    this.syncConfigs = configs;
  }

  public getSyncConfigs(): ExcelSyncConfig[] {
    this.syncConfigs.forEach(conf => (conf.excelCol || conf.defaultValue) && (conf.isFilledByUser = true));
    return this.syncConfigs;
  }

  public processedDataAvailable(): boolean {
    return this.processedEntitiesSubject.value !== undefined;
  }

  private isObjectEmpty(obj: any): boolean {
    const keys = Object.keys(obj);
    return keys.every(key => obj[key] == undefined);
  }

  private createDbInstance<T>(excelObj: any, syncConfig: Array<ExcelSyncConfig>, type: { new(): T }): T {
    const mdInstance = new type();  // See https://stackoverflow.com/a/45011850
    const props = Object.keys(mdInstance as Object);

    for (const prop of props) {
      if (prop in (mdInstance as Object)) {
        (mdInstance as any)[prop] = this.getSheetCellValue(prop, syncConfig, excelObj);
      }
    }

    return mdInstance;
  }

  private getSheetCellValue(propName: string, syncConfig: Array<ExcelSyncConfig>, excelObj: any): string | number | undefined {
    const matchingConfig = syncConfig.find(conf => conf.dbColName === propName && (conf.excelCol || conf.defaultValue));

    if (matchingConfig) {
      if (matchingConfig.excelCol!) {
        const excelCellValue = excelObj[Object.keys(matchingConfig.excelCol!)?.[0]];
        if (excelCellValue) return excelCellValue; // excel row's value with matching key if column set and value not null
      }
      if (matchingConfig.defaultValue!) return matchingConfig.defaultValue;  // if no excel col set returns default val
    }
    return undefined;  // sets prop value to null if not configured by user
  }

  // Local storage mgmt area

  public saveProcessedData(data: Array<DcMetadata>): void {
    localStorage.setItem(SyncConfigProcessorService.processedDataKey, JSON.stringify(data));
  }

  public restoreProcessedData(): void {
    const storedData = localStorage.getItem(SyncConfigProcessorService.processedDataKey);
    if (storedData) {
      const parsedData = JSON.parse(storedData) as Array<DcMetadata>;
      this.processedEntitiesSubject.next(parsedData);
    }
  }

  public clearProcessedData(): void {
    localStorage.removeItem(SyncConfigProcessorService.processedDataKey);
    this.processedEntitiesSubject.next([]); // Clear data in BehaviorSubject
  }

}
