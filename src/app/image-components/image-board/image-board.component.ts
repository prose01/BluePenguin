import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

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
  loading: boolean = false;
  maxPhotos: number;
  morePhotosAllowed: boolean = false;
  isMatButtonToggled = true;
  matButtonToggleIcon: string = 'add_photo_alternate';
  matButtonToggleText: string = 'Upload new photo';

  currentUserSubject: CurrentUser;
  imageModels: ImageModel[];

  constructor(private profileService: ProfileService, private imageService: ImageService, private configurationLoader: ConfigurationLoader) {
    this.maxPhotos = this.configurationLoader.getConfiguration().maxPhotos;
  }

  ngOnInit(): void {
    this.profileService.currentUserSubject
      .pipe(takeWhileAlive(this))
      .subscribe(
        currentUserSubject => {
          this.currentUserSubject = currentUserSubject;
          this.morePhotosAllowed = this.maxPhotos > currentUserSubject.images.length ? true : false;
        }
    );

    this.getCurrentUserImages();
  }

  getCurrentUserImages(): void {

    let defaultImageModel: ImageModel = new ImageModel();

    if (this.currentUserSubject.images != null) {
      if (this.currentUserSubject.images.length > 0) {

        this.loading = true;

        this.currentUserSubject.images.forEach((element, i) => {
          this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.small)
            .pipe(takeWhileAlive(this))
            .subscribe(
              images => { element.smallimage = 'data:image/jpg;base64,' + images.toString() },
              () => { this.loading = false; element.image = defaultImageModel.image },
              () => { this.loading = false; }
            );
        });

        this.currentUserSubject.images.forEach((element, i) => {
          this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.large)
            .pipe(takeWhileAlive(this))
            .subscribe(
              images => { element.image = 'data:image/jpg;base64,' + images.toString() },
              () => { this.loading = false; element.smallimage = defaultImageModel.smallimage },
              () => { this.loading = false; }
            );
        });
      }
    }
  }

  refreshCurrentUserImages(): void {
    this.profileService.updateCurrentUserSubject().then(() => { this.getCurrentUserImages(); });
  }

  toggleDisplay(): void {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? 'Upload new photo' : 'TileView');
    this.matButtonToggleIcon = (this.isMatButtonToggled ? 'add_photo_alternate' : 'collections');

    if (this.matButtonToggleText == 'Upload new photo') {
      this.refreshCurrentUserImages();
    }
  }
}
