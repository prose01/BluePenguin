
import {switchMap} from 'rxjs/operators';

import { Component, OnInit, Input } 		from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';

import { Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: [ './profile-detail.component.css' ]
})

export class ProfileDetailComponent implements OnInit {
	@Input() profile : Profile;

	constructor(
	  private profileService: ProfileService,
	  private route: ActivatedRoute,
	  private location: Location
	) {}

	ngOnInit(): void {
	  this.route.paramMap.pipe(
	    switchMap((params: ParamMap) => this.profileService.getProfileById(params.get('profileId'))))
	    .subscribe(profile => this.profile = profile);
	}

	//goBack(): void {
	//  this.location.back();
	//}
}
