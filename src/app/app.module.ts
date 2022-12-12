import { BrowserModule }                      from '@angular/platform-browser';
import { NgModule }                           from '@angular/core';
import { FormsModule }                        from '@angular/forms';
import { HttpClientModule }                   from '@angular/common/http';
import { ReactiveFormsModule }                from '@angular/forms';
import { BrowserAnimationsModule }            from '@angular/platform-browser/animations';
import { MatLegacyCheckboxModule as MatCheckboxModule }                  from '@angular/material/legacy-checkbox';
import { MatLegacyPaginatorModule as MatPaginatorModule }                 from '@angular/material/legacy-paginator';
import { MatSortModule }                      from '@angular/material/sort';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule }           from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule }                     from '@angular/material/legacy-table';
import { MatLegacyFormFieldModule as MatFormFieldModule }                 from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule }                     from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule }                    from '@angular/material/legacy-select';
import { MatButtonToggleModule }              from '@angular/material/button-toggle';
import { MatLegacyDialogModule as MatDialogModule }                    from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule }                  from '@angular/material/legacy-snack-bar';
import { MatLegacyCardModule as MatCardModule }                      from '@angular/material/legacy-card';
import { MatLegacyTabsModule as MatTabsModule }                      from '@angular/material/legacy-tabs';
import { MatLegacyButtonModule as MatButtonModule }                    from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule }                   from '@angular/material/legacy-tooltip';
import { MatLegacySliderModule as MatSliderModule }                    from '@angular/material/legacy-slider';
import { MatLegacyMenuModule as MatMenuModule }                      from '@angular/material/legacy-menu';
import { MatSidenavModule }                   from '@angular/material/sidenav';
import { MatLegacyChipsModule as MatChipsModule }                     from '@angular/material/legacy-chips';
import { MatLegacySlideToggleModule as MatSlideToggleModule }               from '@angular/material/legacy-slide-toggle';
import { MatDatepickerModule }                from '@angular/material/datepicker';
import { MatNativeDateModule }                from '@angular/material/core';
import { MatMomentDateModule }                from '@angular/material-moment-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS }    from '@angular/material-moment-adapter';

import { HTTP_INTERCEPTORS }                  from '@angular/common/http';
import { HttpErrorInterceptor }               from './ErrorHandling/http-error.interceptor';
import { AuthInterceptor }                    from './authorisation/auth/auth.interceptor';
import { AuthService }                        from './authorisation/auth/auth.service';
import { AppRoutingModule }                   from './app-routing.module';

import { AppComponent }                       from './app.component';
import { CallbackComponent }                  from './authorisation/callback/callback.component';
import { ErrorDialog }                        from './error-dialog/error-dialog.component';
import { SnackbarComponent }                  from './snackbar/snackbar.component';

import { ConfigurationModule }                from "./configuration/configuration.module";
import { ProfileService }                     from './services/profile.service';
import { BehaviorSubjectService }             from './services/behaviorSubjec.service';
import { EnumMappingService }                 from './services/enumMapping.service';
import { ImageService }                       from './services/image.service';
import { FeedBackService }                    from './services/feedback.service';
import { ChatService }                        from './services/chat.service';
import { SnackBarService }                    from './services/snack-bar.service';

import { CreateProfileComponent }             from './currentUser/create-profile/create-profile.component';
import { CreateProfileDialog }                from './currentUser/create-profile-dialog/create-profile-dialog.component';
import { CurrentUserBoardComponent }          from './currentUser/currentUser-board/currentUser-board.component';
import { EditProfileComponent }               from './currentUser/edit-profile/edit-profile.component';
import { DeleteProfileDialog }                from './currentUser/delete-profile/delete-profile-dialog.component';
import { CurrentUserImagesComponent }         from './currentUser/currentUser-images/currentUser-images.component';

import { DashboardComponent }                 from './dashboard/dashboard.component';
import { ProfileListviewComponent }           from './views/profile-listview/profile-listview.component';
import { ProfileTileviewComponent }           from './views/profile-tileview/profile-tileview.component';
import { AdTileComponent }                    from './ad-tile/ad-tile.component';
import { AdRowComponent }                     from './ad-row/ad-row.component';

import { ProfileDetailsBoardComponent }       from './profile-details/profile-details-board/profile-details-board.component';
import { ProfileDetailsComponent }            from './profile-details/profile-details/profile-details.component';
import { ProfileImagesComponent }             from './profile-details/profile-images/profile-images.component';
import { ProfileChatListviewComponent }       from './profile-details/profile-chats/profile-chat-listview.component';
import { ProfileChatSearchComponent }         from './profile-details/profile-chat-search/profile-chat-search.component';
import { MessageDialog }                      from './profile-details/profile-chat-message-dialog/profile-chat-message-dialog';

import { ProfileSearchComponent }             from './profile-search/profile-search.component';
import { AboutComponent }                     from './about/about.component';
import { AdminComponent }                    from './admin/admin.component';
import { FeedbackComponent }                  from './feedback/feedback.component';
import { FeedbackAdminComponent }             from './feedback/feedbackAdmin/feedback.admin.component';
import { FeedbackSearchComponent }            from './feedback/feedback-search/feedback-search.component';
import { FeedbackDialog }                     from './feedback/feedback-dialog/feedback-dialog.component';

import { LazyLoadImageModule }                from 'ng-lazyload-image';
import { InfiniteScrollModule }               from 'ngx-infinite-scroll';
import { ImageCropperModule }                 from './image-components/image-cropper/image-cropper.module';
import { ImageBoardComponent }                from './image-components/image-board/image-board.component';
import { ImageUploadComponent }               from './image-components/image-upload/image-upload.component';
import { DeleteImageDialog }                  from './image-components/delete-image/delete-image-dialog.component';
import { ImageDialog }                        from './image-components/image-dialog/image-dialog.component';

import { ChatWrapperComponent }               from './chat/chat-wrapper/chatWrapper.component';
import { Chat }                               from './chat/chat.component';
import { EmojifyPipe }                        from './chat/pipes/emojify.pipe';
import { LinkfyPipe }                         from './chat/pipes/linkfy.pipe';
import { SanitizePipe }                       from './chat/pipes/sanitize.pipe';
import { GroupMessageDisplayNamePipe }        from './chat/pipes/group-message-display-name.pipe';
import { ChatOptionsComponent }               from './chat/chat-options/chat-options.component';
import { ChatFriendsListComponent }           from './chat/chat-friends-list/chat-friends-list.component';
import { ChatWindowComponent }                from './chat/chat-window/chat-window.component';
import { ChatMembersListviewComponent }       from './currentUser/chatMembers/chatMembers-listview.component';

import { TranslocoRootModule }                from './transloco/transloco-root.module';
import { TranslocoLocaleModule }              from '@ngneat/transloco-locale';

import { NgxSliderModule }                    from '@angular-slider/ngx-slider';


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
    Chat,
    EmojifyPipe,
    LinkfyPipe,
    SanitizePipe,
    GroupMessageDisplayNamePipe,
    ChatOptionsComponent,
    ChatFriendsListComponent,
    ChatWindowComponent
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
    MatCardModule,
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
    LazyLoadImageModule,
    InfiniteScrollModule,
    ImageCropperModule,
    NgxSliderModule,
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
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteProfileDialog,
    SnackbarComponent
  ]
})

export class AppModule { }
