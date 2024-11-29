import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducsizeComponent } from './producsize.component';

describe('ProducsizeComponent', () => {
  let component: ProducsizeComponent;
  let fixture: ComponentFixture<ProducsizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducsizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducsizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
