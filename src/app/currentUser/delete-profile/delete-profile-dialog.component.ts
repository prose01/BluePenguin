import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { CurrentUser } from '../../models/currentUser';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

@Component({
  selector: 'app-delete-profile-dialog',
  templateUrl: './delete-profile-dialog.component.html',
  styleUrls: ['./delete-profile-dialog.component.scss']
})

@AutoUnsubscribe()
export class DeleteProfileDialog implements OnInit {
  currentUserSubject: CurrentUser;
  IsChecked: boolean;
  matDialogTitle: string;
  matDialogContent: string;

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService,
    public dialogRef: MatDialogRef<DeleteProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public profileIds: string[]) {

    this.profileService.currentUserSubject.pipe(takeWhileAlive(this)).subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
  }

  ngOnInit(): void {
    this.matDialogTitle = (this.profileIds[0] != this.currentUserSubject.profileId ? 'Do you want to delete profile(s)?' : 'Do you want to delete your profile?');
    this.matDialogContent = (this.profileIds[0] != this.currentUserSubject.profileId ? 'This will delete the profile(s) and cannot be undone.' : 'This will delete your profile and cannot be undone.');
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  async onYesClick() {
    if (this.IsChecked) {

      this.dialogRef.close(true);

      if (this.profileIds.includes(this.currentUserSubject.profileId) && !this.currentUserSubject.admin) {
        // Images must be deleted before user as the imageService uses the profileId!!!
        const reponse = await this.imageService.deleteAllImagesForCurrentUser();
        this.profileService.deleteCurrentUser().subscribe(() => { }, () => { }, () => { this.auth.logout() });
      }
      else if (!this.profileIds.includes(this.currentUserSubject.profileId) && this.currentUserSubject.admin) {
        // Images must be deleted before user as the imageService uses the profileId!!!
        const reponse = await this.imageService.deleteAllImagesForProfile(this.profileIds);
        this.profileService.deleteProfiles(this.profileIds).subscribe();
      }
      else if (this.profileIds.includes(this.currentUserSubject.profileId) && this.currentUserSubject.admin) {
        // TODO: Show error messsage - 'Administrators cannot delete themselves.';
        console.log('Administrators cannot delete themselves.');
      }
    }
  }

}
