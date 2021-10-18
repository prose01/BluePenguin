import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { TranslocoService } from '@ngneat/transloco';

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
  matButtonToggleText: string;

  currentUserSubject: CurrentUser;
  imageModels: ImageModel[];

  constructor(private profileService: ProfileService, private imageService: ImageService, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.maxPhotos = this.configurationLoader.getConfiguration().maxPhotos;
  }

  ngOnInit(): void {
    this.profileService.currentUserSubject
      .subscribe(
        currentUserSubject => {
          this.currentUserSubject = currentUserSubject;
          this.morePhotosAllowed = this.maxPhotos > currentUserSubject.images.length ? true : false;
        }
      );

    this.getCurrentUserImages();

    this.translocoService.selectTranslate('ImageBoardComponent.UploadNewPhoto').subscribe(value => this.matButtonToggleText = value);
  }

  getCurrentUserImages(): void {

    let defaultImageModel: ImageModel = new ImageModel();

    if (this.currentUserSubject.images != null && this.currentUserSubject.images.length > 0) {
      if (this.currentUserSubject.images.length > 0) {

        this.currentUserSubject.images.forEach((element, i) => {

          if (typeof element.fileName !== 'undefined') {

            this.loading = true;

            this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.small)
              .pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.smallimage = 'data:image/jpg;base64,' + images.toString() },
                () => { this.loading = false; element.image = defaultImageModel.image },
                () => { this.loading = false; }
              );

            this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.large)
              .pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.image = 'data:image/jpg;base64,' + images.toString() },
                () => { this.loading = false; element.smallimage = defaultImageModel.smallimage },
                () => { this.loading = false; }
              );
          }

        });
      }
    }
  }

  refreshCurrentUserImages(): void {
    this.profileService.updateCurrentUserSubject().then(() => {
      this.getCurrentUserImages();
      this.morePhotosAllowed = this.maxPhotos > this.currentUserSubject.images.length ? true : false;
    });
  }

  toggleDisplay(): void {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? this.translocoService.translate('ImageBoardComponent.UploadNewPhoto') : this.translocoService.translate('ImageBoardComponent.TileView'));
    this.matButtonToggleIcon = (this.isMatButtonToggled ? 'add_photo_alternate' : 'collections');

    if (this.matButtonToggleText == this.translocoService.translate('ImageBoardComponent.UploadNewPhoto')) {
      this.refreshCurrentUserImages();
    }
  }
}
