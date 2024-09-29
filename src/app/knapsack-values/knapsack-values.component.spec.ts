import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnapsackValuesComponent } from './knapsack-values.component';

describe('KnapsackValuesComponent', () => {
  let component: KnapsackValuesComponent;
  let fixture: ComponentFixture<KnapsackValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnapsackValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnapsackValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
