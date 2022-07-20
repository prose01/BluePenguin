import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
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

  private adGroupProfile: number;
  private _imageModels: ImageModel[];
  private subs: Subscription[] = [];

  @Input() currentProfileId: string;
  @Input() set imageModels(values: ImageModel[]) {
    this._imageModels = values;
    this.addRandomAdTile();
  }
  get imageModels(): ImageModel[] {
    return this._imageModels;
  }

  @Output("refreshCurrentUserImages") refreshCurrentUserImages: EventEmitter<any> = new EventEmitter();

  constructor(private dialog: MatDialog, private configurationLoader: ConfigurationLoader) {
    this.adGroupProfile = this.configurationLoader.getConfiguration().adGroupProfile;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private addRandomAdTile(): void {
    // Add random ad-tile.
    for (let index = 0; index < this.imageModels?.length; index++) {

      // Group list of Images by AdGroupProfile.
      if (index != 0 && index % this.adGroupProfile === 0) {
        // Select random index within group and apply ad-tile.
        var i = this.randomIntFromInterval(index - this.adGroupProfile, index);
        var adImage = new ImageModel;
        adImage.imageId = 'ad';
        this.imageModels?.splice(i, 0, adImage);
      }
    }
  }

  private randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
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
          // Not ideal timeout, but it can take time for Artemis to call Avalon to update CurrenUser.
          setTimeout(() => { this.refreshCurrentUserImages.emit(); }, 500);
        }
      })
    );
  }
}
