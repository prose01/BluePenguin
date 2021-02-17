import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { CurrentUser } from '../../models/currentUser';
import { ImageModel } from '../../models/imageModel';
import { ImageSizeEnum } from '../../models/imageSizeEnum';

@Component({
  selector: 'image-board',
  templateUrl: './image-board.component.html',
  styleUrls: ['./image-board.component.scss']
})

@AutoUnsubscribe()
export class ImageBoardComponent implements OnInit {
  isMatButtonToggled = true;
  matButtonToggleIcon: string = 'add_photo_alternate';
  matButtonToggleText: string = 'Upload new photo';

  currentUserSubject: CurrentUser;
  imageModels: ImageModel[];
  smallImageModels: ImageModel[];

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService) { }


  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.profileService.currentUserSubject
            .pipe(takeWhileAlive(this))
            .subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; this.imageModels = currentUserSubject.images; this.smallImageModels = currentUserSubject.images });
          this.getCurrentUserSmallImages().then(() => { this.getCurrentUserImages(); });
        }
      });
    }
  }

  //ngAfterContentInit(): void {
  //  setTimeout(() => { this.getCurrentUserSmallImages(); }, 1000, () => { }, () => { this.getCurrentUserImages(); }); 
  //}

  getCurrentUserImages(): void {
    if (this.imageModels != null) {
      if (this.imageModels.length > 0) {
        this.imageModels.forEach((element, i) => {
          setTimeout(() => {
            this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.large)
              .pipe(takeWhileAlive(this))
              .subscribe(images => element.image = 'data:image/jpg;base64,' + images.toString());
          }, i * 500); // TODO: Find på noget bedre.
        });
      }
    }
  }

  getCurrentUserSmallImages(): Promise<void> {
    if (this.smallImageModels != null) {
      if (this.smallImageModels.length > 0) {
        this.smallImageModels.forEach((element, i) => {
          this.imageService.getProfileImageByFileName(this.currentUserSubject.profileId, element.fileName, ImageSizeEnum.small)
            .pipe(takeWhileAlive(this))
            .subscribe(images => element.image = 'data:image/jpg;base64,' + images.toString());
        });
      }
    }
    return Promise.resolve();
  }

  refreshCurrentUserImages(): void {
    //setTimeout(() => { this.getCurrentUserSmallImages(); }, 500, () => { }, () => { this.getCurrentUserImages(); }); // TODO: Find på noget bedre.
    this.getCurrentUserSmallImages().then(() => { this.getCurrentUserImages(); });
  }

  toggleDisplay() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? 'Upload new photo' : 'TileView');
    this.matButtonToggleIcon = (this.isMatButtonToggled ? 'add_photo_alternate' : 'collections');
  }
}
