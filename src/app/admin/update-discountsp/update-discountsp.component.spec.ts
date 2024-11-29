import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDiscountspComponent } from './update-discountsp.component';

describe('UpdateDiscountspComponent', () => {
  let component: UpdateDiscountspComponent;
  let fixture: ComponentFixture<UpdateDiscountspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDiscountspComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDiscountspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
