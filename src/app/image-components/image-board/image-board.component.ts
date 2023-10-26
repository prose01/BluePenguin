import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';

@Component({
  selector: 'image-board',
  templateUrl: './image-board.component.html'
})

export class ImageBoardComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private maxPhotos: number;
  private pinacothecaUrl: string;
  private matButtonToggleIcon: string = 'add_photo_alternate';
  private matButtonToggleText: string;

  private currentUserSubject: CurrentUser;

  public loading: boolean = false;
  public morePhotosAllowed: boolean = false;
  public isMatButtonToggled = true;

  constructor(private profileService: ProfileService, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.maxPhotos = this.configurationLoader.getConfiguration().maxPhotos;
    this.pinacothecaUrl = this.configurationLoader.getConfiguration().pinacothecaUrl;
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject
        .subscribe(
          currentUserSubject => {
            this.currentUserSubject = currentUserSubject;
            this.getCurrentUserImages();
            this.morePhotosAllowed = this.maxPhotos > currentUserSubject?.images.length ? true : false;
          }
        )
    );

    this.subs.push(
      this.translocoService.selectTranslate('ImageBoardComponent.AddPhoto').subscribe(value => this.matButtonToggleText = value)
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

    if (this.currentUserSubject.images != null && this.currentUserSubject.images.length > 0) {
      if (this.currentUserSubject.images.length > 0) {

        this.currentUserSubject.images.forEach((element) => {

          if (typeof element.fileName !== 'undefined') {

            element.image = this.pinacothecaUrl + this.currentUserSubject.profileId + '/' + element.fileName
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
    this.matButtonToggleText = (this.isMatButtonToggled ? this.translocoService.translate('ImageBoardComponent.AddPhoto') : this.translocoService.translate('ImageBoardComponent.TileView'));
    this.matButtonToggleIcon = (this.isMatButtonToggled ? 'add_photo_alternate' : 'collections');

    if (this.matButtonToggleText == this.translocoService.translate('ImageBoardComponent.AddPhoto')) {
      this.refreshCurrentUserImages();
    }
  }
}
