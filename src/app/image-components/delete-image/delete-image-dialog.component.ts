import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ImageService } from './../../services/image.service';

@Component({
  selector: 'delete-image-dialog',
  templateUrl: './delete-image-dialog.component.html',
  styleUrls: ['./delete-image-dialog.component.scss']
})

export class DeleteImageDialog {
  IsChecked: boolean;
  matDialogTitle: string = 'Do you want to delete this image?';
  matDialogContent: string = 'This will delete the image and cannot be undone.';

  constructor(private imageService: ImageService, public dialogRef: MatDialogRef<DeleteImageDialog>,
    @Inject(MAT_DIALOG_DATA) public imageId: string) {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  async onYesClick() {
    if (this.IsChecked) {
      var id = [];
      id.push(this.imageId["imageId"]); // TODO: Fix this. Hack to get post to work.

      const reponse = await this.imageService.deleteImagesForCurrentUser(id);

      this.dialogRef.close(true);
    }
  }

}
