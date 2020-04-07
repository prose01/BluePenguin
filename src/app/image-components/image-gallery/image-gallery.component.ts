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

import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';

import { AuthService } from '../../auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';

@Component({
  selector: 'app-imageGallery.',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
})

export class ImageGalleryComponent implements OnInit {
  currentUser: CurrentUser;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  images: any[] = [];
  image: any;

  constructor(public auth: AuthService, private profileService: ProfileService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) { this.getCurrentUserImages() }
      });
    }
  }

  ngAfterContentInit(): void {
    this.setGalleryOptions();

    this.setGalleryImages();
  }

  getCurrentUserImages(): void {
    //this.profileService.getImages().subscribe(images => this.images = images);
    //this.profileService.getImage().subscribe((blob: any) => {
    //  var uints = new Uint8Array(blob);
    //  var base64 = btoa(String.fromCharCode(null, uints[0]));
    //  var url = 'data:image/jpeg;base64,' + base64;
    //  let objectURL = 'data:image/png;base64,' + blob;
    //  this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL)
    //  console.log('hej med dig - ' + url);
    //});

    //this.profileService.getImages().subscribe((blob: any) => {
    //  var uints = new Uint8Array(blob);
    //  var base64 = btoa(String.fromCharCode(null, uints[0]));
    //  var url = 'data:image/jpeg;base64,' + base64;
    //  let objectURL = 'data:image/png;base64,' + blob;
    //  this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL)
    //  console.log('hej med dig - ' + url);
    //});

    this.profileService.getImage().subscribe(image => {
      this.image = 'data:image/png;base64,' + image;

      var fileURL = (window.URL ? URL : webkitURL).createObjectURL(image);
      window.open(fileURL);
    });

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
    //console.log('hej med jer - ' + this.images.length);
    //this.images.forEach(function (value) {
    //  console.log('hej med dig');
    //  //this.galleryImages.push({
    //  //  small: 'https://preview.ibb.co/jrsA6R/img12.jpg',
    //  //  medium: 'https://preview.ibb.co/jrsA6R/img12.jpg',
    //  //  big: 'https://preview.ibb.co/jrsA6R/img12.jpg'
    //  //})
    //});

    this.galleryImages = [
      //{
      //  small: this.image,
      //  medium: this.image,
      //  big: this.image
      //},
      {
        small: 'https://preview.ibb.co/kPE1D6/clouds.jpg',
        medium: 'https://preview.ibb.co/kPE1D6/clouds.jpg',
        big: 'https://preview.ibb.co/kPE1D6/clouds.jpg'
      },
      {
        small: 'https://preview.ibb.co/mwsA6R/img7.jpg',
        medium: 'https://preview.ibb.co/mwsA6R/img7.jpg',
        big: 'https://preview.ibb.co/mwsA6R/img7.jpg'
      }, {
        small: 'https://preview.ibb.co/kZGsLm/img8.jpg',
        medium: 'https://preview.ibb.co/kZGsLm/img8.jpg',
        big: 'https://preview.ibb.co/kZGsLm/img8.jpg'
      },
    ];
  }
}
