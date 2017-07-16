import 'rxjs/add/operator/switchMap';
import { Component, OnInit } 		from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';

import { ProfileService } from './profile.service';
import { Profile } from './profile';

@Component({
  selector: 'profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: [ './profile-detail.component.css' ]
})

export class ProfileDetailComponent implements OnInit {
	profile : Profile;

	constructor(
	  private profileService: ProfileService,
	  private route: ActivatedRoute,
	  private location: Location
	) {}

	ngOnInit(): void {
	  this.route.paramMap
	    .switchMap((params: ParamMap) => this.profileService.getProfile(+params.get('id')))
	    .subscribe(profile => this.profile = profile);
	}

	goBack(): void {
	  this.location.back();
	}
}