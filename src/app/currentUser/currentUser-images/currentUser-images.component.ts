import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ImageModel } from '../../models/imageModel';
import { DeleteImageDialog } from '../../image-components/delete-image/delete-image-dialog.component';

@Component({
  selector: 'currentUser-images',
  templateUrl: './currentUser-images.component.html',
  styleUrls: ['./currentUser-images.component.scss']
})

export class CurrentUserImagesComponent {

  selectedImageModel: ImageModel;

  @Input() imageModels: ImageModel[];
  @Output("refreshCurrentUserImages") refreshCurrentUserImages: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private dialog: MatDialog) { }

  openDeleteImageDialog(imageId): void {
    const dialogRef = this.dialog.open(DeleteImageDialog, {
      height: '300px',
      width: '300px',
      data: { imageId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshCurrentUserImages.emit(); 
    });
  }
}
