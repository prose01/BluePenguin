import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './authorisation/auth/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CurrentUser } from './models/currentUser';
import { OrderByType } from './models/enums';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

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

  orderBy: any[] = [
    { value: OrderByType.CreatedOn, viewValue: 'CreatedOn' },   //most recent
    { value: OrderByType.UpdatedOn, viewValue: 'UpdatedOn' },
    { value: OrderByType.LastActive, viewValue: 'LastActive' }
  ];
  selectedOrderBy = this.orderBy[0].value;

  siteLanguage: string
  siteLocale: string
  languageList = [
    { code: 'en', label: 'English', alpha2: 'gb' },
    { code: 'da', label: 'Danish', alpha2: 'dk' }
  ]

  constructor(public auth: AuthService, private router: Router, private profileService: ProfileService) {
    auth.handleAuthentication();
    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });
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

  onChange(selectedLangCode: string) {
    window.location.href = `/${selectedLangCode}`
    console.log(selectedLangCode); // Does not seem to work
  }

  toggleDisplay() {
    this.pageView = (this.pageView == pageViewEnum.Dashboard ? pageViewEnum.Search : pageViewEnum.Dashboard); 
    this.matButtonToggleText = (this.pageView == pageViewEnum.Dashboard ? 'Search' : 'Dashboard');
    this.matButtonToggleIcon = (this.pageView == pageViewEnum.Dashboard ? 'search' : 'dashboard');
  }

  toggleViewDisplay() {
    this.isTileView = !this.isTileView;
    this.matButtonViewToggleText = (this.isTileView ? 'ListView' : 'TileView');
    this.matButtonViewToggleIcon = (this.isTileView ? 'line_style' : 'collections');
    this.dashboardComponent.toggleDisplay();
  }

  // DashboardComponent
  getLatestProfiles() {
    this.dashboardComponent.getLatestProfiles();
  }

  getProfileByCurrentUsersFilter() {
    this.dashboardComponent.getProfileByCurrentUsersFilter();
  }

  getBookmarkedProfiles() {
    this.dashboardComponent.getBookmarkedProfiles();
  }

  resetSelectionPagination() {
    if (!this.isTileView) {
      this.dashboardComponent.resetSelectionPagination();
    }
  }

  // ProfileSearchComponent
  onSubmit() {
    this.profileSearchComponent.onSubmit();
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

  // About
  loadAbout() {
    this.pageView = pageViewEnum.About;
    this.matButtonToggleText = 'Dashboard';
    this.matButtonToggleIcon = 'dashboard';
  }

  // Edit
  loadEdit() {
    this.pageView = pageViewEnum.Edit;
    this.matButtonToggleText = 'Dashboard';
    this.matButtonToggleIcon = 'dashboard';
  }

  // Edit
  loadDetails() {
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
