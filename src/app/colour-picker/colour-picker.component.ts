import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.css']
})
export class ColourPickerComponent {
  public hue: string;
  public colour: string;

  constructor(public dialogRef: MatDialogRef<ColourPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.colour = data.colour;
  }

  onCloseClick(): void {
    this.dialogRef.close(this.colour);
  }
}
