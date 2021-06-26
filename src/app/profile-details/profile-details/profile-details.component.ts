import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html'
})

@AutoUnsubscribe()
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

  liked() {
    return this.profile?.likes?.find(x => x == this.currentUserSubject.profileId);
  }

  /** Add or remove Likes */
  addLike() {
    this.profileService.addLikeToProfile(this.profile.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(() => {
        this.profile.likes.push(this.currentUserSubject.profileId);
      }, () => { }, () => { });
  }

  removeLike() {
    this.profileService.removeLikeFromProfile(this.profile.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(() => {
        let index = this.profile.likes.indexOf(this.currentUserSubject.profileId, 0);
        this.profile.likes.splice(index, 1);
      }, () => { }, () => { });
  }

  bookmarked() {
    return this.currentUserSubject?.bookmarks.find(x => x == this.profile.profileId)
  }

  /** Add or remove bookmarks */
  addFavoritProfiles() {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.profile.profileId);

    this.profileService.addProfilesToBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
      });
  }

  removeFavoritProfiles() {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.profile.profileId);

    this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
      });
  }
}
