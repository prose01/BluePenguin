import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgOptimizedImage } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './ErrorHandling/http-error.interceptor';
import { AuthInterceptor } from './authorisation/auth/auth.interceptor';
import { AuthService } from './authorisation/auth/auth.service';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CallbackComponent } from './authorisation/callback/callback.component';
import { ErrorDialog } from './error-dialog/error-dialog.component';
import { SnackbarComponent } from './snackbar/snackbar.component';

import { ConfigurationModule } from "./configuration/configuration.module";
import { ProfileService } from './services/profile.service';
import { BehaviorSubjectService } from './services/behaviorSubjec.service';
import { EnumMappingService } from './services/enumMapping.service';
import { ImageService } from './services/image.service';
import { FeedBackService } from './services/feedback.service';
import { ChatService } from './services/chat.service';
import { SnackBarService } from './services/snack-bar.service';

import { CreateProfileComponent } from './currentUser/create-profile/create-profile.component';
import { CreateProfileDialog } from './currentUser/create-profile-dialog/create-profile-dialog.component';
import { CurrentUserBoardComponent } from './currentUser/currentUser-board/currentUser-board.component';
import { EditProfileComponent } from './currentUser/edit-profile/edit-profile.component';
import { DeleteProfileDialog } from './currentUser/delete-profile/delete-profile-dialog.component';
import { CurrentUserImagesComponent } from './currentUser/currentUser-images/currentUser-images.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileListviewComponent } from './views/profile-listview/profile-listview.component';
import { ProfileTileviewComponent } from './views/profile-tileview/profile-tileview.component';
import { AdTileComponent } from './ad-tile/ad-tile.component';
import { AdRowComponent } from './ad-row/ad-row.component';

import { ProfileDetailsBoardComponent } from './profile-details/profile-details-board/profile-details-board.component';
import { ProfileDetailsComponent } from './profile-details/profile-details/profile-details.component';
import { ProfileImagesComponent } from './profile-details/profile-images/profile-images.component';
import { ProfileChatListviewComponent } from './profile-details/profile-chats/profile-chat-listview.component';
import { ProfileChatSearchComponent } from './profile-details/profile-chat-search/profile-chat-search.component';
import { MessageDialog } from './profile-details/profile-chat-message-dialog/profile-chat-message-dialog';

import { GroupsListviewComponent } from './groups/groups-listview/groups-listview.component';
import { GroupMembershipListviewComponent } from './currentUser/groupMembership/groupMembership-listview.component';
import { GroupMembersDialog } from './groups/groupMembers-dialog/groupMembers-dialog.component';

import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackAdminComponent } from './feedback/feedbackAdmin/feedback.admin.component';
import { FeedbackSearchComponent } from './feedback/feedback-search/feedback-search.component';
import { FeedbackDialog } from './feedback/feedback-dialog/feedback-dialog.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ImageCropperModule } from './image-components/image-cropper/image-cropper.module';
import { ImageBoardComponent } from './image-components/image-board/image-board.component';
import { ImageUploadComponent } from './image-components/image-upload/image-upload.component';
import { DeleteImageDialog } from './image-components/delete-image/delete-image-dialog.component';
import { ImageDialog } from './image-components/image-dialog/image-dialog.component';

import { ChatWrapperComponent } from './chat/chat-wrapper/chatWrapper.component';
import { Chat } from './chat/chat.component';
import { EmojifyPipe } from './chat/pipes/emojify.pipe';
import { LinkfyPipe } from './chat/pipes/linkfy.pipe';
import { SanitizePipe } from './chat/pipes/sanitize.pipe';
import { GroupMessageDisplayNamePipe } from './chat/pipes/group-message-display-name.pipe';
import { ChatOptionsComponent } from './chat/chat-options/chat-options.component';
import { ChatFriendsListComponent } from './chat/chat-friends-list/chat-friends-list.component';
import { ChatWindowComponent } from './chat/chat-window/chat-window.component';
import { ChatMembersListviewComponent } from './currentUser/chatMembers/chatMembers-listview.component';
import { CreateGroupDialog } from './groups/create-group-dialog/create-group-dialog';

import { TranslocoRootModule } from './transloco/transloco-root.module';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { AvatarPhotoComponent } from './avatar-photo/avatar-photo.component';
import { ColourPaletteComponent } from './colour-picker/colour-palette/colour-palette.component';
import { ColourSliderComponent } from './colour-picker/colour-slider/colour-slider.component';
import { ColourPickerComponent } from './colour-picker/colour-picker.component';
import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  declarations: [
    AppComponent,
    ErrorDialog,
    SnackbarComponent,
    DashboardComponent,
    CreateProfileComponent,
    CreateProfileDialog,
    ProfileDetailsBoardComponent,
    ProfileDetailsComponent,
    ProfileImagesComponent,
    ProfileChatListviewComponent,
    ProfileChatSearchComponent,
    MessageDialog,
    AboutComponent,
    AdminComponent,
    FeedbackComponent,
    FeedbackAdminComponent,
    FeedbackSearchComponent,
    FeedbackDialog,
    CurrentUserBoardComponent,
    EditProfileComponent,
    CurrentUserImagesComponent,
    CallbackComponent,
    ProfileListviewComponent,
    GroupMembersDialog,
    ProfileTileviewComponent,
    AdTileComponent,
    AdRowComponent,
    ProfileSearchComponent,
    DeleteProfileDialog,
    ImageBoardComponent,
    ImageUploadComponent,
    ImageDialog,
    DeleteImageDialog,
    ChatWrapperComponent,
    ChatMembersListviewComponent,
    CreateGroupDialog,
    GroupMembershipListviewComponent,
    Chat,
    EmojifyPipe,
    LinkfyPipe,
    SanitizePipe,
    GroupsListviewComponent,
    GroupMessageDisplayNamePipe,
    ChatOptionsComponent,
    ChatFriendsListComponent,
    ChatWindowComponent,
    AvatarPhotoComponent,
    ColourPaletteComponent,
    ColourSliderComponent,
    ColourPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ConfigurationModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSliderModule,
    MatMenuModule,
    MatSidenavModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ScrollingModule,
    InfiniteScrollModule,
    NgOptimizedImage,
    ImageCropperModule,
   /* NgxSliderModule,*/
    TranslocoRootModule,
    TranslocoLocaleModule.forRoot({
      langToLocaleMapping: {
        da: 'da-DK',
        de: 'de-DE',
        en: 'en-GB',
        es: 'es-ES',
        fr: 'fr-FR',
        ko: 'ko-KR'
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    AuthService,
    ProfileService,
    BehaviorSubjectService,
    ImageService,
    ChatService,
    FeedBackService,
    EnumMappingService,
    SnackBarService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
