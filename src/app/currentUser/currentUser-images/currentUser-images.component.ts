import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ImageModel } from '../../models/imageModel';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { DeleteImageDialog } from '../../image-components/delete-image/delete-image-dialog.component';

@Component({
  selector: 'currentUser-images',
  templateUrl: './currentUser-images.component.html',
  styleUrls: ['./currentUser-images.component.scss']
})

export class CurrentUserImagesComponent{

  @Input() imageModels: ImageModel[];
  @Input() currentProfileId: string;

  constructor(private dialog: MatDialog) { }

  openImageDialog(indexOfelement: any): void {

    const dialogRef = this.dialog.open(ImageDialog, {
      data: {
        index: indexOfelement,
        imageModels: this.imageModels,
        currentProfileId: this.currentProfileId
      }
    });
  }

  openDeleteImageDialog(imageId: string): void {
    const dialogRef = this.dialog.open(DeleteImageDialog, {
      data: { imageId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.imageModels = this.imageModels.filter(function (obj) {
          return obj.imageId !== imageId;
        });
      }
    });
  }
}
