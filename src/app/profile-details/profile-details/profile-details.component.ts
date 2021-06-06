
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html'
})

export class ProfileDetailsComponent implements OnInit {
  @Input() profile: Profile;

  currentUserSubject: CurrentUser;

  constructor(private profileService: ProfileService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
  }

  setProfileAsAdmin() {
    if (this.currentUserSubject.admin) {
      this.profileService.setAsAdmin(this.profile).subscribe(
        (response: any) => { this.profile = response },
        () => { },
        () => { });
    }
  }

  removeProfileAsAdmin() {
    if (this.currentUserSubject.admin) {
      this.profileService.removeAdmin(this.profile).subscribe(
        (response: any) => { this.profile = response },
        () => { },
        () => { });
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
