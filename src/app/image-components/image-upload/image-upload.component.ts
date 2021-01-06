/*
 * Image cropper for Angular.
 * https://github.com/Mawi137/ngx-image-cropper
 * https://stackblitz.com/edit/image-cropper example code used in this app.
 */


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ImageCroppedEvent, ImageTransform } from '../image-cropper/interfaces/index';
import { base64ToFile } from '../image-cropper/utils/blob.utils';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

@AutoUnsubscribe()
export class ImageUploadComponent {
  uploadImageForm: FormGroup;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  fileUploadProgress: string = null;
  titlePlaceholder: string = "Please insert an image title.";

  constructor(public auth: AuthService, private imageService: ImageService, private router: Router, private formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.uploadImageForm = this.formBuilder.group({
      file: null,
      title: [null, [Validators.required, Validators.maxLength(20)]]
    });
  }

  onChange(): void {
    if (this.uploadImageForm.invalid) {
      this.uploadImageForm.setErrors({ ...this.uploadImageForm.errors, 'uploadImageForm': true });

      if (this.uploadImageForm.controls.title.errors.required) {
        this.titlePlaceholder = "Please insert an image title";
      }

      if (this.uploadImageForm.controls.title.errors.maxlength) {
        this.titlePlaceholder = "Title cannot be more than 20 characters long.";
      }
    }
  } 

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  loadImageFailed() {
    //console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  onSubmit() {
    if (this.uploadImageForm.invalid) {
      this.uploadImageForm.setErrors({ ...this.uploadImageForm.errors, 'uploadImageForm': true });

      if (this.uploadImageForm.controls.title.errors.required) {
        this.titlePlaceholder = "Please insert an image title";
      }

      if (this.uploadImageForm.controls.title.errors.maxlength) {
        this.titlePlaceholder = "Title cannot be more than 20 characters long.";
      }

      return;
    }
    else if (this.uploadImageForm.valid) {
      const uploadModel = this.uploadImageForm.value;
      const formData = new FormData();
      formData.append('image', base64ToFile(this.croppedImage));
      formData.append('title', uploadModel.title as string);

      this.imageService.uploadImage(formData).pipe(takeWhileAlive(this)).subscribe(() => { }, () => { this.router.navigate(['/imagesboard']); }, () => { this.router.navigate(['/imagesboard']); });
    }

    //setTimeout(() => { this.router.navigate(['/imagesboard']); }, 500);
    
  }
}
