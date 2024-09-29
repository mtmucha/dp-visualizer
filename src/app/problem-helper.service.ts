import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProblemHelperService {

  private beginingStateSource = new Subject<number>();
  private endingStateSource = new Subject<number>();
  private costTableSource = new Subject<number[]>();
  private demandTableSource = new Subject<number[]>();

  beginingState$ = this.beginingStateSource.asObservable(); 
  endingState$ = this.endingStateSource.asObservable(); 
  costTable$ = this.costTableSource.asObservable(); 
  demandTable$ = this.demandTableSource.asObservable();

  constructor() { }

  changeBeginingState(beginingState: number){
    this.beginingStateSource.next(beginingState);
  }

  changeEndingState(endingState: number){
    this.endingStateSource.next(endingState);
  }

  changeCostTable(costTable: number[]){
    this.costTableSource.next(costTable);
  }

  changeDemandTable(demandTable: number[]){
    this.demandTableSource.next(demandTable);
  }


}
