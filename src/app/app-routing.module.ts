import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallbackComponent } from './authorisation/callback/callback.component';
import { CreateProfileComponent } from './currentUser/create-profile/create-profile.component';
//import { EditProfileComponent } from './currentUser/edit-profile/edit-profile.component';
import { DashboardComponent }     from './dashboard/dashboard.component';
//import { ProfileListviewComponent } from './views/profile-listview/profile-listview.component';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { AboutComponent } from './about/about.component';
import { ImageBoardComponent } from './image-components/image-board/image-board.component';
import { ImageUploadComponent } from './image-components/image-upload/image-upload.component';
import { ImageGalleryComponent } from './image-components/image-gallery/image-gallery.component';
import { ChatMembersListviewComponent } from './currentUser/chatMembers/chatMembers-listview.component';
import { CurrentUserBoardComponent } from './currentUser/currentUser-board/currentUser-board.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'callback', component: CallbackComponent },
  { path: 'create', component: CreateProfileComponent },
  { path: 'edit', component: CurrentUserBoardComponent },
  { path: 'dashboard', component: DashboardComponent },
  //{ path: 'profiles', component: ProfileListviewComponent },
  { path: 'profileSearch', component: ProfileSearchComponent },
  { path: 'about', component: AboutComponent },
  { path: 'detail/:profileId', component: ProfileDetailComponent },
  { path: 'imagesboard', component: ImageBoardComponent },
  { path: 'imageupload', component: ImageUploadComponent },
  { path: 'imagegallery/:profileId', component: ImageGalleryComponent },
  { path: 'chatMembers', component: ChatMembersListviewComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
