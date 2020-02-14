import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTileviewComponent } from './profile-tileview.component';

describe('ProfileTileviewComponent', () => {
  let component: ProfileTileviewComponent;
  let fixture: ComponentFixture<ProfileTileviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTileviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTileviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
