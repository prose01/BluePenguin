import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { CurrentUser } from '../../models/currentUser';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'app-delete-profile-dialog',
  templateUrl: './delete-profile-dialog.component.html'
})

export class DeleteProfileDialog implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;
  public IsChecked: boolean;
  public matDialogTitle: string;
  public matDialogContent: string;

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public profileIds: string[], private readonly translocoService: TranslocoService) {

    this.subs.push(
      this.profileService.currentUserSubject
        .subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );
  }

  ngOnInit(): void {
    this.matDialogTitle = (this.profileIds[0] != this.currentUserSubject.profileId ? this.translocoService.translate('DeleteProfileDialog.DeleteProfile') : this.translocoService.translate('DeleteProfileDialog.DeleteYourProfile'));
    this.matDialogContent = (this.profileIds[0] != this.currentUserSubject.profileId ? this.translocoService.translate('DeleteProfileDialog.ProfileDeleteCannotBeUndone') : this.translocoService.translate('DeleteProfileDialog.DeletionCannotBeUndone'));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  async onYesClick(): Promise<void> {
    if (this.IsChecked) {

      this.dialogRef.close(true);

      if (this.profileIds.includes(this.currentUserSubject.profileId) && !this.currentUserSubject.admin) {
        // Images must be deleted before user as the imageService uses the profileId!!!
        //const reponse = await this.imageService.deleteAllImagesForCurrentUser();

        this.subs.push(
          this.imageService.deleteAllImagesForCurrentUser()
            .subscribe({
              next: () => { },
              complete: () => {
                //this.subs.push(
                //  this.profileService.deleteCurrentUser()
                //    .subscribe({
                //      next: () => { },
                //      complete: () => {
                //        this.auth.logout()
                //      },
                //      error: () => {
                //        this.openErrorDialog(this.translocoService.translate('CouldNotDeleteCurrentUser'), null);
                //      }
                //    })
                //);
              },
              error: () => {
                this.openErrorDialog(this.translocoService.translate('CouldNotDeleteCurrentUser'), null);
              }
            })
        );

        //this.subs.push(
        //  this.profileService.deleteCurrentUser()
        //  .subscribe({
        //    next: () =>  {},
        //    complete: () => { 
        //      this.auth.logout() 
        //    },
        //    error: () => {
        //      this.openErrorDialog(this.translocoService.translate('CouldNotDeleteCurrentUser'), null);
        //    }
        //  })
        //);
      }
      else if (!this.profileIds.includes(this.currentUserSubject.profileId) && this.currentUserSubject.admin) {
        // Images must be deleted before user as the imageService uses the profileId!!!
        //const reponse = await this.imageService.deleteAllImagesForProfile(this.profileIds);

        this.subs.push(
          this.imageService.deleteAllImagesForProfiles(this.profileIds)
            .subscribe({
              next: () => { console.log('next'); },
              complete: () => {
                console.log('complete');
                //this.subs.push(
                //  this.profileService.deleteProfiles(this.profileIds)
                //    .subscribe({
                //      next: () => { },
                //      complete: () => { },
                //      error: () => {
                //        this.openErrorDialog(this.translocoService.translate('CouldNotDeleteAllImagesForProfile'), null);
                //      }
                //    })
                //);
              },
              error: () => {
                console.log('error');
                this.openErrorDialog(this.translocoService.translate('CouldNotDeleteAllImagesForProfile'), null);
              }
            })
        );

        //this.subs.push(
        //  this.profileService.deleteProfiles(this.profileIds)
        //    .subscribe({
        //      next: () => { },
        //      complete: () => { },
        //      error: () => {
        //        this.openErrorDialog(this.translocoService.translate('CouldNotDeleteAllImagesForProfile'), null);
        //      }
        //    })
        //);
      }
    }
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
