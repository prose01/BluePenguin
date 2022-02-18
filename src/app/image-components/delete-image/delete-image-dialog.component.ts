import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';

import { ImageService } from './../../services/image.service';

@Component({
  selector: 'delete-image-dialog',
  templateUrl: './delete-image-dialog.component.html',
  styleUrls: ['./delete-image-dialog.component.scss']
})

export class DeleteImageDialog implements OnInit {
  IsChecked: boolean;
  matDialogTitle: string;
  matDialogContent: string;

  constructor(private imageService: ImageService, public dialogRef: MatDialogRef<DeleteImageDialog>,
    @Inject(MAT_DIALOG_DATA) public imageId: string, private readonly translocoService: TranslocoService) {
  }

  ngOnInit() {
    this.translocoService.selectTranslate('ImageDeleteDialogComponent.DeleteImage').subscribe(value => this.matDialogTitle = value);
    this.translocoService.selectTranslate('ImageDeleteDialogComponent.CannotBeUndone').subscribe(value => this.matDialogContent = value);
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
