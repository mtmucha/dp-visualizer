import { Component, OnInit } from '@angular/core';
import { ProblemType } from '../problemTypes'
import { ProblemComponent } from '../problem/problem.component'

@Component({
  selector: 'app-knapsack',
  templateUrl: '../problem/problem.component.html',
  styleUrls: ['../problem/problem.component.css']
})
export class KnapsackComponent extends ProblemComponent implements OnInit {

  constructor() { 
    super();
    this.min = false;
    this.decisionMin = 0;
    this.decisionMax = 1;
    this.items = [
      [2,3,2,1],
      [2,4,2,1],
      [0,0,0,0]
    ];
    this.problemType = ProblemType.Knapsack;
    this.nadpis = "Knapsack Problem";
    this.zadanie = 
    `<p>It is necessary to save the items with the greatest total value, the sum of values <b>c<sub>t</sub></b>, 
        from the endangered archaeological site, without exceeding the capacity of the knapsack <b>k</b>. 
        We have a knapsack with a given capacity <b>k</b>. 
        The individual values of the items <b>c<sub>t</sub></b> and their weights <b>w<sub>t</sub></b> 
        are provided in the table below.</p>`
    
  }

  ngOnInit(): void {
  }

}
