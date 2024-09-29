import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import * as d3 from 'd3'
//import * as EventEmitter from 'events';
import { Step, stepsInList, StepBack } from './step'
import { interpolatePuBu, path } from 'd3';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit, OnChanges {

  @Output() values = new EventEmitter<stepsInList>();
  @Input() bTable: number[] = [];
  @Input() forward: boolean = true;

  days: number = 5;
  capacity : number = 4;

  visitedTable: number [] = [];

  pathCounter: number = 0;

  index: number = 0;
  xPosition: number = 0;
  yPosition: number = 0;

  startingPositionX: number = 0;
  startingPositionY: number = 0;

  stepX: number = 0;
  stepY: number = 0;

  line: any;
  lineLength: number = 0;
  lenn: number = 0;

  forwardSteps: Step[] = [];
  backwardSteps: StepBack[] = [];

  stepsList: stepsInList[] = [];
  currentHoverLine: any;

  stepCounter: number = 0;

  currentHighLightIndex: number = 0;
  nextHighLightIndex: number = 0;

  currentIndex: number = 0;
  nextIndex: number = 0;

  staringDay: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.stepX = Math.floor(250 / (this.days));
    this.stepY = 100 / (this.capacity + 1);
    this.visitedTable = Array(this.days * (this.capacity + 1)).fill(-1);
  }

  getIndex(row : number, column: number): number{
    return row * this.days + column;
  }

  ngAfterViewInit(){
    this.index = 0;
    this.pathCounter = 0;

    if(this.forward){
      this.startingPositionX = (this.stepX / 2 + this.stepX) / 2;
    }else{
      this.startingPositionX = (this.stepX);
    }
    this.yPosition =  (100 - ((this.capacity) * this.stepY)) / 2;
    this.startingPositionY = (100 - (this.capacity * this.stepY)) / 2;
    this.staringDay = 4;

    setTimeout(() => this.nodesInit());
  }

  nodesInit(){
    this.drawNodes();
    d3.select("#platno2").selectAll("g")
      .append("text").text(d => (d == 1000 || d == - 1000) ? "∞": <number>d)
      .attr("font-size", 4)
      .attr("text-anchor","middle")
      .attr("dominant-baseline", "middle")
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.bTable && !changes.bTable.isFirstChange()){
      this.index = 0;
      this.pathCounter = 0;

      this.startingPositionX = (this.stepX / 2 + this.stepX) / 2;
      this.yPosition =  (100 - ((this.capacity) * this.stepY)) / 2;
      this.startingPositionY = (100 - (this.capacity * this.stepY)) / 2;

      d3.select("#platno2").selectAll(".node-class").remove();
      d3.selectAll("path").remove();

      this.stepX = 250 / (this.days);
      this.stepY = 100 / (this.capacity + 1);
      //this.drawNodes();
      //this.bindText();
      this.ngAfterViewInit();
    }

    if(changes.forward && !changes.forward.isFirstChange()){
      d3.select("#platno2").selectAll(".node-class").remove();
      d3.selectAll("path").remove();
      this.stepX = 250 / (this.days);
      this.stepY = 100 / (this.capacity + 1);
      //this.ngAfterViewInit();
    }
  }


  /**
   * Recalculates positions of circles when, number of columns changes 
   * @param d number of days
   */
  changeColumnNumber(d: number){
    this.days = d;
    this.stepX = 250 / (this.days);
    this.index = 0;
    this.startingPositionX = (this.stepX / 2 + this.stepX) / 2;
    this.yPosition = 0;
    this.yPosition =  (100 - ((this.capacity) * this.stepY)) / 2;
    this.startingPositionY = (100 - (this.capacity * this.stepY)) / 2;
  }

  /**
   * Recalculates positions of circles, when number of rows changes
   * @param d number of rows 
   */
  changeRowNumber(d: number){
    this.index = 0;
    this.capacity = d - 1;
    this.stepY = 100 / (this.capacity + 1);
    this.xPosition = 0;
    this.yPosition = 0;
    this.yPosition =  (100 - (this.capacity * this.stepY)) / 2;
    this.startingPositionY = (100 - (this.capacity * this.stepY)) / 2;
    this.startingPositionX = (this.stepX / 2 + this.stepX) / 2;

  }

  /**
   * Binds, text to the circles
   */
  bindText(){
    d3.select("#platno2").selectAll("g")
      .append("text")
      .text(d => (d == 1000 || d == - 1000) ? "∞": <number>d)
      .attr("font-size", 4)
      .attr("text-anchor","middle").attr("dominant-baseline", "middle")
  }

  /**
   * Draws all circles(nodes).
   */
  drawNodes(){
    let placementFunction: any;
    if(this.forward){
      placementFunction = this.nodePlacementForward.bind(this);
    }else{
      placementFunction = this.nodePlacementBackwards.bind(this);
    }

    d3.select("#platno2").selectAll(".node-class")
      .data(this.bTable)
      .join(
          enter => enter.append("g")
              .attr("class", "node-class")
              .attr("preserveAspectRatio", "xMidYMid meet")
              .attr("transform", placementFunction)
              .append("circle")
                .attr("r", "5")
                .attr("fill", "#e4eced")
                .attr("stroke", "black")
                .attr("stroke-width", 0.1)
                .attr("filter", "url(#shadow)")
              ,
          update => update.select("text").text(d => (d == 1000 || d == - 1000) ? "∞": <number>d)
      )
  };

  /**
   * Called for every circle, calculates precise positions of circle. 
   * Called in {@link drawNodes}.
   * @returns position of circle 
   */
  nodePlacementForward(): any{
    if(this.index == this.days){
      this.index=0;this.yPosition += this.stepY;
    };

    if(this.index == 1)
      this.xPosition = this.startingPositionX + (this.stepX / 4) * 3;
    else if(this.index >= 2)
      this.xPosition = this.startingPositionX +  (this.stepX * (this.index)) - this.stepX / 4;
    else
      this.xPosition = this.startingPositionX +  (this.stepX * (this.index));
    this.index++;

    return `translate(${this.xPosition},${this.yPosition})`;
  }

  /**
   * Used for calculating position of nodes in graph, when calculation is done backwards. 
   * @returns node position
   */
  nodePlacementBackwards(): any{
    if(this.index == this.days){
      this.index=0;this.yPosition += this.stepY;
    };

    this.xPosition = this.startingPositionX + this.stepX * this.index;

    if(this.index == this.days - 1)
      this.xPosition = this.startingPositionX + this.stepX * this.index - this.stepX / 4;
    this.index++;

    return `translate(${this.xPosition},${this.yPosition})`;
  }

  /**
   * Draws step, on based parameters 
   * @param currentState current state 
   * @param nextState next state 
   * @param currentDay current day 
   * @param nextDay next day 
   * @param delay whether, delay should be used for drawing 
   * @param forward direction of calculation
   * @param stepInList pariatl step 
   * @param valid step validity 
   */
  drawStep(currentState: number, nextState: number, currentDay: number, nextDay: number, delay: boolean, forward: boolean, stepInList: Partial<stepsInList>, valid: boolean){
    this.removePath();
    if(delay){
      setTimeout(() => this.drawNodes(), 500)
    }
    else{
      this.drawNodes();
    }

    if(valid){
      // if step is valid draw line and higlight nodes
      this.createLine(currentState, nextState, currentDay, nextDay, forward, stepInList);
      this.makePath2();
      let currentLine: SVGPathElement= d3.select("path").node() as SVGPathElement 
      let len = currentLine.getTotalLength();
      this.drawPath2();
      this.highLigh(this.getIndex(currentState, currentDay), this.getIndex(nextState, nextDay));

    }else{
      this.highLigh(this.getIndex(currentState, currentDay));
      if(forward)
        this.values.emit(<stepsInList>stepInList);
    }
    this.pathCounter++;
  }

  /**
   * Highlights nodes, based on index. Removes highlight when indices change.
   * @param index1 index of first node
   * @param index2 index of second node 
   */
  highLigh(index1: number, index2?: number){
    if(index1 != this.currentHighLightIndex){
      this.removeColorState(this.currentHighLightIndex);
    }
    this.removeColorState(this.nextHighLightIndex);
    this.currentHighLightIndex = index1;
    if(index2)
      this.nextHighLightIndex = index2;

    this.colorState(index1);
    if(index2)
      this.colorState(index2);
  }

  /**
   * Highlights path based on index. 
   * @param id id of path to hightlight 
   * @param id2 index of path to remove hightlight
   */
  highLightPath(id: number, id2? : number){
    let s2: string = "";
    if(id2 != null){
      s2 = "#idd" + id2;
    }else{
      s2 = "#idd" + (this.pathCounter - 1);

    }
    d3.selectAll(s2).style("opacity", "0.3");
    let s: string = "#idd" + id;
    d3.selectAll(s).style("opacity", "1");
  }

  removeHighLightPath(id: number, id2? : number){
    let s: string = "#idd" + id;
    d3.selectAll(s).style("opacity", "0.3");

    let s2 = "";
    if(id2 != null){
      s2 = "#idd" + (id2);
    }else{
      s2 = "#idd" + (this.pathCounter - 1);
    }
    d3.selectAll(s2).style("opacity", "1");
  }

  removeHighLight(){
    this.removeColorState(this.currentHighLightIndex);
    this.removeColorState(this.nextHighLightIndex);
    this.currentHighLightIndex = -1;
    this.nextHighLightIndex = -1;
  }


  createLine(currentState: number, nextState: number, currentDay: number, nextDay: number, forward: boolean, stepInList: Partial<stepsInList>){
    let getCoordinates: any;
    let coor;

    if(this.forward){
      coor = this.getCoordinatesForward(currentDay, currentState, nextDay, nextState)
    }else{
      coor = this.getCoordinatesBackward(currentDay, currentState, nextDay, nextState)
    }

    this.setLine(coor[0], coor[2], coor[1], coor[3]);

    if(forward)
      this.values.emit(<stepsInList>stepInList);
  }

  /**
   * Calculates coordinates based on parameters. 
   * @param currentDay 
   * @param currentState 
   * @param nextDay 
   * @param nextState 
   * @returns 
   */
  getCoordinatesForward(currentDay: number, currentState: number, nextDay: number, nextState: number): number[]{
    let x1 = this.startingPositionX + currentDay * this.stepX - (this.stepX / 4); 
    let y1 = this.startingPositionY + (currentState) * this.stepY;
    let x2 = this.startingPositionX + (nextDay) * this.stepX - (this.stepX / 4);
    let y2 = this.startingPositionY + (nextState) * this.stepY;

    if(currentDay == 0){
      x1 = this.startingPositionX + currentDay * this.stepX / 4 * 3; 
      y1 = this.startingPositionY + (currentState) * this.stepY;
      x2 = this.startingPositionX + (nextDay) * this.stepX / 4 * 3;
      y2 = this.startingPositionY + (nextState) * this.stepY;
    }

    return [x1, y1, x2, y2];
  }

  /**
   * Calculates coordinates based on parameter. 
   * @param currentDay 
   * @param currentState 
   * @param nextDay 
   * @param nextState 
   * @returns 
   */
  getCoordinatesBackward(currentDay: number, currentState: number, nextDay: number, nextState: number): number[]{
    let x1 = this.startingPositionX + currentDay * this.stepX; 
    let y1 = this.startingPositionY + (currentState) * this.stepY;
    let x2 = this.startingPositionX + (nextDay) * this.stepX;
    let y2 = this.startingPositionY + (nextState) * this.stepY;

    if(currentDay == this.days - 1){
      x1 = this.startingPositionX + currentDay * this.stepX  - this.stepX / 4; 
      y1 = this.startingPositionY + (currentState) * this.stepY;
      x2 = this.startingPositionX + (nextDay) * this.stepX;
      y2 = this.startingPositionY + (nextState) * this.stepY;
    }

    return [x1, y1, x2, y2];
  }

  setLine(x1: number, x2: number, y1: number, y2: number){
    this.line = d3.line()([[x1, y1], [x2, y2]]);
  }

  createLine2(x1: number, x2: number, y1: number, y2: number): number{
    this.line = d3.line()([[x1, y1], [x2, y2]]);
    this.makePath();
    let currentLine: SVGPathElement= d3.select("path").node() as SVGPathElement 
    let len = currentLine.getTotalLength();
    return len;
  }

  removePathId(id : number){
    let s = "#idd" + id;
    ("ID : " + id);
    d3.select(s).remove();
  }

  removeLashPath(){
    this.removePathId(this.pathCounter - 1);
    this.pathCounter--;
    ("REMOVE LAST PATH");
    ("this.pathCounter: " + this.pathCounter);
  }


  removePath(){
    d3.selectAll("path").style("opacity", "0.3");
  }

  makePath(){
    var path=d3.select("#platno2")
      .append("g")
      .attr("class","line-class")
      .lower()
      .attr("transform","translate(0,0)")
      .append("path")
      .attr("d", this.line)
      .attr("stroke", "blue")
      .attr("stroke-width", 3)
      .attr("fill", "none")

  }

  /**
   * Creates path, which is then being drawn. 
   */
  makePath2(){
    var path=d3.select("#platno2")
      .append("g")
      .attr("class","line-class")
      .lower()
      .attr("transform","translate(0,0)")
      .append("path")
      .attr("d", this.line)
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("id", ("idd" + this.pathCounter));

    let currentLine: SVGPathElement= d3.select("path").node() as SVGPathElement 
    let len = currentLine.getTotalLength();
    this.lineLength = len;
  }

  drawPath(len: number){
    d3.select("path")
        .attr("stroke-dasharray", len + " " + len)
        .attr("stroke-dashoffset", len)
        .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
  }

  /**
   * Animates path. Gives ilusion of path being drawn.
   */
  drawPath2(){
    d3.select("path")
        .attr("stroke-dasharray", this.lineLength + " " + this.lineLength)
        .attr("stroke-dashoffset", this.lineLength)
        .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
  }

  colorState(index: number){
    d3.selectAll("circle").filter((d,i) => index == i).transition().duration(150).style("fill","#ffe082")
  }

  removeColorState(index: number){
    d3.selectAll("circle").filter((d,i) => index == i).transition().duration(150).style("fill","#e4eced")
  }


  /**
   * Highlights only paths that are path of the solution 
   * @param arr contains indices of path that create the solution 
   */
  solutionHighLight(arr : number[]){
    d3.selectAll("path").style("opacity", "0");
    for(let a of arr){
      let s = "#idd" + a;
      d3.select(s).style("opacity","0.3");
    }

  }

  showAllPaths(){
    d3.selectAll("path").style("opacity", "0.3");
  }

}
