import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdDistributionComponent } from './ad-distribution.component';

describe('AdDistributionComponent', () => {
  let component: AdDistributionComponent;
  let fixture: ComponentFixture<AdDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
