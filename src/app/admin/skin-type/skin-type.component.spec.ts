import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinTypeComponent } from './skin-type.component';

describe('SkinTypeComponent', () => {
  let component: SkinTypeComponent;
  let fixture: ComponentFixture<SkinTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkinTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkinTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
