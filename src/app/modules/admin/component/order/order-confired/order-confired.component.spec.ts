import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfiredComponent } from './order-confired.component';

describe('OrderConfiredComponent', () => {
  let component: OrderConfiredComponent;
  let fixture: ComponentFixture<OrderConfiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderConfiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConfiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
