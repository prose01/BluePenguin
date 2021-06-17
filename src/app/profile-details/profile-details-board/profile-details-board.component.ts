import { Component, Input } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ImageService } from '../../services/image.service';
import { Profile } from '../../models/profile';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ImageModel } from '../../models/imageModel';

@Component({
  selector: 'profileDetailsBoard',
  templateUrl: './profile-details-board.component.html'
})

@AutoUnsubscribe()
export class ProfileDetailsBoardComponent {
  loading: boolean = false;

  @Input() profile: Profile;

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.getProfileImages();
  }

  getProfileImages(): void {
    let defaultImageModel: ImageModel = new ImageModel();

    if (this.profile.images != null && this.profile.images.length > 0) {
      if (this.profile.images.length > 0) {

        this.profile.images.forEach((element, i) => {

          if (typeof element.fileName !== 'undefined') {

            this.loading = true;

            this.imageService.getProfileImageByFileName(this.profile.profileId, element.fileName, ImageSizeEnum.small)
              .pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.smallimage = 'data:image/jpg;base64,' + images.toString() },
                () => { this.loading = false; element.image = defaultImageModel.image },
                () => { this.loading = false; }
              );

            this.imageService.getProfileImageByFileName(this.profile.profileId, element.fileName, ImageSizeEnum.large)
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
}
