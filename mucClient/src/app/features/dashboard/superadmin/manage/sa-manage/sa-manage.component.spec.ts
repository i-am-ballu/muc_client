import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaManageComponent } from './sa-manage.component';

describe('SaManageComponent', () => {
  let component: SaManageComponent;
  let fixture: ComponentFixture<SaManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
