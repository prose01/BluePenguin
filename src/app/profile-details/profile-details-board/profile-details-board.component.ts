import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ImageService } from '../../services/image.service';
import { Profile } from '../../models/profile';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ImageModel } from '../../models/imageModel';
import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';

@Component({
  selector: 'profileDetailsBoard',
  templateUrl: './profile-details-board.component.html'
})

@AutoUnsubscribe()
export class ProfileDetailsBoardComponent implements OnInit {
  loading: boolean = false;

  currentUserSubject: CurrentUser;

  @Input() profile: Profile;
  @Output("loadDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  constructor(private imageService: ImageService, private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });

    this.getProfileImages();
  }

  getProfileImages(): void {
    let defaultImageModel: ImageModel = new ImageModel();

    if (this.profile.images != null && this.profile.images.length > 0) {

      this.profile.images.forEach((element, i) => {

        if (typeof element.fileName !== 'undefined') {

          this.loading = true;

          this.imageService.getProfileImageByFileName(this.profile.profileId, element.fileName, ImageSizeEnum.small)
            .pipe(takeWhileAlive(this))
            .subscribe(
              images => { element.smallimage = 'data:image/jpeg;base64,' + images.toString() },
              () => { this.loading = false; element.image = defaultImageModel.image },
              () => { this.loading = false; }
            );

          this.imageService.getProfileImageByFileName(this.profile.profileId, element.fileName, ImageSizeEnum.large)
            .pipe(takeWhileAlive(this))
            .subscribe(
              images => { element.image = 'data:image/jpeg;base64,' + images.toString() },
              () => { this.loading = false; element.smallimage = defaultImageModel.smallimage },
              () => { this.loading = false; }
            );
        }

      });
    }
  }

  // Load Detalails page
  loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }
}
