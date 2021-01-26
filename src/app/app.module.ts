import { BrowserModule }                      from '@angular/platform-browser';
import { NgModule }                           from '@angular/core';
import { FormsModule }                        from '@angular/forms';
import { HttpClientModule }                   from '@angular/common/http';
import { ReactiveFormsModule }                from '@angular/forms';
import { BrowserAnimationsModule }            from '@angular/platform-browser/animations';
import { DatePipe }                           from '@angular/common';
import { MatCheckboxModule }                  from '@angular/material/checkbox';
import { MatPaginatorModule }                 from '@angular/material/paginator';
import { MatSortModule }                      from '@angular/material/sort';
import { MatTableModule }                     from '@angular/material/table';
import { MatFormFieldModule }                 from '@angular/material/form-field';
import { MatInputModule }                     from '@angular/material/input';
import { MatSelectModule }                    from '@angular/material/select';
import { MatButtonToggleModule }              from '@angular/material/button-toggle';
import { MatDialogModule }                    from '@angular/material/dialog';
import { MatCardModule }                      from '@angular/material/card';
import { MatTabsModule }                      from '@angular/material/tabs';
import { MatButtonModule }                    from '@angular/material/button';
import { MatTooltipModule }                   from '@angular/material/tooltip';
import { MatSliderModule }                    from '@angular/material/slider';
import { MatMenuModule }                      from '@angular/material/menu';
import { MatChipsModule }                     from '@angular/material/chips';

import { HTTP_INTERCEPTORS }                  from '@angular/common/http';
import { AuthInterceptor }                    from './authorisation/auth/auth.interceptor';
import { AuthService }                        from './authorisation/auth/auth.service';
import { AppRoutingModule }                   from './app-routing.module';

import { AppComponent }                       from './app.component';
import { CallbackComponent }                  from './authorisation/callback/callback.component';

import { AppSettingsService }                 from "./services/appsettings.service";
import { ProfileService }                     from './services/profile.service';
import { BehaviorSubjectService }             from './services/behaviorSubjec.service';
import { ImageService }                       from './services/image.service';

import { CreateProfileComponent }             from './currentUser/create-profile/create-profile.component';
import { CurrentUserBoardComponent }          from './currentUser/currentUser-board/currentUser-board.component';
import { EditProfileComponent }               from './currentUser/edit-profile/edit-profile.component';
import { DeleteProfileDialog }                from './currentUser/delete-profile/delete-profile-dialog.component';
import { CurrentUserImagesComponent }         from './currentUser/currentUser-images/currentUser-images.component';

import { DashboardComponent }                 from './dashboard/dashboard.component';
import { ProfileListviewComponent }           from './views/profile-listview/profile-listview.component';
import { ProfileTileviewComponent }           from './views/profile-tileview/profile-tileview.component';

import { ProfileDetailsBoardComponent }       from './profile-details/profile-details-board/profile-details-board.component';
import { ProfileDetailsComponent }            from './profile-details/profile-details/profile-details.component';
import { ProfileImagesComponent }             from './profile-details/profile-images/profile-images.component';
import { ProfileImageDialog }                 from './profile-details/profile-image-dialog/profile-image-dialog.component';

import { ProfileSearchComponent }             from './profile-search/profile-search.component';
import { AboutComponent }                     from './about/about.component';

import { ImageCropperModule }                 from './image-components/image-cropper/image-cropper.module';
import { ImageBoardComponent }                from './image-components/image-board/image-board.component';
import { ImageUploadComponent }               from './image-components/image-upload/image-upload.component';
import { DeleteImageDialog }                  from './image-components/delete-image/delete-image-dialog.component';

import { NgChatModule }                       from 'ng-chat';
import { ChatComponent }                      from './chat/chat.component';
import { ChatMembersListviewComponent }       from './currentUser/chatMembers/chatMembers-listview.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateProfileComponent,
    ProfileDetailsBoardComponent,
    ProfileDetailsComponent,
    ProfileImagesComponent,
    ProfileImageDialog,
    AboutComponent,
    CurrentUserBoardComponent,
    EditProfileComponent,
    CurrentUserImagesComponent,
    CallbackComponent,
    ProfileListviewComponent,
    ProfileTileviewComponent,
    ProfileSearchComponent,
    DeleteProfileDialog,
    ImageBoardComponent,
    ImageUploadComponent,
    DeleteImageDialog,
    ChatComponent,
    ChatMembersListviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSliderModule,
    MatMenuModule,
    MatChipsModule,
    ImageCropperModule,
    NgChatModule
  ],
  providers: [
    AppSettingsService,
    DatePipe,
    ProfileService,
    BehaviorSubjectService,
    ImageService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteProfileDialog
  ]
})

export class AppModule { }
