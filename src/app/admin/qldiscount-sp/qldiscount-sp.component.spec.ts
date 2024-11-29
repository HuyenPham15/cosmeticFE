import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QldiscountSpComponent } from './qldiscount-sp.component';

describe('QldiscountSpComponent', () => {
  let component: QldiscountSpComponent;
  let fixture: ComponentFixture<QldiscountSpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QldiscountSpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QldiscountSpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
