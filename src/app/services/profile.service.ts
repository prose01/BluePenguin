import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Profile } from '../models/profile';

@Injectable()
export class ProfileService {

	private profilesUrl = 'http://localhost:49260/api/Profiles/';  // URL to web api
  	private headers: HttpHeaders;

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
	}

	getProfiles (): Observable<Profile[]> {
      return this.http.get<Profile[]>(this.profilesUrl, {headers: this.headers})
		      	.pipe(
		        catchError(this.handleError)
		      );
    }

	getProfile<Data>(profileId: string): Observable<Profile> {
	    return this.http.get<Profile[]>(`${this.profilesUrl}${profileId}`, {headers: this.headers})
	      .pipe(
	        map(profile => profile),
	        tap(h => {
	          const outcome = h ? `fetched` : `did not find`;
	          //this.log(`${outcome} profile profileId=${profileId}`);
	        }),
	        catchError(this.handleError)
	      );
  	}

	addProfile(profile: Profile): Observable<Profile> {
	    return this.http.post<Profile>(this.profilesUrl, profile, {headers: this.headers})
			    .pipe(
			      catchError(this.handleError)
			    );
	}

	updateProfile(profile: Profile): Observable<Profile> {
		return this.http.put<Profile>(`${this.profilesUrl}${profile.profileId}`, profile, {headers: this.headers})
		    	.pipe(
		      	  catchError(this.handleError)
		    	);
	}

	// Helper Lav en rigtig error handler inden produktion
	// https://stackblitz.com/angular/jyrxkavlvap?file=src%2Fapp%2Fheroes%2Fheroes.service.ts
	// Husk at opdater GET, POST etc this.handleError!
	private handleError(error: any): Promise<any> {
	  console.error('An error occurred', error); // for demo purposes only
	  return Promise.reject(error.message || error);
	}
}