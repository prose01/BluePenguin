import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'group-description-dialog',
  templateUrl: './group-description-dialog.html'
})

export class GroupDescriptionDialog {
  matDialogTitle: string;
  matDialogContent: string;
  joined: boolean;

  constructor(public dialogRef: MatDialogRef<GroupDescriptionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.matDialogTitle = this.data.group.name;
    this.matDialogContent = this.data.group.description;
    this.joined = this.data.joinedGroup;
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  toggleGroupJoin(): void {
    this.dialogRef.close(true);
  }
}
