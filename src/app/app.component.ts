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

  isAbout = false;

  selectedOrderBy = OrderByType.CreatedOn;

  matButtonOrderByText: string;
  matButtonOrderByIcon: string = 'watch_later';
  orderByButtonCounter: number = 0;

  profile: Profile;
  filter: ProfileFilter;
  lastCalledFilter: string = "getLatestProfiles";

  siteLocale: string = getBrowserLang();
  languageList: Array<any>;

  allText: string;
  mySearchFilterText: string;
  bookmarksText: string;
  visitedMeText: string;
  bookmarkedMeText: string;
  likesMeText: string;
  searchText: string;
  resetText: string;
  saveSearchFilterText: string;
  loadSearchFilterText: string;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  constructor(public auth: AuthService, private profileService: ProfileService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    auth.handleAuthentication();
    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });

    this.languageList = this.configurationLoader.getConfiguration().languageList;

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }

    this.initiateTransloco();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  initiateTransloco() {
    this.translocoService.selectTranslate('All').subscribe(value => this.allText = value);
    this.translocoService.selectTranslate('MySearchFilter').subscribe(value => this.mySearchFilterText = value);
    this.translocoService.selectTranslate('Bookmarks').subscribe(value => this.bookmarksText = value);
    this.translocoService.selectTranslate('VisitedMe').subscribe(value => this.visitedMeText = value);
    this.translocoService.selectTranslate('BookmarkedMe').subscribe(value => this.bookmarkedMeText = value);
    this.translocoService.selectTranslate('LikesMe').subscribe(value => this.likesMeText = value);
    this.translocoService.selectTranslate('Search').subscribe(value => this.searchText = value);
    this.translocoService.selectTranslate('Reset').subscribe(value => this.resetText = value);
    this.translocoService.selectTranslate('SaveSearchFilter').subscribe(value => this.saveSearchFilterText = value);
    this.translocoService.selectTranslate('LoadSearchFilter').subscribe(value => this.loadSearchFilterText = value);
    this.translocoService.selectTranslate('Search').subscribe(value => this.matButtonToggleText = value);
    this.translocoService.selectTranslate('ListView').subscribe(value => this.matButtonViewToggleText = value);
    this.translocoService.selectTranslate('SortByLastActive').subscribe(value => this.matButtonOrderByText = value);
  }

  switchLanguage() {
    this.translocoService.setActiveLang(this.siteLocale);
  }

  toggleDisplay() {
    if (this.pageView == pageViewEnum.Edit || this.pageView == pageViewEnum.About || this.pageView == pageViewEnum.Details) {
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
    switch (this.orderByButtonCounter) {
      case 0: {
        this.matButtonOrderByText = this.translocoService.translate('SortByUpdatedOn');
        this.matButtonOrderByIcon = 'update';
        this.selectedOrderBy = OrderByType.LastActive;
        this.orderByButtonCounter++;
        this.callApiWithNewSelectedOrderBy();
        break;
      }
      case 1: {
        this.matButtonOrderByText = this.translocoService.translate('SortByCreatedOn');
        this.matButtonOrderByIcon = 'schedule';
        this.selectedOrderBy = OrderByType.UpdatedOn;
        this.orderByButtonCounter++;
        this.callApiWithNewSelectedOrderBy();
        break;
      }
      case 2: {
        this.matButtonOrderByText = this.translocoService.translate('SortByLastActive');
        this.matButtonOrderByIcon = 'watch_later';
        this.selectedOrderBy = OrderByType.CreatedOn;
        this.orderByButtonCounter = 0;
        this.callApiWithNewSelectedOrderBy();
        break;
      }
    }
  }

  callApiWithNewSelectedOrderBy() {
    switch (this.lastCalledFilter) {
      case "getLatestProfiles": {
        this.getLatestProfiles();
        break;
      }
      case "getProfileByCurrentUsersFilter": {
        this.getProfileByCurrentUsersFilter() 
        break;
      }
      case "getBookmarkedProfiles": {
        this.getBookmarkedProfiles()
        break;
      }
      case "getProfileByFilter": {  
        this.getProfileByFilter(null, true)
        break;
      }
      case "getProfilesWhoVisitedMe": {
        this.getProfilesWhoVisitedMe()
        break;
      }
      case "getProfilesWhoBookmarkedMe": {
        this.getProfilesWhoBookmarkedMe()
        break;
      }
      case "getProfilesWhoLikesMe": {
        this.getProfilesWhoLikesMe()
        break;
      }
    }
  }

  // Calls to DashboardComponent
  getLatestProfiles() {
    this.lastCalledFilter = "getLatestProfiles"
    this.dashboardComponent.getLatestProfiles(this.selectedOrderBy);
  }

  getProfileByCurrentUsersFilter() {
    this.lastCalledFilter = "getProfileByCurrentUsersFilter"
    this.dashboardComponent.getProfileByCurrentUsersFilter(this.selectedOrderBy);
  }

  getBookmarkedProfiles() {
    this.lastCalledFilter = "getBookmarkedProfiles"
    this.dashboardComponent.getBookmarkedProfiles(this.selectedOrderBy);
  }

  getProfileByFilter($event, newOrderBy: boolean) {
    this.lastCalledFilter = "getProfileByFilter";
    if (!newOrderBy) {
      this.filter = $event;
    }
    this.dashboardComponent.getProfileByFilter(this.filter, this.selectedOrderBy);
    this.toggleDisplay();
  }

  getProfilesWhoVisitedMe() {
    this.lastCalledFilter = "getProfilesWhoVisitedMe"
    this.dashboardComponent.getProfilesWhoVisitedMe(this.selectedOrderBy);
  }

  getProfilesWhoBookmarkedMe() {
    this.lastCalledFilter = "getProfilesWhoBookmarkedMe"
    this.dashboardComponent.getProfilesWhoBookmarkedMe(this.selectedOrderBy);
  }

  getProfilesWhoLikesMe() {
    this.lastCalledFilter = "getProfilesWhoLikesMe"
    this.dashboardComponent.getProfilesWhoLikesMe(this.selectedOrderBy);
  }

  resetSelectionPagination() {
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

  isCurrentUserCreated(isCreated: boolean) {
    this.isProfileCreated = isCreated;

    if (isCreated) {
      this.pageView = pageViewEnum.Dashboard;
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
  "About" = "About"
}
