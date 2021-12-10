import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';

import { Feedback } from '../../models/feedback';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

import { ProfileService } from '../../services/profile.service';
import { FeedBackService } from '../../services/feedback.service';
import { EnumMappingService } from '../../services/enumMapping.service';
import { TranslocoService } from '@ngneat/transloco';
import { FeedbackSearchComponent } from '../feedback-search/feedback-search.component';
import { FeedbackFilter } from '../../models/feedbackFilter';
import { CurrentUser } from '../../models/currentUser';
import { FeedbackType } from '../../models/feedbackType';

@Component({
  selector: 'feedback-admin',
  templateUrl: './feedback.admin.component.html',
  styleUrls: ['./feedback.admin.component.scss']
})

@AutoUnsubscribe()
export class FeedbackAdminComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(FeedbackSearchComponent) feedbackSearchComponent: FeedbackSearchComponent;

  loading: boolean = false;
  noFeedbacks: boolean = false;

  currentUserSubject: CurrentUser;

  allowAssignment: boolean = false;

  pageSearch: string = "list";
  matButtonToggleSearchText: string = 'Search';
  matButtonToggleSearchIcon: string = 'search';
  pageView: string = "assignment";
  matButtonToggleAllText: string;
  matButtonToggleAllIcon: string = 'assignment_ind';

  openChecked = true;
  languageChecked = false;

  feedbacks: Feedback[] = new Array;

  dataSource: MatTableDataSource<Feedback>;
  selection = new SelectionModel<Feedback>(true, []);

  displayedColumns: string[] = ['select', 'dateSent', 'dateSeen', 'fromName', 'adminName', 'feedbackType', 'message', 'open', 'countrycode', 'languagecode'];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private enumMappings: EnumMappingService, private feedBackService: FeedBackService, private profileService: ProfileService, private cdr: ChangeDetectorRef, private dialog: MatDialog, media: MediaMatcher, private readonly translocoService: TranslocoService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => cdr.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.selection.changed.subscribe(item => {
      this.allowAssignment = this.selection.selected.length > 0;
    })
  }

  ngOnInit(): void {
    this.loading = true;
    
    this.getUnassignedFeedbacks();

    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });
    this.translocoService.selectTranslate('FeedbackAdminComponent.MyAssignedFeedbacks').subscribe(value => this.matButtonToggleAllText = value);
  }

  ngOnChanges(): void {

    this.feedbacks = this.feedbacks?.filter(function (el) {
      return el != null;
    });

    this.feedbacks?.length <= 0 ? this.noFeedbacks = true : this.noFeedbacks = false;

    this.setDataSource();

    this.loading = false;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.feedbacks);
    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get pagination & sort working.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    //const numSelected = this.selection.selected.length;
    //const numRows = this.dataSource.data.length > 1 ? this.dataSource.data.length - 1 : this.dataSource.data.length;
    ////this.allowAssignment = numSelected > 0 ? true : false;
    //return numSelected === numRows;
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {    
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  toggleDisplay() {
    this.pageSearch = (this.pageSearch == 'list' ? 'search' : 'list');
    this.matButtonToggleSearchText = (this.pageSearch == 'list' ? this.translocoService.translate('Search') : this.translocoService.translate('ListView'));
    this.matButtonToggleSearchIcon = (this.pageSearch == 'list' ? 'search' : 'list');
  }

  toggleAllDisplay() {
    this.pageView = (this.pageView == 'all' ? 'assignment' : 'all');
    this.matButtonToggleAllText = (this.pageView == 'all' ? this.translocoService.translate('All') : this.translocoService.translate('FeedbackAdminComponent.MyAssignedFeedbacks'));
    this.matButtonToggleAllIcon = (this.pageView == 'all' ? 'apps' : 'assignment_ind');

    this.pageView == 'all' ? this.myAssignedFeedbacks() : this.getUnassignedFeedbacks();
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Feedback): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`; // TODO: row ${row} needs an id.
  }

  selcetedFeedbackIds(): Feedback[] {
    let ids = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      ids.push(this.selection.selected[_i].feedbackId);
    }

    return ids;
  }

  getUnassignedFeedbacks() {

    var countrycode: string = '';
    var languagecode: string = '';

    if (this.languageChecked) {
      countrycode = this.currentUserSubject.countrycode;
      languagecode = this.currentUserSubject.languagecode;
    }

    this.feedBackService.getUnassignedFeedbacks(countrycode, languagecode)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {
          this.feedbacks = new Array;

          this.feedbacks.push(...response);
        },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotSendFeedback'), null); this.loading = false;
        },
        () => {
          this.ngOnChanges();
        }
      );
  }

  /** Assign Feedback To Admin */
  assignFeedbackToAdmin() {
    this.feedBackService.assignFeedbackToAdmin(this.selcetedFeedbackIds())
      .pipe(takeWhileAlive(this))
      .subscribe(
        () => { },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotSendFeedback'), null); this.loading = false;
        },
        () => { }
      );
  }

  myAssignedFeedbacks() {
    const filterFeedback: FeedbackFilter = {

      feedbackId: null,
      dateSentStart: null,
      dateSentEnd: null,
      dateSeenStart: null,
      dateSeenEnd: null,
      fromProfileId: null,
      fromName: null,
      adminProfileId: this.currentUserSubject.profileId,
      adminName: this.currentUserSubject.name,
      feedbackType: null,
      message: null,
      open: this.openChecked,
      countrycode: null,
      languagecode: null
    };

    this.getFeedbacksByFilter(filterFeedback);

    //this.feedBackService.getFeedbacksByFilter(filterFeedback)
    //  .pipe(takeWhileAlive(this))
    //  .subscribe(
    //    (response: any) => {
    //      this.feedbacks = new Array;

    //      this.feedbacks.push(...response);
    //    },
    //    (error: any) => {
    //      this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotSendFeedback'), null); this.loading = false;
    //    },
    //    () => {
    //      this.ngOnChanges();
    //    }
    //  );
  }

  /** Get Feedbacks By Filter */
  getFeedbacksByFilter($event) {
    this.feedBackService.getFeedbacksByFilter($event)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {
          this.feedbacks = new Array;

          this.feedbacks.push(...response);

          this.ngOnChanges();
        },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotSendFeedback'), null); this.loading = false;
        },
        () => { }
      );
  }

  // Calls to ProfileSearchComponent
  onSubmit() {
    this.feedbackSearchComponent.onSubmit();
    this.toggleDisplay();
    this.sidenav.toggle();
  }

  reset() {
    this.feedbackSearchComponent.reset();
  }

  //// Load Detalails page
  //loadDetails(profile: Profile) {                               // TODO: Load Profile details.
  //  this.loadProfileDetails.emit(profile);
  //}

  //async openImageDialog(profile: Profile): Promise<void> {      // TODO: Open feedback dialog.

  //  this.getProfileImages(profile);

  //  const dialogRef = this.dialog.open(ImageDialog, {
  //    data: {
  //      index: profile.imageNumber,
  //      imageModels: profile.images,
  //      profile: profile
  //    }
  //  });

  //  dialogRef.afterClosed().subscribe(
  //    res => {
  //      if (res === true) { this.loadDetails(profile) }
  //    }
  //  );
  //}

  openErrorDialog(title: string, error: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error
      }
    });
  }
}