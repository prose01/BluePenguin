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

  constructor(private dialog: MatDialog) { }

  openImageDialog(indexOfelement: any): void {

    const dialogRef = this.dialog.open(ImageDialog, {
      //height: '80%',
      //width: '80%',
      data: {
        index: indexOfelement,
        imageModels: this.imageModels,
      }
    });
  }

  openDeleteImageDialog(imageId): void {
    const dialogRef = this.dialog.open(DeleteImageDialog, {
      height: '300px',
      width: '300px',
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
