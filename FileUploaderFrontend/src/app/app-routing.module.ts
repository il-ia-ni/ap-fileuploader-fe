import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { StartComponent } from './components/start/start.component';
import { SyncConfigComponent } from './Components/sync-config/sync-config.component';
import { SyncPreviewComponent } from './Components/sync-preview/sync-preview.component';
import { SyncCompleteComponent } from './Components/sync-complete/sync-complete.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'start',
    component: StartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'syncconfig',
    component: SyncConfigComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'syncpreview',
    component: SyncPreviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'synccomplete',
    component: SyncCompleteComponent,
    canActivate: [AuthGuard]
  },
  // For nesting routes within a components root see https://angular.io/guide/router#nesting-routes
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: StartComponent,  // TODO: Develop a 404-component https://angular.io/guide/router#displaying-a-404-page
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
