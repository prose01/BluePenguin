import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, BehaviorSubject, throwError  } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Profile } from '../models/profile';
import { CurrentUser } from '../models/currentUser';
import { ProfileFilter } from '../models/profileFilter';
import { ConfigurationLoader } from "../configuration/configuration-loader.service";
import { OrderByType } from '../models/enums';

@Injectable()
export class ProfileService {

  private avalonUrl: string;
  private headers: HttpHeaders;

  private currentUserSource = new BehaviorSubject<CurrentUser>(null);
  currentUserSubject = this.currentUserSource.asObservable();

  constructor(private configurationLoader: ConfigurationLoader, private http: HttpClient) {
    this.avalonUrl = this.configurationLoader.getConfiguration().avalonUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  // CurrentUser

  async verifyCurrentUserProfile(): Promise<boolean> {
    const currentUser = await this.http.get<CurrentUser>(`${this.avalonUrl}CurrentUser`, { headers: this.headers }).toPromise();

    if (currentUser.profileId == null) {
      return Promise.resolve(false);
    }

    // Use RxJS BehaviorSubject to hold CurrentUser for all other components.
    this.currentUserSource.next(currentUser);

    return Promise.resolve(true);
  }

  async updateCurrentUserSubject() {
    const currentUser = await this.http.get<CurrentUser>(`${this.avalonUrl}CurrentUser`, { headers: this.headers }).toPromise();
    this.currentUserSource.next(currentUser);
  }

  addProfile(currentUser: CurrentUser): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(`${this.avalonUrl}CurrentUser`, currentUser, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  putProfile(currentUser: CurrentUser): Observable<{}> {
    return this.http.put<CurrentUser>(`${this.avalonUrl}CurrentUser`, currentUser, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  deleteCurrentUser(): Observable<{}> {
    return this.http.delete(`${this.avalonUrl}CurrentUser`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  saveProfileFilter(profileFilter: ProfileFilter): Observable<{}> {
    return this.http.post<CurrentUser>(`${this.avalonUrl}SaveProfileFilter`, profileFilter, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  loadProfileFilter(): Observable<ProfileFilter> {
    return this.http.get<ProfileFilter>(`${this.avalonUrl}LoadProfileFilter`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // Does not work so use putProfile instead.
  patchProfile(currentUser: CurrentUser): Observable<CurrentUser> {
    return this.http.patch<CurrentUser>(`${this.avalonUrl}CurrentUser`, { prof: currentUser }, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }


  // Bookmarks
  addProfilesToBookmarks(profiles: string[]): Observable<{}> {   // TODO: Should not return all profiles
    return this.http.post<Profile>(`${this.avalonUrl}AddProfilesToBookmarks`, profiles, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  removeProfilesFromBookmarks(profiles: string[]): Observable<{}> {  // TODO: Should not return all profiles
    return this.http.post<Profile[]>(`${this.avalonUrl}RemoveProfilesFromBookmarks`, profiles, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getBookmarkedProfiles(orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetBookmarkedProfiles`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // Likes
  addLikeToProfile(profileId: string): Observable<{}> {  // TODO: Should not return all profiles
    return this.http.get(`${this.avalonUrl}AddLikeToProfile/${profileId}`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  removeLikeFromProfile(profileId: string): Observable<{}> {  // TODO: Should not return all profiles
    return this.http.get(`${this.avalonUrl}RemoveLikeFromProfile/${profileId}`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }



  // Profile

  getProfiles(): Observable<Profile[]> { // TODO: Should not return all profiles
    return this.http.get<Profile[]>(`${this.avalonUrl}GetAllProfiles`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getProfileById(profileId: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.avalonUrl}GetProfileById/${profileId}`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  addVisitedToProfiles(profileId: string): Observable<{}> {
    return this.http.get(`${this.avalonUrl}AddVisitedToProfiles/${profileId}`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
    );
  }

  deleteProfiles(profiles: string[]): Observable<{}> {
    return this.http.post(`${this.avalonUrl}DeleteProfiles`, profiles, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  setAsAdmin(profileId: string): Observable<{}> {
    return this.http.post(`${this.avalonUrl}SetAsAdmin`, `\"${profileId}\"`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  removeAdmin(profileId: string): Observable<{}> {
    return this.http.post(`${this.avalonUrl}RemoveAdmin`, `\"${profileId}\"`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getChatMemberProfiles(pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetChatMemberProfiles`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  blockChatMembers(profileIds: string[]): Observable<{}>{ 
    return this.http.post<Profile[]>(`${this.avalonUrl}BlockChatMembers`, profileIds, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getProfileByFilter(profileFilter: ProfileFilter, orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.post<Profile[]>(`${this.avalonUrl}GetProfileByFilter`, { profileFilter, orderByType }, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getProfileByCurrentUsersFilter(orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfileByCurrentUsersFilter`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getLatestProfiles(orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetLatestProfiles`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getProfilesWhoVisitedMe(orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfilesWhoVisitedMe`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getProfilesWhoBookmarkedMe(orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfilesWhoBookmarkedMe`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getProfilesWhoLikesMe(orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfilesWhoLikesMe`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }


  // Helper Lav en rigtig error handler inden produktion
  // https://stackblitz.com/angular/jyrxkavlvap?file=src%2Fapp%2Fheroes%2Fheroes.service.ts
  // Husk at opdater GET, POST etc this.handleError!
  //private handleError(error: any): Promise<any> {
  //  console.error('An error occurred', error); // for demo purposes only
  //  return Promise.reject(error.message || error);
  //}

  private handleError(error: HttpErrorResponse) {
    //if (error.error instanceof ErrorEvent) {
    //  // A client-side or network error occurred. Handle it accordingly.
    //  console.error('An error occurred:', error.error.message);
    //} else if (error.status === 0) {
    //  // A client-side or network error occurred. Handle it accordingly.
    //  console.error('No connection to data server:', error.error);
    //} else {
    //  // The backend returned an unsuccessful response code.
    //  // The response body may contain clues as to what went wrong.
    //  console.error(
    //    `Backend returned code ${error.status}, ` +
    //    `body was: ${error.error}`);
    //}
    // Return an observable with a user-facing error message.
    return throwError(
      error
      //'Something bad happened; please try again later.'
    );
  }
}
