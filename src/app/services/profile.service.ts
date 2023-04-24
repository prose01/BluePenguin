import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { Profile } from '../models/profile';
import { CurrentUser } from '../models/currentUser';
import { GroupModel } from '../models/groupModel';
import { ProfileFilter } from '../models/profileFilter';
import { ConfigurationLoader } from "../configuration/configuration-loader.service";
import { OrderByType } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private avalonUrl: string;
  private headers: HttpHeaders;

  private currentUserSource = new BehaviorSubject<CurrentUser>(null);
  public currentUserSubject = this.currentUserSource.asObservable();

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

  async updateCurrentUserSubject(): Promise<void> {
    const currentUser = await this.http.get<CurrentUser>(`${this.avalonUrl}CurrentUser`, { headers: this.headers }).toPromise();
    this.currentUserSource.next(currentUser);
  }

  cleanCurrentUser(): Observable<{}>  {
    return this.http.get<any>(`${this.avalonUrl}CleanCurrentUser`, { headers: this.headers });
  }

  checkForComplains(): Observable<boolean>  {
    return this.http.get<any>(`${this.avalonUrl}CheckForComplains`, { headers: this.headers });
  }

  addProfile(currentUser: CurrentUser): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(`${this.avalonUrl}CurrentUser`, currentUser, { headers: this.headers });
  }

  putProfile(currentUser: CurrentUser): Observable<{}> {
    return this.http.put<CurrentUser>(`${this.avalonUrl}CurrentUser`, currentUser, { headers: this.headers });
  }

  deleteCurrentUser(): Observable<{}> {
    return this.http.delete(`${this.avalonUrl}CurrentUser`, { headers: this.headers });
  }

  saveProfileFilter(profileFilter: ProfileFilter): Observable<{}> {
    return this.http.post<CurrentUser>(`${this.avalonUrl}SaveProfileFilter`, profileFilter, { headers: this.headers });
  }

  loadProfileFilter(): Observable<ProfileFilter> {
    return this.http.get<ProfileFilter>(`${this.avalonUrl}LoadProfileFilter`, { headers: this.headers });
  }

  getGroups(): Observable<GroupModel[]> {
    return this.http.get<GroupModel[]>(`${this.avalonUrl}GetGroups`, { headers: this.headers });
  }

  //// Does not work so use putProfile instead.
  //patchProfile(currentUser: CurrentUser): Observable<CurrentUser> {
  //  return this.http.patch<CurrentUser>(`${this.avalonUrl}CurrentUser`, { prof: currentUser }, { headers: this.headers });
  //}


  // Bookmarks
  addProfilesToBookmarks(profiles: string[]): Observable<{}> {
    return this.http.post<Profile>(`${this.avalonUrl}AddProfilesToBookmarks`, profiles, { headers: this.headers });
  }

  removeProfilesFromBookmarks(profiles: string[]): Observable<{}> {
    return this.http.post<Profile[]>(`${this.avalonUrl}RemoveProfilesFromBookmarks`, profiles, { headers: this.headers });
  }

  getBookmarkedProfiles(orderByType: OrderByType, pageIndex: number, pageSize: number): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetBookmarkedProfiles`, { headers: this.headers, params: params });
  }

  // Likes
  addLikeToProfiles(profileIds: string[]): Observable<{}> {
    return this.http.post<Profile[]>(`${this.avalonUrl}AddLikeToProfiles`, profileIds, { headers: this.headers });
  }

  removeLikeFromProfiles(profileIds: string[]): Observable<{}> {
    return this.http.post<Profile[]>(`${this.avalonUrl}RemoveLikeFromProfiles`, profileIds, { headers: this.headers });
  }



  // Profile

  //getProfiles(): Observable<Profile[]> {
  //  return this.http.get<Profile[]>(`${this.avalonUrl}GetAllProfiles`, { headers: this.headers });
  //}

  getProfileById(profileId: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.avalonUrl}GetProfileById/${profileId}`, { headers: this.headers });
  }

  addVisitedToProfiles(profileId: string): Observable<{}> {
    return this.http.get(`${this.avalonUrl}AddVisitedToProfiles/${profileId}`, { headers: this.headers });
  }

  deleteProfiles(profiles: string[]): Observable<{}> {
    return this.http.post(`${this.avalonUrl}DeleteProfiles`, profiles, { headers: this.headers });
  }

  setAsAdmin(profileId: string): Observable<{}> {
    return this.http.post(`${this.avalonUrl}SetAsAdmin`, `\"${profileId}\"`, { headers: this.headers });
  }

  removeAdmin(profileId: string): Observable<{}> {
    return this.http.post(`${this.avalonUrl}RemoveAdmin`, `\"${profileId}\"`, { headers: this.headers });
  }

  //getChatMemberProfiles(pageIndex: string, pageSize: string): Observable<Profile[]> {
  //  const params = new HttpParams()
  //    .set('PageIndex', pageIndex)
  //    .set('PageSize', pageSize);

  //  return this.http.get<Profile[]>(`${this.avalonUrl}GetChatMemberProfiles`, { headers: this.headers, params: params });
  //}

  blockChatMembers(profileIds: string[]): Observable<{}>{ 
    return this.http.post<Profile[]>(`${this.avalonUrl}BlockChatMembers`, profileIds, { headers: this.headers });
  }

  addComplainToProfile(profileId: string): Observable<Profile> {
    return this.http.post<Profile>(`${this.avalonUrl}AddComplainToProfile`, `\"${profileId}\"`, { headers: this.headers });
  }

  getProfileByFilter(profileFilter: ProfileFilter, orderByType: OrderByType, pageIndex: number, pageSize: number): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.post<Profile[]>(`${this.avalonUrl}GetProfileByFilter`, { profileFilter }, { headers: this.headers, params: params });
  }

  getProfileByCurrentUsersFilter(orderByType: OrderByType, pageIndex: number, pageSize: number): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfileByCurrentUsersFilter`, { headers: this.headers, params: params });
  }

  getLatestProfiles(orderByType: OrderByType, pageIndex: number, pageSize: number): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetLatestProfiles`, { headers: this.headers, params: params });
  }

  getProfilesWhoVisitedMe(orderByType: OrderByType, pageIndex: number, pageSize: number): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfilesWhoVisitedMe`, { headers: this.headers, params: params });
  }

  getProfilesWhoBookmarkedMe(orderByType: OrderByType, pageIndex: number, pageSize: number): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfilesWhoBookmarkedMe`, { headers: this.headers, params: params });
  }

  getProfilesWhoLikesMe(orderByType: OrderByType, pageIndex: number, pageSize: number): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfilesWhoLikesMe`, { headers: this.headers, params: params });
  }

  getProfilesByIds(profileIds: string[], pageIndex: number, pageSize: number): Observable<Profile[]> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.post<Profile[]>(`${this.avalonUrl}GetProfilesByIds`, { profileIds }, { headers: this.headers, params: params });
  }

  deleteOldProfiles(daysBack: number, limit: number): Observable<{}> {
    const params = new HttpParams()
      .set('daysBack', daysBack)
      .set('limit', limit);

    return this.http.delete(`${this.avalonUrl}DeleteOldProfiles`, { headers: this.headers, params: params });
  }
}
