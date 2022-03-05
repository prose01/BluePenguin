import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html'
})

export class ProfileDetailsComponent implements OnInit, OnDestroy {
  @Input() profile: Profile;

  private subs: Subscription[] = [];
  currentUserSubject: CurrentUser;

  constructor(private profileService: ProfileService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private setProfileAsAdmin(): void {
    if (this.currentUserSubject.admin) {
      this.subs.push(
        this.profileService.setAsAdmin(this.profile.profileId).subscribe(
          (response: any) => { this.profile = response },
          () => { },
          () => { }
        )
      );
    }
  }

  private removeProfileAsAdmin(): void {
    if (this.currentUserSubject.admin) {
      this.subs.push(
        this.profileService.removeAdmin(this.profile.profileId).subscribe(
          (response: any) => { this.profile = response },
          () => { },
          () => { })
      );
    }
  }

  private openDeleteProfilesDialog(): void {
    const dialogRef = this.dialog.open(DeleteProfileDialog, {
      data: [this.profile.profileId]
    });
  }

  private liked(): string {
    return this.profile?.likes?.find(x => x == this.currentUserSubject.profileId);
  }

  /** Add or remove Likes */
  private addLike(): void {
    this.subs.push(
      this.profileService.addLikeToProfile(this.profile.profileId)
        .subscribe(() => {
          this.profile.likes.push(this.currentUserSubject.profileId);
        }, () => { }, () => { })
    );
  }

  private removeLike(): void {
    this.subs.push(
      this.profileService.removeLikeFromProfile(this.profile.profileId)
        .subscribe(() => {
          let index = this.profile.likes.indexOf(this.currentUserSubject.profileId, 0);
          this.profile.likes.splice(index, 1);
        }, () => { }, () => { })
    );
  }

  private bookmarked(): string {
    return this.currentUserSubject?.bookmarks.find(x => x == this.profile.profileId)
  }

  /** Add or remove bookmarks */
  private addBookmarkedProfiles(): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.profile.profileId);

    this.subs.push(
      this.profileService.addProfilesToBookmarks(selcetedProfiles)
        .subscribe(() => { }, () => { }, () => {
          this.profileService.updateCurrentUserSubject();
        })
    );
  }

  private removeBookmarkedProfiles(): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.profile.profileId);

    this.subs.push(
      this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
        .subscribe(() => { }, () => { }, () => {
          this.profileService.updateCurrentUserSubject();
        })
    );
  }
}
