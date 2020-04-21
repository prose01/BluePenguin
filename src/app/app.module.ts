import { BrowserModule }                      from '@angular/platform-browser';
import { NgModule }                           from '@angular/core';
import { FormsModule }                        from '@angular/forms';
import { HttpClientModule }                   from '@angular/common/http';
import { ReactiveFormsModule }                from '@angular/forms';
import { BrowserAnimationsModule }            from '@angular/platform-browser/animations';
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

import { HTTP_INTERCEPTORS }                  from '@angular/common/http';
import { AuthInterceptor }                    from './authorisation/auth/auth.interceptor';
import { AuthService }                        from './authorisation/auth/auth.service';
import { AppRoutingModule }                   from './app-routing.module';

import { NgxGalleryModule }                   from '@kolkov/ngx-gallery';

import { AppComponent }                       from './app.component';
import { CallbackComponent }                  from './authorisation/callback/callback.component';

import { ProfileService }                     from './services/profile.service';
import { CreateProfileComponent }             from './currentUser/create-profile/create-profile.component';
import { EditProfileComponent }               from './currentUser/edit-profile/edit-profile.component';
import { DeleteProfileDialog }                from './currentUser/delete-profile/delete-profile-dialog.component';

import { DashboardComponent }                 from './dashboard/dashboard.component';
import { ProfileListviewComponent }           from './views/profile-listview/profile-listview.component';
import { ProfileTileviewComponent }           from './views/profile-tileview/profile-tileview.component';

import { ProfileDetailComponent }             from './profile-detail/profile-detail.component';
import { ProfileSearchComponent }             from './profile-search/profile-search.component';

import { ImageCropperModule }                 from './image-components/image-cropper/image-cropper.module';
import { ImageBoardComponent }                from './image-components/image-board/image-board.component';
import { ImageUploadComponent }               from './image-components/image-upload/image-upload.component';
import { ImageGalleryComponent }              from './image-components/image-gallery/image-gallery.component';
import { ImageTileviewComponent }             from './image-components/image-tileview/image-tileview.component';
import { DeleteImageDialog }                  from './image-components/delete-image/delete-image-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateProfileComponent,
    ProfileDetailComponent,
    EditProfileComponent,
    CallbackComponent,
    ProfileListviewComponent,
    ProfileTileviewComponent,
    ProfileSearchComponent,
    DeleteProfileDialog,
    ImageBoardComponent,
    ImageUploadComponent,
    ImageGalleryComponent,
    ImageTileviewComponent,
    DeleteImageDialog
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
    ImageCropperModule,
    NgxGalleryModule 
  ],
  providers: [
    ProfileService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteProfileDialog
  ]
})

export class AppModule { }
