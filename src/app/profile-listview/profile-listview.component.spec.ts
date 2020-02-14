import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileListviewComponent } from './profile-listview.component';

describe('ProfileListviewComponent', () => {
  let component: ProfileListviewComponent;
  let fixture: ComponentFixture<ProfileListviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileListviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileListviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
