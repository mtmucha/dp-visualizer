import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseValuesComponent } from './warehouse-values.component';

describe('StockValuesComponent', () => {
  let component: WarehouseValuesComponent;
  let fixture: ComponentFixture<WarehouseValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
