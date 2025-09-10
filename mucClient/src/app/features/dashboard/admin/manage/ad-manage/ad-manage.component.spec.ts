import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdManageComponent } from './ad-manage.component';

describe('AdManageComponent', () => {
  let component: AdManageComponent;
  let fixture: ComponentFixture<AdManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
