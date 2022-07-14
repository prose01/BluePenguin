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

  adGroupProfile: number;

  @Input() profile: Profile;

  constructor(private dialog: MatDialog, private configurationLoader: ConfigurationLoader) {
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
