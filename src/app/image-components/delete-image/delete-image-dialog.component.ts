import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from './../../authorisation/auth/auth.service';

import { ProfileService } from './../../services/profile.service';
import { ImageService } from './../../services/image.service';

@Component({
  selector: 'delete-image-dialog',
  templateUrl: './delete-image-dialog.component.html'
})

export class DeleteImageDialog {
  IsChecked: boolean;
  matDialogTitle: string;
  matDialogContent: string;

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService,
    public dialogRef: MatDialogRef<DeleteImageDialog>,
    @Inject(MAT_DIALOG_DATA) public imageId: string) {

    this.matDialogTitle = 'Do you want to delete this image?';
    this.matDialogContent = 'This will delete the image and cannot be undone.';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    if (this.IsChecked) {
      var id = [];
      id.push(this.imageId["imageId"]); // TODO: Fix this. Hack to get post to work.

      // TODO: Fix this. Hack to get delete to update currentUser. It calls it even on errror.
      this.imageService.deleteImagesForCurrentUser(id).subscribe(() => { },
        () => { this.profileService.updateCurrentUserSubject(); },
        () => { this.profileService.updateCurrentUserSubject(); });
    }
  }

}
