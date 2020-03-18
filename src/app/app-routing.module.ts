import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }     from './dashboard/dashboard.component';
import { ProfileListviewComponent } from './profile-listview/profile-listview.component';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent }   from './edit-profile/edit-profile.component';
import { CallbackComponent } from './callback/callback.component';
//import { UploadPhoto } from './uploadPhoto/uploadPhoto.component';
import { ImageUtilComponent } from './image-util/image-util.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profiles', component: ProfileListviewComponent },
  { path: 'profileSearch', component: ProfileSearchComponent },
  { path: 'detail/:profileId', component: ProfileDetailComponent },
  { path: 'create', component: CreateProfileComponent },
  { path: 'edit', component: EditProfileComponent },
  { path: 'callback', component: CallbackComponent },
  //{ path: 'uploadPhoto', component: UploadPhoto },
  { path: 'imageUtil', component: ImageUtilComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
