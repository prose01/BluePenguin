import { Component, Input } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ImageService } from '../../services/image.service';
import { Profile } from '../../models/profile';
import { ImageSizeEnum } from '../../models/imageSizeEnum';

@Component({
  selector: 'profileDetailsBoard',
  templateUrl: './profile-details-board.component.html'
})

@AutoUnsubscribe()
export class ProfileDetailsBoardComponent {
  @Input() profile: Profile;

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.getSmallProfileImages().then(() => { this.getProfileImages(); });
  }

  getProfileImages(): void {
    if (this.profile.images != null) {
      if (this.profile.images.length > 0) {
        this.profile.images.forEach((element, i) => {
          this.imageService.getProfileImageByFileName(this.profile.profileId, element.fileName, ImageSizeEnum.large)
            .pipe(takeWhileAlive(this))
            .subscribe(images => element.image = 'data:image/jpg;base64,' + images.toString());
        });
      }
    }
  }

  getSmallProfileImages(): Promise<void> {
    if (this.profile.images != null) {
      if (this.profile.images.length > 0) {
        this.profile.images.forEach((element, i) => {
          this.imageService.getProfileImageByFileName(this.profile.profileId, element.fileName, ImageSizeEnum.small)
            .pipe(takeWhileAlive(this))
            .subscribe(images => element.smallimage = 'data:image/jpg;base64,' + images.toString());
        });
      }
    }
    return Promise.resolve();
  }
}
