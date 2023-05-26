import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GroupModel } from '../../models/groupModel';
import { ColourPickerComponent } from '../../colour-picker/colour-picker.component';

@Component({
  selector: 'create-group-dialog',
  templateUrl: './create-group-dialog.html'
})

export class CreateGroupDialog implements OnDestroy {

  private subs: Subscription[] = [];
  public group: GroupModel = new GroupModel();
  public groupForm: FormGroup;

  public avatarInitials: string;
  public avatarInitialsColour: string;
  public avatarColour: string;

  constructor(public dialogRef: MatDialogRef<CreateGroupDialog>, private formBuilder: FormBuilder, private dialog: MatDialog, private readonly translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private createForm(): void {
    this.groupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: null,
      avatarInitials: null,
      avatarInitialsColour: '#f07537',
      avatarColour: '#607D8B'
    });
  }

  revert(): void {
    this.createForm();
  }

  private prepareGroup(): GroupModel {
    const formModel = this.groupForm.value;

    var setInitials = formModel.avatarInitials?.trimEnd() as string == "" || formModel.avatarInitials?.trimEnd() as string === undefined ? this.createDefaultInititals(formModel.name?.trimEnd() as string) : formModel.avatarInitials as string;
    var setInitialsColour = formModel.avatarInitialsColour?.trimEnd() as string == "" ? '#f07537' : formModel.avatarInitialsColour?.trimEnd() as string;
    var setCircleColour = formModel.avatarColour?.trimEnd() as string == "" ? '#607D8B' : formModel.avatarColour?.trimEnd() as string;

    const group: GroupModel = {
      groupId: null,
      createdOn: new Date(),
      name: formModel.name?.trimEnd() as string,
      description: formModel.description?.trimEnd() as string,
      avatar: {
        initials: setInitials,
        initialsColour: this.avatarInitialsColour,
        circleColour: this.avatarColour
      },
      countrycode: null,
      groupMemberslist: null
    };

    return group;
  }

  onSubmit(): void {
    this.group = this.prepareGroup();
    this.dialogRef.close(this.group)
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  selectAvatarColours(colourType: string): void {
    const dialogRef = this.dialog.open(ColourPickerComponent, {
      data: {
        colour: colourType == 'circleColour' ? this.avatarColour : this.avatarInitialsColour
      }
    });

    this.subs.push(
      dialogRef.afterClosed().subscribe(
        res => {
          if (res) {
            if (colourType == 'circleColour') {
              this.avatarColour = res;
            }
            else {
              this.avatarInitialsColour = res;
            }
            this.groupForm.markAsDirty();
          }
        }
      )
    );
  }

  private createDefaultInititals(name: string): string {
    let initials = "";

    initials += name.charAt(0).toUpperCase();

    var randomChar = this.randomIntFromInterval(1, name.length)

    initials += name.charAt(randomChar).toUpperCase();

    return initials;
  }

  private randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
