import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdUsersComponent } from './ad-users.component';

describe('AdUsersComponent', () => {
  let component: AdUsersComponent;
  let fixture: ComponentFixture<AdUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
