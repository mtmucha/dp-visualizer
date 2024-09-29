//import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, Input, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { stepsInList } from "../graph/step"
import { ProblemType } from "../problemTypes"

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css']
})
export class ValuesComponent implements OnInit, AfterViewInit {

  @Input() step: stepsInList = {} as stepsInList;
  @Input() capacity: number = -1;
  @Input() forward: boolean = true;
  //@Input() problemType: ProblemType = NaN;

  //name: string = "stock";

  constructor() { 
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(){

  }

}
