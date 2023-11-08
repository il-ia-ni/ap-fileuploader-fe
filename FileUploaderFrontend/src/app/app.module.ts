import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { StartComponent } from './components/start/start.component';
import { TokenInterceptorService } from './Interceptors/http.jwt.interceptor';
import { SyncConfigComponent } from './Components/sync-config/sync-config.component';
import { SyncPreviewComponent } from './Components/sync-preview/sync-preview.component';
import { SyncCompleteComponent } from './Components/sync-complete/sync-complete.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    StartComponent,
    SyncConfigComponent,
    SyncPreviewComponent,
    SyncCompleteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),  // See https://napster2210.github.io/ngx-spinner/
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
      announcementMessage: "Empty notification",
      horizontalPosition: "center",
      verticalPosition: "top",
    }}, // See https://material.angular.io/components/snack-bar/api#MatSnackBarConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
