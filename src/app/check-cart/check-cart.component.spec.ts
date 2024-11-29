import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckCartComponent } from './check-cart.component';

describe('CheckCartComponent', () => {
  let component: CheckCartComponent;
  let fixture: ComponentFixture<CheckCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
