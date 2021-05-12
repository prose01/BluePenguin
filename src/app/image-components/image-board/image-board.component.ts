import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { CurrentUser } from '../../models/currentUser';
import { ImageModel } from '../../models/imageModel';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';

@Component({
  selector: 'image-board',
  templateUrl: './image-board.component.html',
  styleUrls: ['./image-board.component.scss']
})

@AutoUnsubscribe()
export class ImageBoardComponent implements OnInit {
  private maxPhotos: number;
  private morePhotosAllowed: boolean = false;
  isMatButtonToggled = true;
  matButtonToggleIcon: string = 'add_photo_alternate';
  matButtonToggleText: string = 'Upload new photo';

  currentUserSubject: CurrentUser;
  imageModels: ImageModel[];

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private configurationLoader: ConfigurationLoader) {
    this.maxPhotos = this.configurationLoader.getConfiguration().maxPhotos;
  }


  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.currentUserSubject
        .pipe(takeWhileAlive(this))
        .subscribe(currentUserSubject => {
          this.currentUserSubject = currentUserSubject;
          this.imageModels = currentUserSubject.images;
          this.morePhotosAllowed = this.maxPhotos > currentUserSubject.images.length ? true : false;
        });

      this.getCurrentUserSmallImages().then(() => { this.getCurrentUserImages(); });
      
    }
  }

  getCurrentUserImages(): void {
    if (this.imageModels != null) {
      if (this.imageModels.length > 0) {
        this.imageModels.forEach((element, i) => {
          this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.large)
            .pipe(takeWhileAlive(this))
            .subscribe(images => element.image = 'data:image/jpg;base64,' + images.toString());
        });
      }
    }
  }

  getCurrentUserSmallImages(): Promise<void> {
    if (this.imageModels != null) {
      if (this.imageModels.length > 0) {
        this.imageModels.forEach((element, i) => {
          this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.small)
            .pipe(takeWhileAlive(this))
            .subscribe(images => element.smallimage = 'data:image/jpg;base64,' + images.toString());
        });
      }
    }
    return Promise.resolve();
  }

  toggleDisplay() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? 'Upload new photo' : 'TileView');
    this.matButtonToggleIcon = (this.isMatButtonToggled ? 'add_photo_alternate' : 'collections');
  }
}
