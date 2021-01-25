import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'profile-image-dialog',
  templateUrl: './profile-image-dialog.component.html',
  styleUrls: ['./profile-image-dialog.component.scss']
})

export class ProfileImageDialog {
  index: number;

  constructor(public dialogRef: MatDialogRef<ProfileImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.index = this.data.index;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onNextClick(): void {
    if ((this.data.images.length - 1) > this.index) {
      this.index++;
    }
  }

  onBeforeClick(): void {
    if (0 < (this.data.images.length - 1) && 0 < this.index) {
      this.index--;
    }
  }

}
