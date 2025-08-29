import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaDistributionComponent } from './sa-distribution.component';

describe('SaDistributionComponent', () => {
  let component: SaDistributionComponent;
  let fixture: ComponentFixture<SaDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
