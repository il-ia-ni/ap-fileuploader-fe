export class ExcelSyncConfig {
  dbColName: string = "";
  dbColType: string = "";
  excelCol?: Record<string, string>;
  defaultValue?: string | number ;
  isFilledByUser: boolean = false;
}
