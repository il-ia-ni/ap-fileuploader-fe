import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { DcMetadata } from '../Models/DcMetadata';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  private baseUrl: string = environment.backendUrlDev;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  getTableSchema(tableName: string): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${this.baseUrl}/ProMetadata/schema/${tableName}`);
  }

  getMetadata(): Observable<DcMetadata[]> {
    return this.http.get<DcMetadata[]>(`${this.baseUrl}/ProMetadata`);
  }

  // getMetadataById(mdId: number): Observable<DcMetadata> {
  //   return this.http.get<DcMetadata>(`${this.baseUrl}/ProMetadata/${mdId}`);
  // }

  createMetadata(mdEntity: DcMetadata): Observable<any> {
    return this.http.post(`${this.baseUrl}/ProMetadata`, mdEntity, { responseType: 'json' });
  }

  // updateMetadata(mdId: number, mdEntity: DcMetadata): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/ProMetadata/${mdId}`, mdEntity);
  // }

  deleteAllMetadata(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ProMetadata/all`);
  }

  // deleteMetadataById(mdId: number): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/ProMetadata/${mdId}`);
  // }
}
