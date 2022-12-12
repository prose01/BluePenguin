import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})

export class ErrorDialog {
  matDialogTitle: string;
  matDialogContent: string;

  constructor(public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.matDialogTitle = data.title;
    this.matDialogContent = data.content;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
