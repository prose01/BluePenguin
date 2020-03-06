import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from './../auth/auth.service';

import { ProfileService } from '../services/profile.service';
import { CurrentUser } from '../models/currentUser';

@Component({
  selector: 'app-delete-profile-dialog',
  templateUrl: './delete-profile-dialog.component.html'
})

export class DeleteProfileDialog {

  constructor(public auth: AuthService, private profileService: ProfileService,
    public dialogRef: MatDialogRef<DeleteProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CurrentUser) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
