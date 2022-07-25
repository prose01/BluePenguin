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
  private currentUserSubject: CurrentUser;

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
        this.profileService.setAsAdmin(this.profile.profileId)
        .subscribe({
          next: (response: any) => { this.profile = response },
          complete: () => {},
          error: () => {}
        })
      );
    }
  }

  private removeProfileAsAdmin(): void {
    if (this.currentUserSubject.admin) {
      this.subs.push(
        this.profileService.removeAdmin(this.profile.profileId)
        .subscribe({
          next: (response: any) => { this.profile = response },
          complete: () => {},
          error: () => {}
        })
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
      .subscribe({
        next: () =>  {
          this.profile.likes.push(this.currentUserSubject.profileId);
        },
        complete: () => {},
        error: () => {}
      })
    );
  }

  private removeLike(): void {
    this.subs.push(
      this.profileService.removeLikeFromProfile(this.profile.profileId)
      .subscribe({
        next: () =>  {
          let index = this.profile.likes.indexOf(this.currentUserSubject.profileId, 0);
          this.profile.likes.splice(index, 1);
        },
        complete: () => {},
        error: () => {}
      })
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
      .subscribe({
        next: () =>  {},
        complete: () => {
          this.profileService.updateCurrentUserSubject();
        },
        error: () => {}
      })
    );
  }

  private removeBookmarkedProfiles(): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.profile.profileId);

    this.subs.push(
      this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
      .subscribe({
        next: () =>  {},
        complete: () => {
          this.profileService.updateCurrentUserSubject();
        },
        error: () => {}
      })
    );
  }
}
