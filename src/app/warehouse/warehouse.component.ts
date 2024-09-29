import { Component, OnInit } from '@angular/core';
import { ProblemType } from '../problemTypes'
import { ProblemComponent } from '../problem/problem.component'

@Component({
  selector: 'app-warehouse',
  templateUrl: '../problem/problem.component.html',
  styleUrls: ['../problem/problem.component.css']
})
export class WarehouseComponent extends ProblemComponent implements OnInit {

  constructor() { 
    super();
    this.min = true;
    this.decisionMin = 0;
    this.decisionMax = 3;
    this.items = [
      [2,3,2,1],
      [1,1,1,1],
      [2,1,3,1]
    ];
    this.problemType = ProblemType.Stock;
    this.nadpis = "Úloha o optimálnom riadení skladu";
    this.zadanie = 
    `<p>Zákazník požaduje od firmy celkové množstvo tovaru D, v jednotlivých subdodávkach veľkosti <b>d<sub>t</sub></b>.</br>
    Vo firme je potrebné rozhodnúť v akých dodávkach <b>x<sub>t</sub></b> ,bude materiál vyrábaný v jednotlivých obdobiach <b>t</b>, tak aby náklady boli minimálne.</br>
    Je nutné splniť požiadavku <b>d<sub>t</sub></b> v danom období a neprekročiť kapacitu skladu <b>k</b>.</br>
    Výroba jednej jednotky tovaru si v období <b>t</b> vyžaduje náklady <b>c<sub>t</sub></b>. Jednotlivé hodnoty sú uvedené v tabuľke nižšie.</br></p>`;
    
  }

  ngOnInit(): void {
  }

  onDaysChange(event: any){
    ("onDaysChange");
    ("DAYS");
    let diff= event - this.days;
    ("SOCK");
    ("diff : " + diff);
    if(diff > 0)
      this.addColumn(diff);
    
    if(diff < 0)
      this.removeColumn(Math.abs(diff));
    
    this.items = this.items.concat([]);

    this.days = event;
  }

  addColumn(diff: number){
    for(let j = 0; j < diff;j++)
      for(let i = 0; i < 3 ;i++){
        this.items[i].push(1);
      }
  }

  removeColumn(diff: number){
    for(let j = 0; j < diff;j++)
      for(let i = 0; i < 3 ;i++){
        this.items[i].pop();
      }
  }

}
