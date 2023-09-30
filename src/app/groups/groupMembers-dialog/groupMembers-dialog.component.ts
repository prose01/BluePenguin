import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { Subscription } from 'rxjs';

import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'groupMembers-dialog',
  templateUrl: './groupMembers-dialog.component.html'
})

export class GroupMembersDialog implements OnInit, OnDestroy {
  private pageSize: number;
  public loading: boolean = false;

  public index: number;
  private groupId: string;
  private length: number;

  public dataSource: MatTableDataSource<Profile>;
  private selection = new SelectionModel<Profile>(true, []);

  private subs: Subscription[] = [];

  private profiles: Profile[];
  private currentUserSubject: CurrentUser;
  private displayedColumns: string[] = ['avatar', 'name', 'complain'];

  @Output("getNextGroupMembers") getNextGroupMembers: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private profileService: ProfileService, private imageService: ImageService, private cdr: ChangeDetectorRef, public dialogRef: MatDialogRef<ImageDialog>, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.index = this.data.index;
    this.length = this.data.length;
    this.profiles = new Array;
    this.profiles.push(...this.data.profiles);
    this.groupId = this.data.groupId;

    this.pageSize = this.configurationLoader.getConfiguration().defaultPageSize;

    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );
  }

  ngOnInit(): void {
    this.setDataSource();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private pageChanged(event): void {

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let currentSize = pageSize * pageIndex;

    this.getNextGroupMembers.emit({ currentSize: currentSize, pageIndex: pageIndex, pageSize: pageSize });
  }

  private setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.profiles);

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'avatar.initials': return item.avatar.initials;
        default: return item[property];
      }
    };

    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get sort working.
    this.dataSource.sort = this.sort;
  }

  //resetSelectionPagination(): void {
  //  this.selection?.clear();
  //  if (this.paginator != null) {
  //    this.paginator.pageIndex = 0;
  //    this.paginator.pageSize = this.pageSize;
  //  }
  //}

  private complain(profileId: string): void {
    this.subs.push(
      this.profileService.addComplainToGroupMember(this.groupId, profileId)
        .subscribe({
          next: () => { },
          complete: () => {
            // TODO: Do we need to notify user that a complain has been made. No, if too many complains user is blocked.
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotComplainAboutGroupMember'), null);
          }
        })
    );
  }

  private loadDetailsClick(profile: Profile): void {    
    this.dialogRef.close({
      result: true,
      profile: profile
    });
  }

  private async openImageDialog(profile: Profile): Promise<void> {

    this.getProfileImages(profile);

    const dialogRef = this.dialog.open(ImageDialog, {
      data: {
        index: this.randomIntFromInterval(0, profile.images.length - 1),
        imageModels: profile.images,
        profile: profile
      }
    });

    this.subs.push(
      dialogRef.afterClosed().subscribe(
        res => {
          if (res === true) { this.loadDetailsClick(profile) }
        }
      )
    );
  }

  private getProfileImages(profile: Profile): void {

    if (profile.images != null && profile.images.length > 0) {

      profile.images.forEach((element) => {

        if (typeof element.fileName !== 'undefined') {

          //// TODO: Remove this is-statement when all photos have format
          //if (!element.fileName.includes('.jpeg')) {
          //  element.fileName = element.fileName + '.jpeg'
          //}

          element.image = 'https://freetrail.blob.core.windows.net/photos/' + profile.profileId + '/' + element.fileName
        }

      });
    }
  }

  private randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    });
  }
}
