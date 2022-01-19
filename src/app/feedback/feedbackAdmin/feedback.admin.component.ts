import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ChangeDetectorRef, Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';

import { ErrorDialog } from '../../error-dialog/error-dialog.component';
import { ProfileService } from '../../services/profile.service';
import { FeedBackService } from '../../services/feedback.service';
import { EnumMappingService } from '../../services/enumMapping.service';
import { TranslocoService } from '@ngneat/transloco';
import { FeedbackSearchComponent } from '../feedback-search/feedback-search.component';
import { FeedbackFilter } from '../../models/feedbackFilter';
import { FeedbackDialog } from '../feedback-dialog/feedback-dialog.component';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { Feedback } from '../../models/feedback';

@Component({
  selector: 'feedback-admin',
  templateUrl: './feedback.admin.component.html',
  styleUrls: ['./feedback.admin.component.scss']
})

@AutoUnsubscribe()
export class FeedbackAdminComponent implements OnInit, OnChanges, OnDestroy {

  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

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
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotGetUnassignedFeedbacks'), null); this.loading = false;
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
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotAssignFeedbackToAdmin'), null); this.loading = false;
        },
        () => { }
      );
  }

  /** Toggle Feedback status */
  toggleFeedbackStatus() {

    const openFeedbackIds = new Array;
    const closeFeedbackIds = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {

      var feedback = this.selection.selected[_i];

      if (feedback.open) {
        closeFeedbackIds.push(feedback.feedbackId);
        feedback.open = false;
      }
      else {
        openFeedbackIds.push(feedback.feedbackId);
        feedback.open = true;
      }
    }

    if (openFeedbackIds.length > 0) {
      this.feedBackService.openFeedbacks(openFeedbackIds)
        .pipe(takeWhileAlive(this))
        .subscribe(
          () => { },
          (error: any) => {
            this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotToggleFeedbackStatus'), null); this.loading = false;
          },
          () => { }
        );
    }

    if (closeFeedbackIds.length > 0) {
      this.feedBackService.closeFeedbacks(closeFeedbackIds)
        .pipe(takeWhileAlive(this))
        .subscribe(
          () => { },
          (error: any) => {
            this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotToggleFeedbackStatus'), null); this.loading = false;
          },
          () => { }
        );
    }

    //this.setDataSource();
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
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotGetFeedbacksByFilter'), null); this.loading = false;
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

  // Load Detalails page
  loadDetails(profileId: string) {

    var profile: Profile;

    this.profileService.getProfileById(profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => { profile = response; this.loadProfileDetails.emit(profile); },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotLoadDetails'), null);
        },
        () => { }
      );
  }

  async openFeedbackDialog(feedback: Feedback): Promise<void> {

    const dialogRef = this.dialog.open(FeedbackDialog, {
      data: {
        feedback: feedback
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res === true) {
          this.loadDetails(feedback.fromProfileId)
        }
        else if (res == feedback) {
          let index = this.feedbacks.findIndex(f => f.feedbackId === res.feedbackId);
          this.feedbacks[index].open = res.open;

          this.myAssignedFeedbacks();

        }
      }
    );
  }

  openErrorDialog(title: string, error: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error
      }
    });
  }
}
