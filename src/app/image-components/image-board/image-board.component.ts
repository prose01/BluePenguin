import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { CurrentUser } from '../../models/currentUser';
import { ImageModel } from '../../models/imageModel';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';

@Component({
  selector: 'image-board',
  templateUrl: './image-board.component.html'
})

export class ImageBoardComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private maxPhotos: number;
  private matButtonToggleIcon: string = 'add_photo_alternate';
  private matButtonToggleText: string;

  private currentUserSubject: CurrentUser;

  public loading: boolean = false;
  public morePhotosAllowed: boolean = false;
  public isMatButtonToggled = true;

  constructor(private profileService: ProfileService, private imageService: ImageService, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.maxPhotos = this.configurationLoader.getConfiguration().maxPhotos;
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject
        .subscribe(
          currentUserSubject => {
            this.currentUserSubject = currentUserSubject;
            this.morePhotosAllowed = this.maxPhotos > currentUserSubject?.images.length ? true : false;
          }
        )
    );

    this.getCurrentUserImages();

    this.subs.push(
      this.translocoService.selectTranslate('ImageBoardComponent.UploadNewPhoto').subscribe(value => this.matButtonToggleText = value)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private getCurrentUserImages(): void {

    // If there is no this.currentUserSubject yet don't even try.
    if(this.currentUserSubject == null){
      return;
    }

    let defaultImageModel: ImageModel = new ImageModel();

    if (this.currentUserSubject.images != null && this.currentUserSubject.images.length > 0) {
      if (this.currentUserSubject.images.length > 0) {

        this.currentUserSubject.images.forEach((element, i) => {

          if (typeof element.fileName !== 'undefined') {

            this.loading = true;

            this.subs.push(
              this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.small)
              .subscribe({
                next: (images: any[]) =>  { element.smallimage = 'data:image/jpg;base64,' + images.toString() },
                complete: () => { this.loading = false; },
                error: () => { this.loading = false; element.smallimage = defaultImageModel.smallimage }
              })
            );

            this.subs.push(
              this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.large)
              .subscribe({
                next: (images: any[]) =>  { element.image = 'data:image/jpg;base64,' + images.toString() },
                complete: () => { this.loading = false; },
                error: () => { this.loading = false; element.image = defaultImageModel.image }
              })
            );
          }

        });
      }
    }
  }

  private refreshCurrentUserImages(): void {
    this.profileService.updateCurrentUserSubject().then(() => {
      this.getCurrentUserImages();
    });
  }

  private toggleDisplay(): void {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? this.translocoService.translate('ImageBoardComponent.UploadNewPhoto') : this.translocoService.translate('ImageBoardComponent.TileView'));
    this.matButtonToggleIcon = (this.isMatButtonToggled ? 'add_photo_alternate' : 'collections');

    if (this.matButtonToggleText == this.translocoService.translate('ImageBoardComponent.UploadNewPhoto')) {
      this.refreshCurrentUserImages();
    }
  }
}
