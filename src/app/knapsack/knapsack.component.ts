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
    this.nadpis = "Úloha o batohu";
    this.zadanie = 
    `<p>Je potrebné zachrániť nálezy s čo najväčšiou celkovou hodnotou, súčet hodnôt <b>c<sub>t</sub></b>, z ohrozeného archeologického náleziska,
    tak aby sme neprekročili kapacitu batohu <b>k</b>.<br>
    Máme batoh s danou kapacitou <b>k</b>. Jednotlivé hodnoty predmetov <b>c<sub>t</sub></b> a ich hmotnosť <b>w<sub>t</sub></b> sú v uvedené v tabuľke nižšie.</p>`;
  }

  ngOnInit(): void {
  }

}
