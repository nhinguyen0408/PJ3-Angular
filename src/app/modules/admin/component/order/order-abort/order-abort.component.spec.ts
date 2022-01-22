import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAbortComponent } from './order-abort.component';

describe('OrderAbortComponent', () => {
  let component: OrderAbortComponent;
  let fixture: ComponentFixture<OrderAbortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAbortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAbortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
