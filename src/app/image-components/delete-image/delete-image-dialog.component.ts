import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { ImageService } from './../../services/image.service';

@Component({
  selector: 'delete-image-dialog',
  templateUrl: './delete-image-dialog.component.html',
  styleUrls: ['./delete-image-dialog.component.scss']
})

export class DeleteImageDialog implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  IsChecked: boolean;
  matDialogTitle: string;
  matDialogContent: string;

  constructor(private imageService: ImageService, public dialogRef: MatDialogRef<DeleteImageDialog>,
    @Inject(MAT_DIALOG_DATA) public imageId: string, private readonly translocoService: TranslocoService) {
  }

  ngOnInit(): void {
    this.subs.push(
      this.translocoService.selectTranslate('ImageDeleteDialogComponent.DeleteImage').subscribe(value => this.matDialogTitle = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('ImageDeleteDialogComponent.CannotBeUndone').subscribe(value => this.matDialogContent = value)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  async onYesClick(): Promise<void> {
    if (this.IsChecked) {

      this.dialogRef.close(true); // TODO: Hack to remove Image from list. If imageService.deleteImagesForCurrentUser fails this should be 'false' but it doesn't work.

      var id = [];
      id.push(this.imageId["imageId"]);

      const reponse = await this.imageService.deleteImagesForCurrentUser(id);
    }
  }

}
