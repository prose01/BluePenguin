
import {switchMap} from 'rxjs/operators';

import { Component, OnInit, Input } 		from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { AuthService } from './../authorisation/auth/auth.service';
import { Profile } from '../models/profile';
import { CurrentUser } from '../models/currentUser';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: [ './profile-detail.component.css' ]
})

export class ProfileDetailComponent implements OnInit {
	@Input() profile : Profile;

  currentUserSubject: CurrentUser;

  constructor(public auth: AuthService, private profileService: ProfileService, private route: ActivatedRoute
	) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.route.paramMap.pipe(
            switchMap((params: ParamMap) => this.profileService.getProfileById(params.get('profileId'))))
          .subscribe(profile => this.profile = profile); }

        this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
      });
    }
  }

  setProfileAsAdmin() {
    if (this.currentUserSubject.admin) {
      this.profileService.setAsAdmin(this.profile).subscribe(() => { });
    }
  }

  removeProfileAsAdmin() {
    if (this.currentUserSubject.admin) {
      this.profileService.removeAdmin(this.profile).subscribe(() => { });
    }
  }

}
