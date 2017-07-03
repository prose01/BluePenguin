import { Injectable } from '@angular/core';

import { Profile } from './profile';
import { PROFILES } from './mock-profiles';

@Injectable()
export class ProfileService {
	getProfiles(): Promise<Profile[]> {
    return Promise.resolve(PROFILES);
  }
}