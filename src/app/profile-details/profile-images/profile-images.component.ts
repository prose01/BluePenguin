import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';
import { ProfileService } from '../../services/profile.service';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { Profile } from '../../models/profile';

@Component({
  selector: 'profile-images',
  templateUrl: './profile-images.component.html',
  styleUrls: ['./profile-images.component.scss']
})

export class ProfileImagesComponent implements OnInit {
  @Input() profile: Profile;
  @Input() smallImages: any[] = [];
  @Input() images: any[] = [];
  galleryImages: any[] = [];
  imagesTitles: string[] = [];
  defaultImage: any[] = [];

  constructor(public auth: AuthService, private profileService: ProfileService, private dialog: MatDialog) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          setTimeout(() => { this.setSmallGalleryImages(this.smallImages); this.setImageTitles(this.profile); }, 500);     // TODO: Find på noget bedre!
          setTimeout(() => { this.setGalleryImages(this.images); this.setImageTitles(this.profile); }, 1000);     // TODO: Find på noget bedre!
        }
      });
    }
  }

  setSmallGalleryImages(smallImages: any[]): void {
    const pics = [];
    smallImages.forEach(element => pics.push(
      'data:image/jpg;base64,' + element
    ));

    this.defaultImage = pics;
  }

  setGalleryImages(images: any[]): void {
    const pics = [];
    images.forEach(element => pics.push(
        'data:image/jpg;base64,' + element
    ));

    this.galleryImages = pics;
  }

  setImageTitles(profile: Profile): void {
    const imageTitles = [];
    profile.images.forEach(element => imageTitles.push(
      element.title
    ));

    this.imagesTitles = imageTitles;
  }

  openImageDialog(indexOfelement: any): void {
    const dialogRef = this.dialog.open(ImageDialog, {
      //height: '80%',
      //width: '80%',
      data: {
        index: indexOfelement,
        images: this.galleryImages,
        titles: this.imagesTitles
      }
    });
  }
}
