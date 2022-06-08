import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ImageModel } from '../../models/imageModel';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { DeleteImageDialog } from '../../image-components/delete-image/delete-image-dialog.component';

@Component({
  selector: 'currentUser-images',
  templateUrl: './currentUser-images.component.html',
  styleUrls: ['./currentUser-images.component.scss']
})

export class CurrentUserImagesComponent implements OnDestroy {

  private subs: Subscription[] = [];

  @Input() imageModels: ImageModel[];
  @Input() currentProfileId: string;

  @Output("refreshCurrentUserImages") refreshCurrentUserImages: EventEmitter<any> = new EventEmitter();

  constructor(private dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private openImageDialog(indexOfelement: any): void {

    const dialogRef = this.dialog.open(ImageDialog, {
      data: {
        index: indexOfelement,
        imageModels: this.imageModels,
        currentProfileId: this.currentProfileId
      }
    });
  }

  private openDeleteImageDialog(imageId: string): void {
    const dialogRef = this.dialog.open(DeleteImageDialog, {
      data: { imageId }
    });

    this.subs.push(
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.refreshCurrentUserImages.emit();
          this.imageModels = this.imageModels.filter(function (obj) {
            return obj.imageId !== imageId;
          });
        }
      })
    );
  }
}
