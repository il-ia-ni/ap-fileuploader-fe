import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { DcMetadata } from 'src/app/Models/DcMetadata';
import { MetadataService } from 'src/app/Services/metadata.service';
import { SyncConfigProcessorService } from 'src/app/Services/sync-config-processor.service';
import { environment } from 'src/env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sync-preview',
  templateUrl: './sync-preview.component.html',
  styleUrls: ['./sync-preview.component.scss']
})
export class SyncPreviewComponent implements OnInit {

  private syncConfigProcessorSubsription?: Subscription;
  private metadataSubscription?: Subscription;

  public displayedColumns: string[] = [];
  public dataSource!: MatTableDataSource<DcMetadata>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public processedEntitiesTotal: number = 0;
  public dbTable: string = environment.dbTableName;

  constructor(
    private syncConfigProcessorService: SyncConfigProcessorService,
    private metadataService: MetadataService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.syncConfigProcessorService.restoreProcessedData();

    this.syncConfigProcessorSubsription = this.syncConfigProcessorService.processedEntities$.subscribe(data => {

      if (!this.syncConfigProcessorService.processedDataAvailable()) this.router.navigate(['/syncconfig']);

      this.processedEntitiesTotal = data.length;
      this.dataSource = new MatTableDataSource(data);
    });

    this.metadataSubscription = this.metadataService.getTableSchema(environment.dbTableName).subscribe(res => {
      this.displayedColumns = Object.keys(res).filter(key => {
        return !environment.dbTableAutomaticFields.includes(key);
      }

      );

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy() {
    if (this.syncConfigProcessorSubsription) {
      this.syncConfigProcessorSubsription.unsubscribe();
    }

    if (this.metadataSubscription) {
      this.metadataSubscription.unsubscribe();
    }
  }
}
