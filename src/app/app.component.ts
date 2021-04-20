import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

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

  useChat = false; // Get from Config! Turns off Chat :)

  pageView: pageViewEnum = pageViewEnum.Dashboard;
  matButtonToggleText: string = 'Search';
  matButtonToggleIcon: string = 'search';

  isTileView = true;
  matButtonViewToggleText: string = 'ListView';
  matButtonViewToggleIcon: string = 'line_style';

  isAbout = false;

  selectedOrderBy = OrderByType.CreatedOn;

  matButtonOrderByText: string = 'CreatedOn';
  matButtonOrderByIcon: string = 'schedule';
  orderByButtonCounter: number = 0;

  profile: Profile;
  filter: ProfileFilter;
  lastCalledFilter: string = "getLatestProfiles";

  siteLanguage: string
  siteLocale: string
  languageList = [
    { code: 'en', label: 'English', alpha2: 'gb' },
    { code: 'da', label: 'Danish', alpha2: 'dk' }
  ]

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  constructor(public auth: AuthService, private profileService: ProfileService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    auth.handleAuthentication();
    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }

    if (this.auth.isAuthenticated()) {
      this.siteLocale = window.location.pathname.split('/')[1]
      this.siteLanguage = this.languageList.find(
        (f) => f.code === this.siteLocale
      )?.label
      if (!this.siteLanguage) {
        this.onChange(this.languageList[0].code)
      }
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onChange(selectedLangCode: string) {
    window.location.href = `/${selectedLangCode}`
    console.log(selectedLangCode); // Does not seem to work
  }

  toggleDisplay() {
    if (this.pageView == pageViewEnum.Edit || this.pageView == pageViewEnum.About || this.pageView == pageViewEnum.Details) {
      this.pageView = pageViewEnum.Dashboard;
      this.matButtonToggleText = 'Search';
      this.matButtonToggleIcon = 'search';
      this.sidenav.toggle();
    }
    else {
      this.pageView = (this.pageView == pageViewEnum.Dashboard ? pageViewEnum.Search : pageViewEnum.Dashboard);
      this.matButtonToggleText = (this.pageView == pageViewEnum.Dashboard ? 'Search' : 'Dashboard');
      this.matButtonToggleIcon = (this.pageView == pageViewEnum.Dashboard ? 'search' : 'dashboard');
    }
  }

  toggleViewDisplay() {
    this.isTileView = !this.isTileView;
    this.matButtonViewToggleText = (this.isTileView ? 'ListView' : 'TileView');
    this.matButtonViewToggleIcon = (this.isTileView ? 'line_style' : 'collections');
    this.dashboardComponent.toggleViewDisplay();
  }

  toggleOrderBy() {
    switch (this.orderByButtonCounter) {
      case 0: {
        this.matButtonOrderByText = 'UpdatedOn';
        this.matButtonOrderByIcon = 'update';
        this.selectedOrderBy = OrderByType.UpdatedOn;
        this.orderByButtonCounter++;
        this.callApiWithNewSelectedOrderBy();
        break;
      }
      case 1: {
        this.matButtonOrderByText = 'LastActive';
        this.matButtonOrderByIcon = 'watch_later';
        this.selectedOrderBy = OrderByType.LastActive;
        this.orderByButtonCounter++;
        this.callApiWithNewSelectedOrderBy();
        break;
      }
      case 2: {
        this.matButtonOrderByText = 'CreatedOn';
        this.matButtonOrderByIcon = 'schedule';
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
    this.dashboardComponent.getBookmarkedProfiles();
  }

  getProfileByFilter($event, newOrderBy: boolean) {
    this.lastCalledFilter = "getProfileByFilter";
    if (!newOrderBy) {
      this.filter = $event;
    }
    this.dashboardComponent.getProfileByFilter(this.filter, this.selectedOrderBy);
    this.toggleDisplay();
  }

  resetSelectionPagination() {
    if (!this.isTileView) {
      this.dashboardComponent.resetSelectionPagination();
    }
  }

  // Calls to ProfileSearchComponent
  onSubmit() {
    this.profileSearchComponent.onSubmit();
    this.sidenav.toggle();
  }

  revert() {
    this.profileSearchComponent.revert();
  }

  saveSearch() {
    this.profileSearchComponent.saveSearch();
  }

  loadSearch() {
    this.profileSearchComponent.loadSearch();
  }

  // Load About page
  loadAbout() {
    this.pageView = pageViewEnum.About;
    this.matButtonToggleText = 'Dashboard';
    this.matButtonToggleIcon = 'dashboard';
  }

  // Load Edit page
  loadEdit() {
    this.pageView = pageViewEnum.Edit;
    this.matButtonToggleText = 'Dashboard';
    this.matButtonToggleIcon = 'dashboard';
  }

  // Load Details page
  loadDetails(profile: Profile) {
    this.profile = profile;
    this.pageView = pageViewEnum.Details;
    this.matButtonToggleText = 'Dashboard';
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
