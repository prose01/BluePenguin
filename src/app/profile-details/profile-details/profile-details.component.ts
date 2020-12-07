
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from './../../authorisation/auth/auth.service';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html'
})

export class ProfileDetailsComponent implements OnInit {
  @Input() profile: Profile;

  currentUserSubject: CurrentUser;

  constructor(public auth: AuthService, private profileService: ProfileService, private dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) { }

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

  openDeleteProfilesDialog(): void {
    const dialogRef = this.dialog.open(DeleteProfileDialog, {
      height: '300px',
      width: '300px',
      data: [this.profile.profileId]
    });
  }

}
