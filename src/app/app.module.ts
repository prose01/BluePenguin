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
import { AuthInterceptor }                    from './auth/auth.interceptor';
import { AppRoutingModule }                   from './app-routing.module';

import { ImageCropperModule }                 from './image-components/image-cropper/image-cropper.module';
import { NgxGalleryModule }                   from '@kolkov/ngx-gallery';

import { AppComponent }                       from './app.component';
import { DashboardComponent }                 from './dashboard/dashboard.component';
import { ProfileDetailComponent }             from './profile-detail/profile-detail.component';
import { CreateProfileComponent }             from './create-profile/create-profile.component';
import { EditProfileComponent }               from './edit-profile/edit-profile.component';
import { ProfileService }                     from './services/profile.service';

import { AuthService }                        from './auth/auth.service';
import { CallbackComponent }                  from './callback/callback.component';
import { ProfileListviewComponent }           from './profile-listview/profile-listview.component';
import { ProfileTileviewComponent }           from './profile-tileview/profile-tileview.component';
import { ProfileSearchComponent }             from './profile-search/profile-search.component';
import { DeleteProfileDialog }                from './delete-profile/delete-profile-dialog.component';
import { UploadPhoto }                        from './uploadPhoto/uploadPhoto.component';
import { ImageUploadComponent }               from './image-components/image-upload/image-upload.component';
import { ImageGalleryComponent }              from './image-components/image-gallery/image-gallery.component';

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
    UploadPhoto,
    ImageUploadComponent,
    ImageGalleryComponent
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
