import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'avatar-photo',
  templateUrl: './avatar-photo.component.html',
  styleUrls: ['./avatar-photo.component.scss'],
})
export class AvatarPhotoComponent implements OnInit {
  constructor() { }

  @Input()
  public photoUrl: string;

  @Input()
  public avatarname: string = "Peter";

  public showInitials = false;
  public initials: string;
  public circleColor: string;

  private colors = [
    '#EB7181', // red
    '#468547', // green
    '#FFD558', // yellow
    '#3670B2', // blue
  ];

  ngOnInit() {
    //console.log('photoUrl ' + this.photoUrl);
    //console.log('this.avatarname2 ' + this.avatarname);

    if (!this.photoUrl) {
      //console.log('no photo');
      this.showInitials = true;
      this.createInititals();

      const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
      this.circleColor = this.colors[randomIndex];
    }
    //console.log('showInitials ' + this.showInitials);

  }

  private createInititals(): void {
    let initials = "";
    this.avatarname = "Peter Rose";
    //console.log('this.avatarname ' + this.avatarname);
    for (let i = 0; i < this.avatarname.length; i++) {
      if (this.avatarname.charAt(i) === ' ') {
        continue;
      }

      if (this.avatarname.charAt(i) === this.avatarname.charAt(i).toUpperCase()) {
        initials += this.avatarname.charAt(i);

        if (initials.length == 2) {
          break;
        }
      }
    }
    //console.log('initials ' + initials);

    this.initials = initials;
  }
}
