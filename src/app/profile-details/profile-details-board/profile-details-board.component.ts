import { Component, Input } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';

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

  smallImages: any[] = [];
  images: any[] = [];

  constructor(public auth: AuthService, private imageService: ImageService) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.getSmallProfileImages().then(() => { this.getProfileImages(); });
    }
  }

  getProfileImages(): void {
    this.imageService.getProfileImages(this.profile.profileId, ImageSizeEnum.large)
      .pipe(takeWhileAlive(this))
      .subscribe(images => this.images = images );
  }

  getSmallProfileImages(): Promise<void> {
    this.imageService.getProfileImages(this.profile.profileId, ImageSizeEnum.small)
      .pipe(takeWhileAlive(this))
      .subscribe(smallImages => this.smallImages = smallImages );

    return Promise.resolve();
  }
}
