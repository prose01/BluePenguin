import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { Profile } from '../../models/profile';

@Component({
  selector: 'profileDetailsBoard',
  templateUrl: './profile-details-board.component.html'
})
export class ProfileDetailsBoardComponent {
  profile: Profile;
  images: any[] = [];

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.getProfileDetails();
          this.getProfileImages();
        }
      });
    }
  }

  getProfileDetails(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.profileService.getProfileById(params.get('profileId'))))
      .subscribe(profile => this.profile = profile);
  }

  getProfileImages(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.imageService.getProfileImages(params.get('profileId'))))
      .subscribe(images => this.images = images);
  }
}
