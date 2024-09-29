import { Component, OnInit } from '@angular/core';
import { ValuesComponent } from '../values/values.component'

@Component({
  selector: 'app-warehouse-values',
  templateUrl: './warehouse-values.component.html',
  styleUrls: ['../values/values.component.css']
})
export class WarehouseValuesComponent extends ValuesComponent implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
