import { Component, Input } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { Profile } from '../../models/profile';
import { ImageSizeEnum } from '../../models/imageSizeEnum';

@Component({
  selector: 'profileDetailsBoard',
  templateUrl: './profile-details-board.component.html'
})

@AutoUnsubscribe()
export class ProfileDetailsBoardComponent {
  @Input() profileId: string;

  profile: Profile;
  images: any[] = [];
  smallImages: any[] = [];

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          console.log('DetailsBoard ' + this.profileId);
          //this.getProfileDetails();
          //this.getSmallProfileImages().then(() => { this.getProfileImages(); });
          setTimeout(() => { this.getProfileDetails(); }, 500, () => { }, () => { this.getSmallProfileImages().then(() => { this.getProfileImages(); }); });
        }
      });
    }
  }

  getProfileDetails(): void {
    this.profileService.getProfileById(this.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(profile => this.profile = profile);
  }

  getProfileImages(): void {
    this.imageService.getProfileImages(this.profileId, ImageSizeEnum.large)
      .pipe(takeWhileAlive(this))
      .subscribe(images => this.images = images);
  }

  getSmallProfileImages(): Promise<void> {
    this.imageService.getProfileImages(this.profileId, ImageSizeEnum.small)
      .pipe(takeWhileAlive(this))
      .subscribe(smallImages => this.smallImages = smallImages);

    return Promise.resolve();
  }
}
