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
    this.nadpis = "Optimal Warehouse Management Problem";
    this.zadanie = 
    `<p>A customer requests a total quantity of goods <b>D</b> from the company, to be delivered in partial shipments of size <b>d<sub>t</sub></b>. 
        The company needs to decide the size of the shipments <b>x<sub>t</sub></b> in each period <b>t</b>, 
        in such a way that the costs are minimized. It is necessary to meet the demand <b>d<sub>t</sub></b> for the given period without exceeding the warehouse capacity <b>k</b>. 
        The production of one unit of goods in period <b>t</b> incurs a cost of <b>c<sub>t</sub></b>. 
        The individual values are provided in the table below.
     </p>`
    
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
