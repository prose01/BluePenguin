import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';
import { ProfileService } from '../../services/profile.service';
import { ProfileImageDialog } from '../../profile-details/profile-image-dialog/profile-image-dialog.component';
import { Profile } from '../../models/profile';

@Component({
  selector: 'profile-images',
  templateUrl: './profile-images.component.html',
  styleUrls: ['./profile-images.component.scss']
})

export class ProfileImagesComponent implements OnInit {
  @Input() profile: Profile;
  @Input() images: any[] = [];
  galleryImages: any[] = [];
  imagesTitles: string[] = [];

  constructor(public auth: AuthService, private profileService: ProfileService, private dialog: MatDialog) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.setGalleryImages();
          setTimeout(() => { this.setImageTitles(); }, 1000);     // TODO: Find på noget bedre!
        }
      });
    }
  }

  setGalleryImages(): void {
    const pics = [];
    this.images.forEach(element => pics.push(
        'data:image/png;base64,' + element
    ));

    this.galleryImages = pics;
  }

  setImageTitles(): void {
    const imageTitles = [];
    this.profile.images.forEach(element => imageTitles.push(
      element.title
    ));

    this.imagesTitles = imageTitles;
  }

  openProfileImageDialog(indexOfelement: any): void {
    const dialogRef = this.dialog.open(ProfileImageDialog, {
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
