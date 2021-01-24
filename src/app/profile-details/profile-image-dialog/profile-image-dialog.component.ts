import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'profile-image-dialog',
  templateUrl: './profile-image-dialog.component.html'
})

export class ProfileImageDialog {

  constructor(public dialogRef: MatDialogRef<ProfileImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
