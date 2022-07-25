import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';

import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { ImageModel } from '../../models/imageModel';
import { Profile } from '../../models/profile';

@Component({
  selector: 'profile-images',
  templateUrl: './profile-images.component.html',
  styleUrls: ['./profile-images.component.scss']
})

export class ProfileImagesComponent {

  private randomImagePlace: number;
  private adGroupProfile: number;
  private imageSize: string[] = []

  @Input() profile: Profile;

  constructor(private dialog: MatDialog, private configurationLoader: ConfigurationLoader) {
    this.randomImagePlace = this.configurationLoader.getConfiguration().randomImagePlace;
    this.adGroupProfile = this.configurationLoader.getConfiguration().adGroupProfile;
  }

  ngOnChanges(): void {
    // Add random ad-tile.
    for (let index = 0; index < this.profile.images?.length; index++) {

      // Group list of Images by AdGroupProfile.
      if (index != 0 && index % this.adGroupProfile === 0) {
        // Select random index within group and apply ad-tile.
        var i = this.randomIntFromInterval(index - this.adGroupProfile, index);
        var adImage = new ImageModel;
        adImage.imageId = 'ad';
        this.profile.images?.splice(i, 0, adImage);
      }
    }

    // Set random image size.
    for (var i = 0, len = this.profile.images?.length; i < len; i++) {
      this.imageSize.push(this.randomSize());
    }

    // In case we only have small images set at leas one.
    if (this.profile.images?.length > 0 && !this.imageSize.includes('big')) {
      this.imageSize[this.randomImagePlace] = 'big'
    }
  }

  // Set random tilesize for images.
  private randomSize(): string {
    var randomInt = this.randomIntFromInterval(1, this.randomImagePlace);

    if (randomInt === 1) {
      return 'big';
    }

    return 'small';
  }

  private randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private openImageDialog(indexOfelement: any): void {
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
