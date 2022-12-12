import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Subscription } from 'rxjs';

import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html'
})

export class ProfileDetailsComponent implements OnInit, OnDestroy {
  @Input() profile: Profile;

  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;

  constructor(private profileService: ProfileService, private dialog: MatDialog, private readonly translocoService: TranslocoService) { }

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
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotSetProfileAsAdmin'), null);
          }
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
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotRemoveProfileAsAdmin'), null);
          }
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
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.profile.profileId);

    this.subs.push(
      this.profileService.addLikeToProfiles(selcetedProfiles)
      .subscribe({
        next: () =>  {
          this.profile.likes.push(this.currentUserSubject.profileId);
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
    selcetedProfiles.push(this.profile.profileId);

    this.subs.push(
      this.profileService.removeLikeFromProfiles(selcetedProfiles)
      .subscribe({
        next: () =>  {
          let index = this.profile.likes.indexOf(this.currentUserSubject.profileId, 0);
          this.profile.likes.splice(index, 1);
        },
        complete: () => {},
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotRemoveLike'), null);
        }
      })
    );
  }

  private bookmarked(): boolean {
    if (this.currentUserSubject.bookmarks.indexOf(this.profile.profileId) !== -1) {
      return true;
    }

    return false;
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
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotAddBookmarkedProfiles'), null);
        }
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
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotRemoveBookmarkedProfiles'), null);
        }
      })
    );
  }

  private blockChatMembers(): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.profile.profileId);

    this.subs.push(
      this.profileService.blockChatMembers(selcetedProfiles) // TODO: Should not be possible unless there are messages / bookmark
        .subscribe({
          next: () => { },
          complete: () => {
            this.profileService.updateCurrentUserSubject(); // TODO: Is this needed?
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotBlockChatMembers'), null);
          }
        })
    );
  }

  private addComplainToProfile(): void {
    this.subs.push(
      this.profileService.addComplainToProfile(this.profile.profileId)
        .subscribe({
          next: () => { },
          complete: () => { },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotAddComplainToProfile'), null);
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
