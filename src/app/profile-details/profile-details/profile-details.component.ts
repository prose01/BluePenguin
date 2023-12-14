import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
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

  public bodyType: string;
  public smokingHabitsType: string;
  public hasChildrenType: string;
  public wantChildrenType: string;
  public hasPetsType: string;
  public livesInType: string;
  public educationType: string;
  public educationStatusType: string;
  public employmentStatusType: string;
  public sportsActivityType: string;
  public eatingHabitsType: string;
  public clotheStyleType: string;
  public bodyArtType: string;

  constructor(private profileService: ProfileService, private dialog: MatDialog, private readonly translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );

    if (this.profile.smokingHabits != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('BodyTypes.' + this.profile.body).subscribe(value => this.bodyType = value)
      );
    }

    if (this.profile.smokingHabits != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('SmokingHabitsType.' + this.profile.smokingHabits).subscribe(value => this.smokingHabitsType = value)
      );
    }

    if (this.profile.hasChildren != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('HasChildrenType.' + this.profile.hasChildren).subscribe(value => this.hasChildrenType = value)
      );
    }

    if (this.profile.wantChildren != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('WantChildrenType.' + this.profile.wantChildren).subscribe(value => this.wantChildrenType = value)
      );
    }

    if (this.profile.hasPets != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('HasPetsType.' + this.profile.hasPets).subscribe(value => this.hasPetsType = value)
      );
    }

    if (this.profile.livesIn != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('LivesInType.' + this.profile.livesIn).subscribe(value => this.livesInType = value)
      );
    }

    if (this.profile.education != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('EducationType.' + this.profile.education).subscribe(value => this.educationType = value)
      );
    }

    if (this.profile.educationStatus != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('EducationStatusType.' + this.profile.educationStatus).subscribe(value => this.educationStatusType = value)
      );
    }

    if (this.profile.employmentStatus != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('EmploymentStatusType.' + this.profile.employmentStatus).subscribe(value => this.employmentStatusType = value)
      );
    }

    if (this.profile.sportsActivity != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('SportsActivityType.' + this.profile.sportsActivity).subscribe(value => this.sportsActivityType = value)
      );
    }

    if (this.profile.eatingHabits != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('EatingHabitsType.' + this.profile.eatingHabits).subscribe(value => this.eatingHabitsType = value)
      );
    }

    if (this.profile.clotheStyle != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('ClotheStyleType.' + this.profile.clotheStyle).subscribe(value => this.clotheStyleType = value)
      );
    }

    if (this.profile.bodyArt != 'NotChosen') {
      this.subs.push(
        this.translocoService.selectTranslate('BodyArtType.' + this.profile.bodyArt).subscribe(value => this.bodyArtType = value)
      );
    }
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
    if (this.currentUserSubject.bookmarks.findIndex(bookmark => bookmark.profileId == this.profile.profileId && !bookmark.isBookmarked) !== -1) {
      return true;
    }

    return false;
  }

  private bookmarkedMe(): boolean {
    if (this.currentUserSubject.bookmarks.findIndex(bookmark => bookmark.profileId == this.profile.profileId && bookmark.isBookmarked) !== -1) {
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

  private blockBookmarks(): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(this.profile.profileId);

    this.subs.push(
      this.profileService.blockBookmarks(selcetedProfiles)
        .subscribe({
          next: () => { },
          complete: () => {
            this.profileService.updateCurrentUserSubject();
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotBlockBookmarks'), null);
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
