import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderIsProcessingComponent } from './order-is-processing.component';

describe('OrderIsProcessingComponent', () => {
  let component: OrderIsProcessingComponent;
  let fixture: ComponentFixture<OrderIsProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderIsProcessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderIsProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
