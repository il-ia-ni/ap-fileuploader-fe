/***
 * The names of the props must 100% match the ones of the DbContext Model of EF Core!
 * Standart values are necessary to be able to set new values dynamically using TypeScript!
 * Synchronizing the standart values to the database is eliminated since
 * SyncConfigProcessor service overwrites them to null if the user hasn't specified them explicitly in GUI
 */
export class DcMetadata {
  // ItemId?: number;  // auto value, do not set manually!
  ItemSource?: string = "";
  Host?: string = "";
  ItemContainer?: string = "";
  ItemName?: string = "";
  ItemType?: string = "";
  ItemComment?: string = "";
  Unit?: string = "";
  Scaling?: number = -1;
  UpdateCycle?: number = -1;
  Sensor?: string = "";
  MinVal?: number = -1;
  MaxVal?: number = -1;
  Orientation?: string = "";
  // LastModifiedAt?: Date;  // auto value, do not set manually!
  // RowVersion?: number; // auto value, do not set manually!
}
