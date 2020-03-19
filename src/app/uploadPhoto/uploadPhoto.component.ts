import { Component } from '@angular/core';
import { HttpEventType } from '@angular/common/http';

import { AuthService } from './../auth/auth.service';

import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-uploadPhoto',
  templateUrl: './uploadPhoto.component.html',
  styleUrls: ['./uploadPhoto.component.css']
})

export class UploadPhoto {

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(public auth: AuthService, private profileService: ProfileService) { }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      alert('Please only upload an image');
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  onSubmit() {
    const formData = new FormData();

    // chech we only upload images
    var mimeType = this.fileData.type;
    formData.append('files', this.fileData);
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    this.fileUploadProgress = '0%';

    //this.profileService.uploadPhoto(formData)
    //  .subscribe(events => {
    //    if (events.type === HttpEventType.UploadProgress) {
    //      this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
    //      console.log(this.fileUploadProgress);
    //    } else if (events.type === HttpEventType.Response) {
    //      this.fileUploadProgress = '';
    //      console.log(events.body);
    //      alert('Your photo has been uploaded');
    //    }
    //  })
  }
}
