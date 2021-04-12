import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallbackComponent } from './authorisation/callback/callback.component';
import { CreateProfileComponent } from './currentUser/create-profile/create-profile.component';
import { DashboardComponent }     from './dashboard/dashboard.component';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { ProfileDetailsBoardComponent } from './profile-details/profile-details-board/profile-details-board.component';
import { ImageBoardComponent } from './image-components/image-board/image-board.component';
import { AboutComponent } from './about/about.component';
import { CurrentUserBoardComponent } from './currentUser/currentUser-board/currentUser-board.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },    // Todo: a lot of these can be removed.
  { path: 'callback', component: CallbackComponent },
  //{ path: 'create', component: CreateProfileComponent },
  //{ path: 'edit', component: CurrentUserBoardComponent },
  { path: 'dashboard', component: DashboardComponent }
  //{ path: 'search', component: ProfileSearchComponent },
  //{ path: 'about', component: AboutComponent },
  //{ path: 'details/:profileId', component: ProfileDetailsBoardComponent },
  //{ path: 'imagesboard', component: ImageBoardComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
