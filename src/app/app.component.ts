import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ConfigurationLoader } from './configuration/configuration-loader.service';
import { TranslocoService, getBrowserLang } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

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

  private title = 'PlusOne';
  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;
  private isProfileCreated: boolean = false;

  private useChat = false; // TODO: Get from Config! Turns off Chat :)

  private pageView: pageViewEnum = pageViewEnum.Dashboard;
  private matButtonToggleText: string;
  private matButtonToggleIcon: string = 'search';

  private isTileView = true;
  private matButtonViewToggleText: string;
  private matButtonViewToggleIcon: string = 'line_style';

  private matButtonOrderByText: string;
  private matButtonOrderByIcon: string = 'watch_later';
  private orderBy: OrderByType = OrderByType.LastActive;

  private viewFilterType: ViewFilterTypeEnum = ViewFilterTypeEnum.LatestProfiles;

  private profile: Profile;
  private filter: ProfileFilter;
  private allowSearch: boolean = false;
  private lastCalledFilter: string = "getLatestProfiles";
  private pageSize: number;

  private siteLocale: string = getBrowserLang();
  private languageList: Array<any>;

  private CurrentUserBoardTabIndex: number = 1;

  private mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  //fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  constructor(public auth: AuthService, private enumMappings: EnumMappingService, private profileService: ProfileService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    auth.handleAuthentication();

    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; })
    );

    setTimeout(() => {
      if (this.auth.isAuthenticated()) {
        this.profileService.cleanCurrentUser().subscribe();
      }
    }, 500);

    this.languageList = this.configurationLoader.getConfiguration().languageList;

    this.pageSize = this.configurationLoader.getConfiguration().defaultPageSize;

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }

    this.initiateTransloco();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private initiateTransloco(): void {
    this.subs.push(
      this.translocoService.selectTranslate('Search').subscribe(value => this.matButtonToggleText = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('ListView').subscribe(value => this.matButtonViewToggleText = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('SortByLastActive').subscribe(value => this.matButtonOrderByText = value)
    );
  }

  private switchLanguage(): void {
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

  private toggleDisplay(): void {
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

  private toggleViewDisplay(): void {
    this.isTileView = !this.isTileView;
    this.matButtonViewToggleText = (this.isTileView ? this.translocoService.translate('ListView') : this.translocoService.translate('TileView'));
    this.matButtonViewToggleIcon = (this.isTileView ? 'line_style' : 'collections');
    this.dashboardComponent.toggleViewDisplay();
    this.getData();
  }

  private toggleOrderBy(): void {
    switch (this.orderBy) {
      case OrderByType.CreatedOn: {
        this.matButtonOrderByText = this.translocoService.translate('SortByUpdatedOn');
        this.matButtonOrderByIcon = 'update';
        this.orderBy = OrderByType.LastActive;
        if (this.isTileView) {
          this.dashboardComponent.resetCurrentProfiles();
        }
        this.getData();
        break;
      }
      case OrderByType.LastActive: {
        this.matButtonOrderByText = this.translocoService.translate('SortByCreatedOn');
        this.matButtonOrderByIcon = 'schedule';
        this.orderBy = OrderByType.UpdatedOn;
        if (this.isTileView) {
          this.dashboardComponent.resetCurrentProfiles();
        }
        this.getData();
        break;
      }
      case OrderByType.UpdatedOn: {
        this.matButtonOrderByText = this.translocoService.translate('SortByLastActive');
        this.matButtonOrderByIcon = 'watch_later';
        this.orderBy = OrderByType.CreatedOn;
        if (this.isTileView) {
          this.dashboardComponent.resetCurrentProfiles();
        }
        this.getData();
        break;
      }
    }
  }

  private getData(): void {
    this.dashboardComponent.getData(this.viewFilterType, this.orderBy, { currentSize: 0, pageIndex: 0, pageSize: this.pageSize });
  }

  // Calls to DashboardComponent
  private getLatestProfiles(): void {
    if (this.isTileView) {
      this.dashboardComponent.resetCurrentProfiles();
    }

    this.viewFilterType = ViewFilterTypeEnum.LatestProfiles;
    this.getData();
  }

  private getProfileByCurrentUsersFilter(): void {
    if (this.isTileView) {
      this.dashboardComponent.resetCurrentProfiles();
    }

    this.viewFilterType = ViewFilterTypeEnum.FilterProfiles;
    this.getData();
  }

  private getBookmarkedProfiles(): void {
    if (this.isTileView) {
      this.dashboardComponent.resetCurrentProfiles();
    }

    this.viewFilterType = ViewFilterTypeEnum.BookmarkedProfiles;
    this.getData();
  }

  private getProfileByFilter(): void {
    if (this.isTileView) {
      this.dashboardComponent.resetCurrentProfiles();
    }

    this.viewFilterType = ViewFilterTypeEnum.ProfilesSearch;
    this.getData();
    this.toggleDisplay();
  }

  private getProfilesWhoVisitedMe(): void {
    if (this.isTileView) {
      this.dashboardComponent.resetCurrentProfiles();
    }

    this.viewFilterType = ViewFilterTypeEnum.ProfilesWhoVisitedMe;
    this.getData();
  }

  private getProfilesWhoBookmarkedMe(): void {
    if (this.isTileView) {
      this.dashboardComponent.resetCurrentProfiles();
    }

    this.viewFilterType = ViewFilterTypeEnum.ProfilesWhoBookmarkedMe;
    this.getData();
  }

  private getProfilesWhoLikesMe(): void {
    if (this.isTileView) {
      this.dashboardComponent.resetCurrentProfiles();
    }

    this.viewFilterType = ViewFilterTypeEnum.ProfilesWhoLikesMe;
    this.getData();
  }

  private resetSelectionPagination(): void {
    if (!this.isTileView) {
      this.dashboardComponent?.resetSelectionPagination();
    }
  }

  // Calls to ProfileSearchComponent
  private onSubmit(): void {
    this.profileSearchComponent.onSubmit();
    this.sidenav.toggle();
  }

  private reset(): void {
    this.profileSearchComponent.reset();
  }

  private activateSearch(event: any): void {
    this.allowSearch = event.allowSearch
  }

  private saveSearch(): void {
    this.profileSearchComponent.saveSearch();
  }

  private loadSearch(): void {
    this.profileSearchComponent.loadSearch();
  }

  private isCurrentUserCreated(event: any): void {
    this.isProfileCreated = event.isCreated;

    if (event.isCreated) {
      this.siteLocale = event.languagecode;
      this.switchLanguage();

      if (event.uploadImageClick) {
        this.CurrentUserBoardTabIndex = 1;
        this.pageView = pageViewEnum.Edit;
      }
      else {
        this.pageView = pageViewEnum.Dashboard;
      }
    }
  }

  // Load About page
  private loadAbout(): void {
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
  private loadEdit(): void {
    if (this.pageView != pageViewEnum.Edit) {
      this.CurrentUserBoardTabIndex = 0;
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
  private loadFeedback(): void {
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
  private loadFeedbackAdmin(): void {
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

  // Load Delete Old Profiles Admin
  private loadAdmin(): void {

    if (this.pageView != pageViewEnum.Admin) {
      this.pageView = pageViewEnum.Admin;
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

  private loadDashboard(): void {
    this.pageView = pageViewEnum.Dashboard;
    this.matButtonToggleText = this.translocoService.translate('Search');
    this.matButtonToggleIcon = 'search';
  }

  // Load Details page
  private loadDetails(profile: Profile): void {
    this.subs.push(
      this.profileService.addVisitedToProfiles(profile.profileId).subscribe(() => { })
    );
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
  "FeedbackAdmin" = "FeedbackAdmin",
  "Admin" = "Admin"
}
