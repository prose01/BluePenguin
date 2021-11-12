import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})

@AutoUnsubscribe()
export class ImageDialog {

  currentUserSubject: CurrentUser;
  index: number;
  defaultImage = '../assets/default-person-icon.jpg';

  constructor(private profileService: ProfileService, public dialogRef: MatDialogRef<ImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
    this.index = this.data.index;
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  onNextClick(): void {
    if ((this.data.imageModels.length - 1) > this.index) {
      this.index++;
    }
  }

  onBeforeClick(): void {
    if (0 < (this.data.imageModels.length - 1) && 0 < this.index) {
      this.index--;
    }
  }

  loadDetailsClick(): void {
    this.dialogRef.close(true);
  }


  isThisCurrentUser() {
    return this.currentUserSubject.profileId == this.data.currentProfileId;
  }

  liked() {
    return this.data.profile?.likes?.find(x => x == this.currentUserSubject.profileId);
  }

  /** Add or remove Likes */
  addLike() {
    this.profileService.addLikeToProfile(this.data.profile.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(() => {
        this.data.profile.likes.push(this.currentUserSubject.profileId);
      }, () => { }, () => { });
  }

  removeLike() {
    this.profileService.removeLikeFromProfile(this.data.profile.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(() => {
        let index = this.data.profile.likes.indexOf(this.currentUserSubject.profileId, 0);
        this.data.profile.likes.splice(index, 1);
      }, () => { }, () => { });
  }


  bookmarked() {
    return this.currentUserSubject?.bookmarks.find(x => x == this.data.profile.profileId)
  }

  /** Add or remove bookmarks */
  addBookmarkedProfiles() {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.data.profile.profileId);

    this.profileService.addProfilesToBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
      });
  }

  removeBookmarkedProfiles() {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.data.profile.profileId);

    this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
      });
  }
}
