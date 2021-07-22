/*
 * Image cropper for Angular.
 * https://github.com/Mawi137/ngx-image-cropper
 * https://stackblitz.com/edit/image-cropper example code used in this app.
 */


import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';

import { ImageCroppedEvent, ImageTransform } from '../image-cropper/interfaces/index';
import { base64ToFile } from '../image-cropper/utils/blob.utils';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ImageService } from '../../services/image.service';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

@AutoUnsubscribe()
export class ImageUploadComponent {
  uploadImageForm: FormGroup;
  imageChangedEvent: any = '';
  croppedImage: any = null;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  fileUploadProgress: string = null;
  titlePlaceholder: string = "Please insert an image title.";
  uploadingPhoto: boolean = false;
  fileSizeLimit: number;
  imageMaxWidth: number;
  imageMaxHeight: number;

  @Output("toggleDisplay") toggleDisplay: EventEmitter<any> = new EventEmitter();

  constructor(private imageService: ImageService, private formBuilder: FormBuilder, private dialog: MatDialog, private configurationLoader: ConfigurationLoader) {
    this.fileSizeLimit = this.configurationLoader.getConfiguration().fileSizeLimit;
    this.imageMaxWidth = this.configurationLoader.getConfiguration().imageMaxWidth;
    this.imageMaxHeight = this.configurationLoader.getConfiguration().imageMaxHeight;
    this.createForm();
  }

  createForm() {
    this.uploadImageForm = this.formBuilder.group({
      file: null,
      title: [null, [Validators.required, Validators.maxLength(25)]]
    });
  }

  onChange(): void {
    if (this.uploadImageForm.invalid) {
      this.uploadImageForm.setErrors({ ...this.uploadImageForm.errors, 'uploadImageForm': true });

      if (this.uploadImageForm.controls.title.errors.required) {
        this.titlePlaceholder = "Please insert an image title";
      }

      if (this.uploadImageForm.controls.title.errors.maxlength) {
        this.titlePlaceholder = "Title cannot be more than 25 characters long.";
      }
    }
  } 

  fileChangeEvent(event: any): void {
    if (event.target.files[0] != null) {
      let sizeInBytes: number = event.target.files[0].size;

      if (sizeInBytes <= this.fileSizeLimit) {
        this.imageChangedEvent = event;
      }
      else {
        var limitMB = (this.fileSizeLimit / 1000000);
        this.openErrorDialog("Could not upload image", "Image has exceeded the maximum size of " + Math.floor(limitMB) + " MB.");
      }
    }
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
        this.titlePlaceholder = "Title cannot be more than 25 characters long.";
      }

      return;
    }
    else if (this.uploadImageForm.valid) {
      const uploadModel = this.uploadImageForm.value;
      const formData = new FormData();
      const image: any = base64ToFile(this.croppedImage);
      image.lastModifiedDate = new Date();
      image.name = 'tempname';

      this.resizeImage(image, this.imageMaxWidth, this.imageMaxHeight).then(res => {
        formData.append('image', res);
        formData.append('title', uploadModel.title as string);
        this.uploadingPhoto = true;
        this.imageService.uploadImage(formData)
          .pipe(takeWhileAlive(this))
          .subscribe(
            (res) => {
              if (res.status == 200) {
              }
            }, (error: any) => {
              //this.openErrorDialog("Could not save image", error.error);
              this.toggleDisplay.emit();
            },
            () => { this.toggleDisplay.emit(); }
          );
      });
    }    
  }

  // Hack to resize image before upload - https://jsfiddle.net/ascorbic/wn655txt/2/   // TODO: Should not resize if already big enough, and should no make bigger than fileSizeLimit.
  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
        }

        let newWidth;
        let newHeight;

        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }

        let canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        let context = canvas.getContext('2d');

        context.drawImage(image, 0, 0, newWidth, newHeight);

        context.canvas.toBlob(resolve, file.type);
      };
      image.onerror = reject;
    });
  }

  openErrorDialog(title: string, error: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error
      }
    });
  }
}
