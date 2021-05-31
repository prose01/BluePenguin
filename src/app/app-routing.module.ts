import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallbackComponent }    from './authorisation/callback/callback.component';
import { DashboardComponent }   from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },    // Todo: a lot of these can be removed.
  { path: 'callback', component: CallbackComponent },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
