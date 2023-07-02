import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})

export class ImageDialog implements OnInit, OnDestroy {

  public pinacothecaUrl: string;
  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;

  public index: number;

  constructor(private profileService: ProfileService, public dialogRef: MatDialogRef<ImageDialog>, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pinacothecaUrl = this.configurationLoader.getConfiguration().pinacothecaUrl;
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
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotAddLike'), null);
        }
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
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotRemoveLike'), null);
        }
      })
    );
  }


  bookmarked(): boolean {
    if (this.currentUserSubject.bookmarks.indexOf(this.data.profile.profileId) !== -1) {
      return true;
    }

    return false;
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
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotAddBookmarkedProfiles'), null);
        }
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
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotRemoveBookmarkedProfiles'), null);
        }
      })
    );
  }

  private openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    });
  }
}
