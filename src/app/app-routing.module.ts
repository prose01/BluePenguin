import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }     from './dashboard/dashboard.component';
import { ProfilesComponent }      from './profiles/profiles.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'detail/:profileId', component: ProfileDetailComponent },
  { path: 'profiles',     component: ProfilesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}