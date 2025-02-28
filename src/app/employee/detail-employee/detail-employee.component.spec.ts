import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEmployeeComponent } from './detail-employee.component';

describe('DetailEmployeeComponent', () => {
  let component: DetailEmployeeComponent;
  let fixture: ComponentFixture<DetailEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
