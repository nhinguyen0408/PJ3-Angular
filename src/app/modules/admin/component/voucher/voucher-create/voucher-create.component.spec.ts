import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherCreateComponent } from './voucher-create.component';

describe('VoucherCreateComponent', () => {
  let component: VoucherCreateComponent;
  let fixture: ComponentFixture<VoucherCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
