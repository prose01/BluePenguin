import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-delete-profile-dialog',
  templateUrl: './delete-profile-dialog.component.html'
})

export class DeleteProfileDialog {
  IsChecked: boolean;
  matDialogTitle: string;
  matDialogContent: string;

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService,
    public dialogRef: MatDialogRef<DeleteProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public profileIds: string[]) {

    this.matDialogTitle = (this.profileIds.length > 0 ? 'Do you want to delete profile(s)?' : 'Do you want to delete your profile?');
    this.matDialogContent = (this.profileIds.length > 0 ? 'This will delete the profile(s) and cannot be undone.' : 'This will delete your profile and cannot be undone.');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    if (this.IsChecked) {
      if (this.profileIds.length > 0) {
        this.imageService.deleteAllImagesForProfile(this.profileIds).subscribe(() => { });
        this.profileService.deleteProfiles(this.profileIds).subscribe(() => { });
      }
      else {
        this.imageService.deleteAllImagesForCurrentUser().subscribe(() => { });
        //this.profileService.deleteCurrentUser().subscribe(() => { }, () => { }, () => { this.auth.logout() });
      }
    }
  }

}
