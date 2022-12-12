import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'create-profile-dialog',
  templateUrl: './create-profile-dialog.component.html',
  styleUrls: ['./create-profile-dialog.component.scss']
})

export class CreateProfileDialog {
  private matDialogTitle: string;
  private matDialogContent: string;

  constructor(public dialogRef: MatDialogRef<CreateProfileDialog>) {
  }

  goToDashboardClick(): void {
    this.dialogRef.close(false);
  }

  uploadImageClick(): void {
    this.dialogRef.close(true);
  }
}
