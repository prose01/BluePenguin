import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})

@AutoUnsubscribe()
export class ImageDialog {
  index: number;
  defaultImage = '../assets/default-person-icon.jpg';

  constructor(private profileService: ProfileService, public dialogRef: MatDialogRef<ImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
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


  liked() {
    return this.data.profile.likes?.find(x => x == this.data.currentUserSubjectProfileId);
  }

  /** Add or remove Likes */
  addLike() {
    this.profileService.addLikeToProfile(this.data.profile.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(() => {
        this.data.profile.likes.push(this.data.currentUserSubjectProfileId);
      }, () => { }, () => { });
  }

  removeLike() {
    this.profileService.removeLikeFromProfile(this.data.profile.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(() => {
        let index = this.data.profile.likes.indexOf(this.data.currentUserSubjectProfileId, 0);
        this.data.profile.likes.splice(index, 1);
      }, () => { }, () => { });
  }


  bookmarked() {
    return this.data.currentUserSubjectBookmarked;
  }

  /** Add or remove bookmarks */
  addFavoritProfiles() {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.data.profile.profileId);

    this.profileService.addProfilesToBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
        this.data.currentUserSubjectBookmarked = true;
      });
  }

  removeFavoritProfiles() {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.data.profile.profileId);

    this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
        this.data.currentUserSubjectBookmarked = false;
      });
  }
}
