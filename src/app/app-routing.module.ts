import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthModule, OktaCallbackComponent }  from '@okta/okta-angular';

import { DashboardComponent }     from './dashboard/dashboard.component';
import { ProfileListviewComponent } from './profile-listview/profile-listview.component';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent }   from './edit-profile/edit-profile.component';
import { CallbackComponent } from './callback/callback.component';
import { ImageUploadComponent } from './image-components/image-upload/image-upload.component';
import { ImageGalleryComponent } from './image-components/image-gallery/image-gallery.component';

const routes: Routes = [
  { path: 'implicit/callback', component: OktaCallbackComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profiles', component: ProfileListviewComponent },
  { path: 'profileSearch', component: ProfileSearchComponent },
  { path: 'detail/:profileId', component: ProfileDetailComponent },
  { path: 'create', component: CreateProfileComponent },
  { path: 'edit', component: EditProfileComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'imageupload', component: ImageUploadComponent },
  { path: 'imagegallery/:profileId', component: ImageGalleryComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
