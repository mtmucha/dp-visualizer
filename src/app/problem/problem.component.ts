import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProblemHelperService } from '../problem-helper.service'
import { ProblemType } from '../problemTypes'

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {

  items: number[][] = [
    [2,3,2,1],
    [1,1,1,1],
    [2,1,2,1]
  ];

  zadanie: string = `<p> HH </p>`;
  nadpis: string = "";

  days: number = 4;
  capacity: number = 4;

  startingState: number = 0;
  endingState: number = 0;

  decisionMin: number = 0;
  decisionMax: number = 5;

  problemType: ProblemType = ProblemType.Stock

  min: boolean = true;

  started: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onDaysChange(event: any){
    let diff= event - this.days;
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
