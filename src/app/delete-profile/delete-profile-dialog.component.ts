import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from './../auth/auth.service';

import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-delete-profile-dialog',
  templateUrl: './delete-profile-dialog.component.html'
})

export class DeleteProfileDialog {
  IsChecked: boolean;

  constructor(public auth: AuthService, private profileService: ProfileService,
    public dialogRef: MatDialogRef<DeleteProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public profileIds: string[]) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    if (this.IsChecked) {
      if (this.profileIds.length > 0) {
        this.profileService.deleteProfiles(this.profileIds).subscribe(() => { });
      }
      else {
        this.profileService.deleteCurrentUser().subscribe(() => { });
        //this.auth.logout()
      }
    }
  }

}
