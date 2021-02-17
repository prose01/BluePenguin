import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';
import { ProfileService } from '../../services/profile.service';

import { ImageModel } from '../../models/imageModel';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { DeleteImageDialog } from '../../image-components/delete-image/delete-image-dialog.component';

@Component({
  selector: 'currentUser-images',
  templateUrl: './currentUser-images.component.html',
  styleUrls: ['./currentUser-images.component.scss']
})

export class CurrentUserImagesComponent {

  images: any[] = [];
  titles: string[] = [];

  @Input() imageModels: ImageModel[];
  @Output("refreshCurrentUserImages") refreshCurrentUserImages: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService, private dialog: MatDialog) {  }


  setImagesAndTitles(): void {
    const pics = [];
    const titles = [];

    this.imageModels.forEach(element => pics.push(
      element.image
    ));

    this.imageModels.forEach(element => titles.push(
      element.title
    ));

    this.images = pics;
    this.titles = titles;
  }

  openImageDialog(indexOfelement: any): void {
    this.setImagesAndTitles();

    const dialogRef = this.dialog.open(ImageDialog, {
      //height: '80%',
      //width: '80%',
      data: {
        index: indexOfelement,
        images: this.images,
        titles: this.titles
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
      this.refreshCurrentUserImages.emit(); 
    });
  }
}
