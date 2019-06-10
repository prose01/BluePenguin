import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }     from './dashboard/dashboard.component';
import { ProfilesComponent }      from './profiles/profiles.component';
import { ProfileListviewComponent }      from './profile-listview/profile-listview.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent }   from './edit-profile/edit-profile.component';
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'detail/:profileId', component: ProfileDetailComponent },
  { path: 'create', component: CreateProfileComponent },
  { path: 'edit/:profileId', component: EditProfileComponent },
  // { path: 'profiles',     component: ProfilesComponent },
  { path: 'profiles',     component: ProfileListviewComponent },
  { path: 'callback', component: CallbackComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}