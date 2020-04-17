import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../auth/auth.service';

import { ImageModel } from '../../models/imageModel';
import { DeleteImageDialog } from '../delete-image/delete-image-dialog.component';

@Component({
  selector: 'image-tileview',
  templateUrl: './image-tileview.component.html',
  styleUrls: ['./image-tileview.component.css']
})

export class ImageTileviewComponent {

  selectedImageModel: ImageModel;

  @Input() imageModels: ImageModel[];

  constructor(public auth: AuthService, private dialog: MatDialog) { }

  openDeleteImageDialog(imageId): void {
    const dialogRef = this.dialog.open(DeleteImageDialog, {
      height: '300px',
      width: '300px',
      data: { imageId }
    });
  }
}
