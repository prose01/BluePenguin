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

      this.dialogRef.close(true); // TODO: Hack to remove Image from list. If imageService.deleteImagesForCurrentUser fails this should be 'false' but it doesn't work.

      var id = [];
      id.push(this.imageId["imageId"]); 

      const reponse = await this.imageService.deleteImagesForCurrentUser(id);
    }
  }

}
