import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiscountComponent } from './create-discount.component';

describe('CreateProductComponent', () => {
  let component: CreateDiscountComponent;
  let fixture: ComponentFixture<CreateDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDiscountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
