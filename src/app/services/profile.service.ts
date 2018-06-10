import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Profile } from '../models/profile';
//import { PROFILES } from './mock-profiles';

@Injectable()
export class ProfileService {

	private profilesUrl = 'http://localhost:49260/api/Profiles/';  // URL to web api
	//private testUrl = 'http://localhost:49260/api/Profiles/';  // URL to web api

	constructor(private http: Http) { }

	getProfiles(): Promise<Profile[]> {
	  return this.http.get(this.profilesUrl)
	             .toPromise()
	             .then(response => response.json())
	             .catch(this.handleError);
	}

	// getTest(): Promise<String> {
	//   return this.http.get(this.testUrl)
	//              .toPromise()
	//              .then(response => response.json().data as String)
	//              .catch(this.handleError);
	// }
 
	private handleError(error: any): Promise<any> {
	  console.error('An error occurred', error); // for demo purposes only
	  return Promise.reject(error.message || error);
	}



	// getProfiles(): Promise<Profile[]> {
	// 	return Promise.resolve(PROFILES);
	// }

  	getProfile(profileId: string): Promise<Profile> {
	  return this.http.get(this.profilesUrl + profileId)
	             .toPromise()
	             .then(response => response.json())
	             .catch(this.handleError);
	}
}