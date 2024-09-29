import { Component, OnInit } from '@angular/core';
import { ValuesComponent } from '../values/values.component'

@Component({
  selector: 'app-knapsack-values',
  templateUrl: './knapsack-values.component.html',
  styleUrls: ['../values/values.component.css']
})
export class KnapsackValuesComponent extends ValuesComponent implements OnInit  {

  constructor() { 
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
