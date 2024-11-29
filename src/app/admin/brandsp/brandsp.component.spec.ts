import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandspComponent } from './brandsp.component';

describe('BrandspComponent', () => {
  let component: BrandspComponent;
  let fixture: ComponentFixture<BrandspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandspComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
