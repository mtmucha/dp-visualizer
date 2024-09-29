import { Component, Input, OnInit, Output, EventEmitter, Renderer2, ViewChild, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { stepsInList } from '../graph/step';
import * as d3 from 'd3';
import { animate, transition, state, style, trigger } from '@angular/animations';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ProblemType } from '../problemTypes'
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [
    trigger('highlighted',[
      state('normal', style({
        boxShadow: "none",
        zIndex:0 
      })),
      state('high',style({
        boxShadow: "1px 1px 8px",
        zIndex: 2
      })),
      transition('normal => high', [
        animate('0.1s')
      ]),
      transition('high => normal', [
        animate('0.1s')
      ])
    ])
  ]
})

export class ListComponent implements OnInit, OnChanges{

  @Input() stepsList: stepsInList[] = [];
  @Input() problemType: ProblemType = NaN;
  @Input() forward: boolean = true;

  @Output() id = new EventEmitter<number>();
  @Output() out = new EventEmitter<number>();

  
  //@ViewChild('cmp') list: any;
  //@ViewChild('CdkVirtualScrollViewport') viewPort!: CdkVirtualScrollViewport;

  hoverBool: boolean = false;
  selectedIntex = -1;

  constructor(private renderer: Renderer2) { 

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.stepsList && !changes.stepsList.isFirstChange()){
      let pomoc = this.stepsList.length - 1;
      setTimeout(() => document.getElementById("stepContent0")?.scrollIntoView({behavior: "smooth", block: "center"}),0);
    }

  }

  onMouseOver(stepId : number){
    this.selectedIntex = stepId;
    this.id.emit(this.selectedIntex);
  }

  onMouseOut(){
    this.hoverBool = false;
    d3.select("#line2").remove();
    d3.select("#gLine").remove();
    this.out.emit(this.selectedIntex);
    this.selectedIntex = -1;
  }

}
