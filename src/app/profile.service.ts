import { Injectable } from '@angular/core';

import { Profile } from './profile';
import { PROFILES } from './mock-profiles';

@Injectable()
export class ProfileService {
	getProfiles(): Promise<Profile[]> {
		return Promise.resolve(PROFILES);
	}

  	getProfile(id: number): Promise<Profile> {
		return this.getProfiles().then(profiles => profiles.find(profile => profile.id === id));
	}
}