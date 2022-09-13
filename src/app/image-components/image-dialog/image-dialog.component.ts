import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})

export class ImageDialog implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;
  private defaultImage = '../assets/default-person-icon.jpg';

  public index: number;

  constructor(private profileService: ProfileService, public dialogRef: MatDialogRef<ImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.index = this.data.index;
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  private onNextClick(): void {
    if ((this.data.imageModels.length - 1) > this.index) {
      this.index++;
    }
  }

  private onBeforeClick(): void {
    if (0 < (this.data.imageModels.length - 1) && 0 < this.index) {
      this.index--;
    }
  }

  loadDetailsClick(): void {
    this.dialogRef.close(true);
  }


  isThisCurrentUser(): boolean {
    return this.currentUserSubject.profileId == this.data.currentProfileId;
  }

  liked(): string {
    return this.data.profile?.likes?.find(x => x == this.currentUserSubject.profileId);
  }

  /** Add or remove Likes */
  private addLike(): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.data.profile.profileId);

    this.subs.push(
      this.profileService.addLikeToProfiles(selcetedProfiles)
      .subscribe({
        next: () =>  {
          this.data.profile.likes.push(this.currentUserSubject.profileId);
        },
        complete: () => {},
        error: () => {}
      })
    );
  }

  private removeLike(): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.data.profile.profileId);

    this.subs.push(
      this.profileService.removeLikeFromProfiles(selcetedProfiles)
      .subscribe({
        next: () =>  {
          let index = this.data.profile.likes.indexOf(this.currentUserSubject.profileId, 0);
          this.data.profile.likes.splice(index, 1);
        },
        complete: () => {},
        error: () => {}
      })
    );
  }


  bookmarked(): string {
    return this.currentUserSubject?.bookmarks.find(x => x == this.data.profile.profileId)
  }

  /** Add or remove bookmarks */
  private addBookmarkedProfiles(): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.data.profile.profileId);

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
    selcetedProfiles.push(this.data.profile.profileId);

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
