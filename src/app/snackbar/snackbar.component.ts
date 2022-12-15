import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() { }

  get getIcon() {
    switch (this.data.snackType) {
      case 'success':
        return { type: this.data.snackType, icon: 'check_circle' };
      case 'error':
        return { type: this.data.snackType, icon: 'error' };
      case 'warn':
        return { type: this.data.snackType, icon: 'warning' };
      case 'info':
        return { type: this.data.snackType, icon: 'info' };
    }
  }

  closeSnackbar() {
    this.data.snackBar.dismiss();
  }
}
