import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
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
  profile: Profile;
  images: any[] = [];
  smallImages: any[] = [];

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.getProfileDetails();
          this.getSmallProfileImages().then(() => { this.getProfileImages(); });
          //setTimeout(() => { this.getSmallProfileImages(); }, 500, () => { this.getProfileImages(); }, () => { this.getProfileImages(); }); 
        }
      });
    }
  }

  getProfileDetails(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.profileService.getProfileById(params.get('profileId'))))
      .pipe(takeWhileAlive(this))
      .subscribe(profile => this.profile = profile);
  }

  getProfileImages(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.imageService.getProfileImages(params.get('profileId'), ImageSizeEnum.large)))
      .pipe(takeWhileAlive(this))
      .subscribe(images => this.images = images);
  }

  getSmallProfileImages(): Promise<void> {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.imageService.getProfileImages(params.get('profileId'), ImageSizeEnum.small)))
      .pipe(takeWhileAlive(this))
      .subscribe(smallImages => this.smallImages = smallImages);
    return Promise.resolve();
  }
}
