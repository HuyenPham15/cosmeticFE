import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountSpComponent } from './discount-sp.component';

describe('DiscountSpComponent', () => {
  let component: DiscountSpComponent;
  let fixture: ComponentFixture<DiscountSpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountSpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountSpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
