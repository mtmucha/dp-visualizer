import { AfterViewInit, Component, Input, OnInit, HostBinding, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations'
import * as d3 from 'd3'
import { ActivatedRouteSnapshot, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('high',[
      state('normal',style({
        boxShadow: 'none',
        backgroundColor: 'white',
        zIndex: 0 
      })),
      state('normal2',style({
        boxShadow: 'none',
        backgroundColor: '#e0e0e0',
        zIndex: 0 
      })),
      state('high',style({
        boxShadow: '0px 1px 1px 1px',
        backgroundColor: '#ffe082',
        zIndex: 2
      })),
      transition('normal <=> high',[
        animate('0.15s')
      ]),
      transition('normal2 <=> high',[
        animate('0.15s')
      ]),
    ])
  ]
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() bTable: number[][] = [];
  @Input() forward: boolean = true;

  headers: string[] = ['first', 'second', 'third', 'fourth']
  numberDays: number[] = [ 1, 1, 2, 2, 3, 3, 4, 4];
  //numberDayss: number[] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9];

  //numberDayss: number[] = [ 1, 1, 2, 2, 3, 3, 4, 4, 5];
  numberDayss: number[] = [ 0, 1, 1, 2, 2, 3, 3, 4, 4];
  numberStates: number[] = [4, 3, 2, 1, 0];
  index: number = 0;
  currentIntex: number = -1;
  currentIntex2: number = -1;
  //forward: boolean = false;

  idd: number = 0;
  len : number = 0;

  constructor() {
  }

  /**
   * Bind table, using d3js.
   * Currently not being used.
   */
  bindTable(){

    let rows = d3.select("#helperTable").select("tbody").selectAll("tr").data(this.bTable)

    rows.selectAll("td")
      .data((d) => d)
      .join(
        enter => enter.append("td").text(d => (d == 1000 || d == - 1000) ? "∞": <number>d),
        update => update.text(d => (d == 1000 || d == - 1000) ? "∞": <number>d)
      )
  }

  removeTable(){
    d3.select('#helperTable').select("tbody").selectAll
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(){
    this.len = this.bTable[0].length;
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.bTable && !changes.bTable.isFirstChange()){
      let curr = changes.bTable.currentValue;

      if(curr.length - this.numberStates.length != 0){
        let diff = (curr.length - this.numberStates.length);
        if(diff > 0)
          this.addRows(diff);
        else
          this.removeRows(Math.abs(diff));
      }

      if(curr[0].length != this.len){
        let diff = (curr[0].length - this.len) / 2;
        if(diff > 0)
          this.addColumns(diff);
        else
          this.removeColumns(Math.abs(diff));
      }
    }

    //when direction of calculation changes change the indexes
    if(changes.forward && !changes.forward.isFirstChange()){
      if(changes.forward.currentValue){
        this.numberDayss = [0];
        this.addColumns((this.bTable[0].length - 1) / 2);
        this.len = this.numberDayss.length;
      }else{
        this.numberDayss = [1,1,2];
        this.addColumns((this.bTable[0].length - 1) / 2 - 1);
        this.len = this.numberDayss.length;
      }
    }

  }

  addHeaders(){
  }

  /**
   * Adds columns when user changes number of columns.
   * Clunky way to do it, but offset makes it confusing.
   * @param diff difference of columns
   */
  addColumns(diff: number){
    let len = this.numberDayss.length;
    let index = this.numberDayss[len - 1] + 1;
    if(this.forward){
      //forward calculation indexes are 0 1 1 2 2
      //just incremend and add more 0 1 1 2 2 3 3
      for(let i = len; i < len + diff; i++){
        this.numberDayss.push(index);
        this.numberDayss.push(index);
        index++;
        this.len+=2;
      }
    }else{
      //when calculation backwards indexes can be  1 1 2 2 3
      //need to remove last index and then add 3  3 so it becomes 1 1 2 2 3 3 4
      this.numberDayss.pop();
      let len = this.numberDayss.length;
      let index = this.numberDayss[len - 1] + 1;
      for(let i = len; i < len + diff; i++){
        this.numberDayss.push(index);
        this.numberDayss.push(index);
        index++;
        this.len+=2;
      }
      //adding the last index
      this.numberDayss.push(this.numberDayss[this.numberDayss.length - 1] + 1);
    }
  }

  removeColumns(diff: number){
    let len = this.numberDayss.length
    if(this.forward){
      for(let i = len; i > len - diff; i--){
        this.numberDayss.pop();
        this.numberDayss.pop();
        this.len-=2;
      }
    }else{
      this.numberDayss.pop();
      for(let i = len; i > len - diff; i--){
        this.numberDayss.pop();
        this.numberDayss.pop();
        this.len-=2;
      }
      this.numberDayss.push(this.numberDayss[this.numberDayss.length - 1] + 1);
    } 
  }

  addRows(diff: number){
    for(let i = 0; i < diff; i++){
      this.numberStates.unshift(this.numberStates.length);
    }

  }

  /**
   * Removes rows when user changes number of rows. 
   * @param diff difference of rows
   */
  removeRows(diff: number){
    for(let i = 0; i < diff; i++){
      this.numberStates.shift();
    }

  }

  /**
   * Highlights cells in table. Need to take into account offset.
   * Indexes depend on direction of calculation either forward or backwards. 
   * @param currentState 
   * @param currentDay 
   * @param nextState 
   * @param nextDay 
   */
  highLight(currentState: number, currentDay: number, nextState?: number, nextDay?: number){
    this.currentIntex = -1;
    this.currentIntex2 = -1;

    if(this.forward){
      this.currentIntex = currentState * this.bTable[0].length + currentDay * 2 - 1;
      
      if(currentDay == 0){
        this.currentIntex = currentState * this.bTable[0].length + currentDay;
      }

      if(nextState != null && nextDay != null)
        this.currentIntex2 =  nextState * this.bTable[0].length + nextDay * 2 - 1;

    }else{
      this.currentIntex = currentState * this.bTable[0].length + currentDay * 2;

      if(currentDay == (this.bTable[0].length - 1) / 2){
        this.currentIntex = currentState * this.bTable[0].length + currentDay * 2; 
      }

      if(nextState != null && nextDay != null)
        this.currentIntex2 =  nextState * this.bTable[0].length + (nextDay + 1) * 2 - 2;

    }
  }

  highLightRemove(){
    this.currentIntex = -1;
    this.currentIntex2 = -1;
  }

}
