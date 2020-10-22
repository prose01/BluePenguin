/*
 * @kolkov/ngx-gallery image gallery for Angular.
 * https://www.npmjs.com/package/@kolkov/ngx-gallery This is the version used here.
 * https://stackblitz.com/edit/kolkov-ngx-gallery Stackblitz example.
 *
 * This library is being fully rewritten for next Angular versions from original abandoned library written by Łukasz Gałka.
 * Kolkov maintain full compatibility with the original library at the api level. https://github.com/lukasz-galka/ngx-gallery
 *
 * Der skal findes en løsning på brugen af fontawesome.com i HTML-filen. Det holder simpelthen ikke!!!!
 * 
 */

import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-imageGallery.',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
})

export class ImageGalleryComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  images: any[] = [];

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) { this.getProfileImages() }
      });
    }
  }

  ngAfterContentInit(): void {
    setTimeout(() => { this.setGalleryOptions(); this.setGalleryImages(); }, 2000);  // Find på noget bedre end at vente 2 sek.
  }

  getProfileImages(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.imageService.getProfileImages(params.get('profileId'))))
      .subscribe(images => this.images = images); 
  }

  setGalleryOptions(): void {
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        arrowPrevIcon: 'fa fa-chevron-left',
        arrowNextIcon: 'fa fa-chevron-right',
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
  }

  setGalleryImages(): void {
    const pics = [];
    this.images.forEach(element => pics.push(
      {
        small: 'data:image/png;base64,' + element,
        medium: 'data:image/png;base64,' + element,
        big: 'data:image/png;base64,' + element
      }
    ));

    this.galleryImages = pics;
  }
}
