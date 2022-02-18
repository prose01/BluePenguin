import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ConfigurationLoader } from './configuration/configuration-loader.service';
import { TranslocoService, getBrowserLang } from '@ngneat/transloco';

import { AuthService } from './authorisation/auth/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CurrentUser } from './models/currentUser';
import { OrderByType } from './models/enums';
import { Profile } from './models/profile';
import { ProfileFilter } from './models/profileFilter';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { ProfileService } from './services/profile.service';
import { EnumMappingService } from './services/enumMapping.service';
import { ViewFilterTypeEnum } from './models/viewFilterTypeEnum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(DashboardComponent) dashboardComponent: DashboardComponent;
  @ViewChild(ProfileSearchComponent) profileSearchComponent: ProfileSearchComponent;

  title = 'PlusOne';
  currentUserSubject: CurrentUser;
  isProfileCreated: boolean = false;

  useChat = false; // Get from Config! Turns off Chat :)

  pageView: pageViewEnum = pageViewEnum.Dashboard;
  matButtonToggleText: string;
  matButtonToggleIcon: string = 'search';

  isTileView = true;
  matButtonViewToggleText: string;
  matButtonViewToggleIcon: string = 'line_style';

  matButtonOrderByText: string;
  matButtonOrderByIcon: string = 'watch_later';
  orderBy: OrderByType = OrderByType.LastActive;

  viewFilterType: ViewFilterTypeEnum = ViewFilterTypeEnum.LatestProfiles;

  profile: Profile;
  filter: ProfileFilter;
  lastCalledFilter: string = "getLatestProfiles";
  pageSize: number;

  siteLocale: string = getBrowserLang();
  languageList: Array<any>;

  isAdmin: boolean = false;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  //fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  constructor(public auth: AuthService, private enumMappings: EnumMappingService, private profileService: ProfileService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    auth.handleAuthentication();
    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });

    this.languageList = this.configurationLoader.getConfiguration().languageList;

    this.pageSize = this.configurationLoader.getConfiguration().defaultPageSize;

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }

    this.initiateTransloco();

    setTimeout(() => { this.isAdmin = this.currentUserSubject?.admin; }, 5000);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  initiateTransloco() {
    this.translocoService.selectTranslate('Search').subscribe(value => this.matButtonToggleText = value);
    this.translocoService.selectTranslate('ListView').subscribe(value => this.matButtonViewToggleText = value);
    this.translocoService.selectTranslate('SortByLastActive').subscribe(value => this.matButtonOrderByText = value);
  }

  switchLanguage() {
    this.translocoService.setActiveLang(this.siteLocale);
    // TranslocoService needs to finsh first before we can update.
    setTimeout(() => {
      this.enumMappings.updateClotheStyleTypeSubject();
      this.enumMappings.updateBodyTypeSubject();
      this.enumMappings.updateBodyArtTypeSubject();
      this.enumMappings.updateEatingHabitsTypeSubject();
      this.enumMappings.updateEducationStatusTypeSubject();
      this.enumMappings.updateEducationTypeSubject();
      this.enumMappings.updateEmploymentStatusTypeSubject();
      this.enumMappings.updateHasChildrenTypeSubject();
      this.enumMappings.updateWantChildrenTypeSubject();
      this.enumMappings.updateHasPetsTypeSubject();
      this.enumMappings.updateLivesInTypeSubject();
      this.enumMappings.updateSmokingHabitsTypeSubject();
      this.enumMappings.updateSportsActivityTypeSubject();
    }, 50);    
  }

  toggleDisplay() {
    if (this.pageView == pageViewEnum.Edit || this.pageView == pageViewEnum.About || this.pageView == pageViewEnum.Feedback || this.pageView == pageViewEnum.Details) {
      this.pageView = pageViewEnum.Dashboard;
      this.matButtonToggleText = this.translocoService.translate('Search');
      this.matButtonToggleIcon = 'search';
      this.sidenav.toggle();
    }
    else {
      this.pageView = (this.pageView == pageViewEnum.Dashboard ? pageViewEnum.Search : pageViewEnum.Dashboard);
      this.matButtonToggleText = (this.pageView == pageViewEnum.Dashboard ? this.translocoService.translate('Search') : this.translocoService.translate('Dashboard'));
      this.matButtonToggleIcon = (this.pageView == pageViewEnum.Dashboard ? 'search' : 'dashboard');
    }
  }

  toggleViewDisplay() {
    this.isTileView = !this.isTileView;
    this.matButtonViewToggleText = (this.isTileView ? this.translocoService.translate('ListView') : this.translocoService.translate('TileView'));
    this.matButtonViewToggleIcon = (this.isTileView ? 'line_style' : 'collections');
    this.dashboardComponent.toggleViewDisplay();
  }

  toggleOrderBy() {
    switch (this.orderBy) {
      case OrderByType.CreatedOn: {
        this.matButtonOrderByText = this.translocoService.translate('SortByUpdatedOn');
        this.matButtonOrderByIcon = 'update';
        this.orderBy = OrderByType.LastActive;
        this.getNextData();
        break;
      }
      case OrderByType.LastActive: {
        this.matButtonOrderByText = this.translocoService.translate('SortByCreatedOn');
        this.matButtonOrderByIcon = 'schedule';
        this.orderBy = OrderByType.UpdatedOn;
        this.getNextData();
        break;
      }
      case OrderByType.UpdatedOn: {
        this.matButtonOrderByText = this.translocoService.translate('SortByLastActive');
        this.matButtonOrderByIcon = 'watch_later';
        this.orderBy = OrderByType.CreatedOn;
        this.getNextData();
        break;
      }
    }
  }

  getNextData() {
    this.dashboardComponent.getNextData(this.orderBy, this.viewFilterType, { currentSize: 0, pageIndex: 0, pageSize: this.pageSize });
  }

  // Calls to DashboardComponent
  getLatestProfiles() {
    this.viewFilterType = ViewFilterTypeEnum.LatestProfiles;
    this.getNextData();
  }

  getProfileByCurrentUsersFilter() {
    this.viewFilterType = ViewFilterTypeEnum.FilterProfiles;
    this.getNextData();
  }

  getBookmarkedProfiles() {
    this.viewFilterType = ViewFilterTypeEnum.BookmarkedProfiles;
    this.getNextData();
  }

  getProfileByFilter() {
    this.viewFilterType = ViewFilterTypeEnum.ProfilesSearch;
    this.getNextData();
    this.toggleDisplay();
  }

  getProfilesWhoVisitedMe() {
    this.viewFilterType = ViewFilterTypeEnum.ProfilesWhoVisitedMe;
    this.getNextData();
  }

  getProfilesWhoBookmarkedMe() {
    this.viewFilterType = ViewFilterTypeEnum.ProfilesWhoBookmarkedMe;
    this.getNextData();
  }

  getProfilesWhoLikesMe() {
    this.viewFilterType = ViewFilterTypeEnum.ProfilesWhoLikesMe;
    this.getNextData();
  }

  resetSelectionPagination() {    //Todo: Check if this is used
    if (!this.isTileView) {
      this.dashboardComponent?.resetSelectionPagination();
    }
  }

  // Calls to ProfileSearchComponent
  onSubmit() {
    this.profileSearchComponent.onSubmit();
    this.sidenav.toggle();
  }

  reset() {
    this.profileSearchComponent.reset();
  }

  saveSearch() {
    this.profileSearchComponent.saveSearch();
  }

  loadSearch() {
    this.profileSearchComponent.loadSearch();
  }

  isCurrentUserCreated(event) {
    this.isProfileCreated = event.isCreated;

    if (event.isCreated) {
      this.pageView = pageViewEnum.Dashboard;
      this.siteLocale = event.languagecode;
      this.switchLanguage();
    }
  }

  initDefaultData() {
    this.dashboardComponent.initDefaultData();
  }

  // Load About page
  loadAbout() {
    if (this.pageView != pageViewEnum.About) {
      this.pageView = pageViewEnum.About;
    }
    else {
      this.pageView = pageViewEnum.Dashboard;
      this.matButtonToggleText = this.translocoService.translate('Search');
      this.matButtonToggleIcon = 'search';
    }

    if (this.sidenav.opened) {
      this.sidenav.toggle();
    }
  }

  // Load Edit page
  loadEdit() {
    if (this.pageView != pageViewEnum.Edit) {
      this.pageView = pageViewEnum.Edit;
    }
    else {
      this.pageView = pageViewEnum.Dashboard;
      this.matButtonToggleText = this.translocoService.translate('Search');
      this.matButtonToggleIcon = 'search';
    }

    if (this.sidenav.opened) {
      this.sidenav.toggle();
    }
  }

  // Load Feedback page
  loadFeedback() {
    if (this.pageView != pageViewEnum.Feedback) {
      this.pageView = pageViewEnum.Feedback;
    }
    else {
      this.pageView = pageViewEnum.Dashboard;
      this.matButtonToggleText = this.translocoService.translate('Search');
      this.matButtonToggleIcon = 'search';
    }

    if (this.sidenav.opened) {
      this.sidenav.toggle();
    }
  }

  // Load Feedback Admin page
  loadFeedbackAdmin() {
    if (this.pageView != pageViewEnum.FeedbackAdmin) {
      this.pageView = pageViewEnum.FeedbackAdmin;
    }
    else {
      this.pageView = pageViewEnum.Dashboard;
      this.toggleViewDisplay();
      this.matButtonToggleText = this.translocoService.translate('Search');
      this.matButtonToggleIcon = 'search';
    }

    if (this.sidenav.opened) {
      this.sidenav.toggle();
    }
  }

  loadDashboard() {
    this.pageView = pageViewEnum.Dashboard;
    this.matButtonToggleText = this.translocoService.translate('Search');
    this.matButtonToggleIcon = 'search';
  }

  // Load Details page
  loadDetails(profile: Profile) {
    this.profileService.addVisitedToProfiles(profile.profileId).subscribe(() => { });
    this.profile = profile;
    this.pageView = pageViewEnum.Details;
    this.matButtonToggleText = this.translocoService.translate('Dashboard');
    this.matButtonToggleIcon = 'dashboard';
  }

}

  /* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("navbar").style.top = "0";
    } else {
      document.getElementById("navbar").style.top = "-100px";
    }
    prevScrollpos = currentScrollPos;
  }

export enum pageViewEnum {
  "Dashboard" = "Dashboard",
  "Search" = "Search",
  "Create" = "Create",
  "Edit" = "Edit",
  "Details" = "Details",
  "About" = "About",
  "Feedback" = "Feedback",
  "FeedbackAdmin" = "FeedbackAdmin"
}
