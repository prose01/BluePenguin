import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})

export class ImageDialog {
  index: number;

  constructor(public dialogRef: MatDialogRef<ImageDialog>,
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
