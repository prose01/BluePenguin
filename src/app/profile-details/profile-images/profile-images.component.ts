import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { Profile } from '../../models/profile';

@Component({
  selector: 'profile-images',
  templateUrl: './profile-images.component.html',
  styleUrls: ['./profile-images.component.scss']
})

export class ProfileImagesComponent {

  @Input() profile: Profile;

  constructor(private dialog: MatDialog) { }

  openImageDialog(indexOfelement: any): void {
    const dialogRef = this.dialog.open(ImageDialog, {
      //height: '80%',
      //width: '80%',
      data: {
        index: indexOfelement,
        imageModels: this.profile.images,
        profile: this.profile
      }
    });
  }
}
