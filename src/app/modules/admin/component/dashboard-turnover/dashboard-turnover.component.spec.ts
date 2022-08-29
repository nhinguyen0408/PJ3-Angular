import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTurnoverComponent } from './dashboard-turnover.component';

describe('DashboardTurnoverComponent', () => {
  let component: DashboardTurnoverComponent;
  let fixture: ComponentFixture<DashboardTurnoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTurnoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTurnoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
