import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import * as d3 from 'd3'
import { GraphComponent } from '../graph/graph.component';
import { Step, StepBack, stepsInList } from '../graph/step'
import { TableComponent } from '../table/table.component'
import { DoCheck } from '@angular/core'
import { Subscription } from 'rxjs';
import { ProblemHelperService } from '../problem-helper.service'
import { difference } from 'd3';
import { ActivatedRoute,Router } from '@angular/router'
//import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { ProblemType } from '../problemTypes'

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.css']
})
export class HelperComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild(GraphComponent) graphComponent!: GraphComponent;
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  @Output() started = new EventEmitter<boolean>();

  start: boolean = true;

  @Input() items: number[][] = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];

  @Input() days: number = 0;
  @Input() capacity: number = 0;

  @Input() startingState: number = 1;
  @Input() endingState: number = 3;

  @Input() decisionMin: number = 0;
  @Input() decisionMax: number = 0;

  @Input() min: boolean = false;

  forward: boolean = true;
  @Input() fixedDecisions: boolean = false;

  @Input() problemType: ProblemType = NaN; 

  table: number[][] = [];
  bTable: number[] = [];
  visitedTable: boolean[] = [];

  stepsList: stepsInList[] = [];
  stepsListBackup: stepsInList[] = [];
  forwardSteps: Step[] = [];
  backwardSteps: StepBack[] = [];

  stepCounter: number = -1;
  currentStep: stepsInList = {} as stepsInList; 

  playStopInterval: any = undefined;
  numberOfStates: number = -1;
  startingStateInverted: number = -1;
  startingDay: number = 0;

  baseValue: number = -1000;

  showingSolution : boolean = false;
  solutionPossible : boolean = false;


  constructor() {
    this.table = Array(this.capacity);

    this.numberOfStates = this.days * (this.capacity + 1);
    this.startingStateInverted = this.capacity - this.startingState;

    for(let i = 0; i < this.capacity; i++){
      this.table[i] = Array(this.days * 2 - 1).fill(1000);
    }

    this.bTable = Array(this.numberOfStates).fill(1000);
    this.visitedTable = Array(this.numberOfStates).fill(false);
    this.currentStep = {} as stepsInList;

  }

  onChangeBegining(startingStatePrevious: number){
    let startingStatePreviousInverted = this.capacity - startingStatePrevious;
    this.startingStateInverted = this.capacity - this.startingState;
    
    if(this.forward){
      this.table[this.startingStateInverted][this.startingDay] = 0;
      this.bTable[this.graphComponent.getIndex(this.startingStateInverted, this.startingDay)] = 0;

      this.table[startingStatePreviousInverted][this.startingDay] = this.baseValue;
      this.bTable[this.graphComponent.getIndex(startingStatePreviousInverted, this.startingDay)] = this.baseValue;
    }

    this.forwardSteps = [];
    //this.graphComponent.drawNodes();
    this.bTable = this.bTable.concat([]);
  }

  onChangeEnding(endingStatePrevious: number){
    let endingStatePreviousInverted = this.capacity - endingStatePrevious;
    let endingStateInverted = this.capacity - this.endingState;

    if(!this.forward){
      if(this.problemType != ProblemType.Knapsack){
        this.table[endingStateInverted][this.days * 2] = 0;
        this.bTable[this.graphComponent.getIndex(endingStateInverted, this.days)] = 0;

        this.table[endingStatePreviousInverted][this.days * 2] = this.baseValue;
        this.bTable[this.graphComponent.getIndex(endingStatePreviousInverted, this.days)] = this.baseValue;
      }  
    }
      
    this.forwardSteps = [];
    //this.graphComponent.drawNodes();
    this.bTable = this.bTable.concat([]);
  }

  setValueForward(event: any){
    this.forward = event.checked;
    this.ngOnInit();
  }


  ngOnChanges(changes: SimpleChanges){
    if(changes.startingState && !changes.startingState.isFirstChange()){
      this.onChangeBegining(changes.startingState.previousValue);
    }

    if(changes.endingState && !changes.endingState.isFirstChange()){
      this.onChangeEnding(changes.endingState.previousValue);
    }

    if(changes.min){
      if(changes.min.currentValue)
        this.baseValue = 1000;
    }

    if(changes.min){
      if(!changes.min.currentValue)
        this.baseValue = -1000;
    }

    if(changes.items){
    }

    if(changes.days && !changes.days.isFirstChange()){
      this.changeColumns(changes.days.currentValue - changes.days.previousValue);
    }

    if(changes.capacity && !changes.capacity.isFirstChange()){
      this.changeRows(changes.capacity.currentValue - changes.capacity.previousValue);
    }
  }

  changeRows(diff: number){
    if(diff > 0){
      this.addRow(diff);
    }else{
      this.removeRow(Math.abs(diff));
    }

  }

  addRow(diff: number){
    for(let j = 0; j < diff;j++){
      this.table.unshift(Array(this.days * 2 + 1).fill(this.baseValue));
    }

    this.bTable = Array((this.days + 1) * (this.capacity + 1)).fill(this.baseValue);
    this.startingStateInverted = this.capacity - this.startingState;

    if(this.forward){
      this.bTable[this.getIndex(this.startingStateInverted, this.startingDay)] = 0;
      this.table[this.startingStateInverted][0] = 0;
    }else{
      this.bTable[this.getIndex(this.capacity - this.endingState, this.days)] = 0;
      this.table[this.capacity - this.endingState][this.days * 2] = 0;
    }

    this.graphComponent.changeRowNumber(this.capacity + 1);
    this.table = this.table.concat([]);
  }

  /**
   * Removes row from table and bTable, when number of rows is changed. 
   * @param diff difference between old numbe of rows and new
   */
  removeRow(diff: number){
    for(let j = 0; j < diff;j++){
      this.table.shift();
    }

    this.bTable = Array((this.days + 1) * (this.capacity + 1)).fill(this.baseValue);
    this.startingStateInverted = this.capacity - this.startingState;

    if(this.forward){
      this.bTable[this.getIndex(this.startingStateInverted, this.startingDay)] = 0;
      this.table[this.startingStateInverted][0] = 0;
    }else{
      this.bTable[this.getIndex(this.capacity - this.endingState, this.days)] = 0;
      this.table[this.capacity - this.endingState][this.days * 2] = 0;
    }

    this.graphComponent.changeRowNumber(this.capacity + 1);
    this.table = this.table.concat([]);

  }

  changeColumns(diff: number){
    if(diff > 0){
      this.addColumn(diff);
    }else{
      this.removeColumn(Math.abs(diff));
    }
  }

  /**
   * Adds new columns to the table and bTable. 
   * @param diff difference between number of rows 
   */
  addColumn(diff: number){
    for(let j = 0; j < diff;j++){
      for(let i = 0; i <= this.capacity;i++){
        this.table[i].push(this.baseValue);
        this.table[i].push(this.baseValue);
      }
    }
    
    this.bTable = Array((this.days + 1) * (this.capacity + 1)).fill(this.baseValue);
    //this.days -= diff;

    if(this.forward){
      this.bTable[this.getIndex(this.startingStateInverted, this.startingDay)] = 0;
      this.table[this.startingStateInverted][0] = 0;
    }else{
      this.bTable[this.getIndex(this.capacity - this.endingState, this.days)] = 0;
      this.table[this.capacity - this.endingState][this.days * 2] = 0;
    }

    this.graphComponent.changeColumnNumber(this.days + 1);
    this.table = this.table.concat([]);

  }

  removeColumn(diff: number){
    for(let j = 0; j < diff;j++){
      for(let i = 0; i <= this.capacity;i++){
        this.table[i].pop();
        this.table[i].pop();
        this.bTable.pop();
      }
    }

    //this.days -= diff;
    this.bTable = Array((this.days + 1) * (this.capacity + 1)).fill(this.baseValue);

    if(this.forward){
      this.bTable[this.getIndex(this.startingStateInverted, this.startingDay)] = 0;
      this.table[this.startingStateInverted][0] = 0;
    }else{
      this.bTable[this.getIndex(this.capacity - this.endingState, this.days)] = 0;
      this.table[this.capacity - this.endingState][this.days * 2] = 0;
    }

    this.graphComponent.changeColumnNumber(this.days + 1);
    this.table = this.table.concat([]);
  }


  ngOnInit(): void {
    this.numberOfStates = (this.days + 1) * (this.capacity + 1);
    this.startingStateInverted = this.capacity - this.startingState;
    let endingStateInverted = this.capacity - this.endingState;

    for(let i = 0; i <= this.capacity; i++){
      this.table[i] = Array(this.days * 2 + 1).fill(this.baseValue);
    }

    this.bTable = Array(this.numberOfStates).fill(this.baseValue);
    this.visitedTable = Array(this.numberOfStates).fill(false);
    this.currentStep = {} as stepsInList;

    if(this.forward){
      this.table[this.startingStateInverted][0] = 0;
      this.bTable[this.getIndex(this.startingStateInverted,0)] = 0;
    }else{
      this.table[endingStateInverted][this.days * 2] = 0;
      if(this.problemType == ProblemType.Knapsack){
        for(let i = 0; i <= this.capacity;i++){
          this.bTable[this.getIndex(i,this.days)] = 0;
          this.table[i][this.days * 2] = 0;
        }
      }else{
        this.bTable[this.getIndex(endingStateInverted,this.days)] = 0;
      }
    }
  }

  ngAfterViewInit(){
  }

  /**
   * Used when user clicks start button.
   * Calculates new steps or resets parameters to start calculation again.
   */
  onStart(){
    if(this.start){
      this.forwardSteps = [];
      if(this.forward){
        this.nextStepsCalculation(this.startingState, 0);
      }else{
        if(this.problemType == ProblemType.Knapsack){
          for(let i = 0; i <= this.capacity;i++){
            this.nextStepsCalculation(i, this.days);
          }
        }else{
          this.nextStepsCalculation(this.endingState, this.days);
        }
      }
      this.start = false;
    }else{
      //resets parameters when start is pressed
      this.ngOnInit();
      this.showingSolution = false;
      this.tableComponent.highLight(-1, -1);
      this.stepsList = [];
      this.stepCounter = -1;
      this.forwardSteps = [];
      this.start = true;
      this.solutionPossible = false;
    }
    this.started.emit(!this.start);
  }

  /**
   * Shows solution if solution exists.
   * If solution is being shown, hides solution. Called when showsolution button is clicked.
   */
  showSolution(){
    if(this.showingSolution){
      //hide solution
      this.showingSolution = false;
      this.stepsList = this.stepsListBackup;
      this.graphComponent.showAllPaths();
      this.currentStep = this.stepsList[this.stepCounter];
      this.onHover(this.currentStep.id);
    }else{
      //calculate solution based on problem type
      this.showingSolution = true;
      //if problem is knapsack find best value and from there calculate solution
      if(this.problemType == ProblemType.Knapsack){
        let endingState = 0;
        let bestValue = -1000;
        for(let i = 0; i <= this.capacity;i++){
          if(this.table[i][this.days * 2 - 1] > bestValue){
            bestValue = this.table[i][this.days * 2 - 1];
            endingState = i;
          }
        }
        this.showSolutionKnapsack(this.capacity - endingState);
      }else{
        this.showSolutionStock();
      }
    }

  }

  /**
   * Calculates solution from table based on start value and end value.
   */
  showSolutionStock(){
    let startValue = this.bTable[this.getIndex(this.startingStateInverted, 0)];
    let endValue = this.bTable[this.getIndex(this.capacity - this.endingState, this.days)];

    let arr: number[][] = [];
    for(let i = 0; i < 2;i++){
      arr[i] = Array();
    }

    if(startValue != this.baseValue && endValue != this.baseValue){
      if(this.forward){
        let curr = this.endingState;

        //go from last to decision to first
        for(let i = this.days; i > 0;i--){
          arr[1].push(curr);
          curr = curr + this.items[2][i - 1] - this.table[this.capacity - curr][2 * i];
          arr[0].push(curr)
        }
      }else{
        let curr = this.startingState;

        for(let i = 0;i < this.days;i++){
          arr[0].push(curr);
          curr = curr - this.items[2][i] + this.table[this.capacity - curr][2 * i + 1];
          arr[1].push(curr)
        }
      }
    }

    this.drawSolution(arr);
  }

  /**
   * Calculates for knapsack problem .
   * @param endingState state with best value
   */
  showSolutionKnapsack(endingState : number){
    let arr: number[][] = [];
    for(let i = 0; i < 2;i++){
      arr[i] = Array();
    }

      if(this.forward){
        let curr = endingState;

        //go from last to decision to first
        for(let i = this.days; i > 0;i--){
          arr[1].push(curr);
          curr = curr + this.items[2][i - 1] - this.table[this.capacity - curr][2 * i] * this.items[1][i - 1];
          arr[0].push(curr)
        }
      }else{
        let curr = this.startingState;

        for(let i = 0;i < this.days;i++){
          arr[0].push(curr);
          curr = curr - this.items[2][i] + this.table[this.capacity - curr][2 * i + 1] * this.items[1][i];
          arr[1].push(curr)
        }
      }
    this.drawSolution(arr);
  }

  /**
   * Calculates solution from table. Stores decision in arr solution and paths.
   * Paths is used to remove not optimal paths.
   * Solution replaces list with optimal decision. 
   * @param arr 
   */
  drawSolution(arr: number[][]){
    let solution = [];
    let paths = [];

    //calculate solution from table
    if(this.forward){
      for(let i = this.days; i >= 0; i--){
        for(let s of this.stepsList){
          if(s.currentDay == this.days - i  && s.currentState == arr[0][i - 1] && s.nextState == arr[1][i - 1]){
            solution.push(s);
            paths.push(s.id);
          }
        }
      }
    }else{
      for(let i = 1; i <= this.days; i++){
        for(let s of this.stepsList){
          if(s.currentDay == i && s.currentState == arr[1][i - 1] && s.nextState == arr[0][i - 1]){
            solution.push(s);
            paths.push(s.id);
          }
        }
      }
    }

    //replace paths with optimal paths and show optimal paths in graph
    this.stepsListBackup = this.stepsList;
    this.stepsList = solution;
    this.graphComponent.solutionHighLight(paths);
    this.currentStep = this.stepsListBackup[this.stepsList[this.stepsList.length - 1].id];
    this.onHover(this.currentStep.id);
  }

  /**
   * Called when user hover over step in List component. 
   * @param event number to indentify decision in stepsList 
   */
  onHover(event: any){
    //when showing solution change current step to last step in optimal list
    if(this.showingSolution){
      let idBefore = this.currentStep.id;
      this.currentStep = this.stepsListBackup[event];
      this.graphComponent.highLightPath(this.currentStep.id, idBefore);
    }else{
      this.currentStep = this.stepsList[event];
      this.graphComponent.highLightPath(event);
    }

    //calculate indexes and call highlight
    if(this.currentStep.valid){
      this.graphComponent.highLigh(
        this.getIndex(this.currentStep.currentStateInverted, this.currentStep.currentDay),
        this.getIndex(this.currentStep.nextStateInverted, this.currentStep.nextDay)
      );
      this.tableComponent.highLight(this.currentStep.currentStateInverted, this.currentStep.currentDay, this.currentStep.nextStateInverted, this.currentStep.nextDay);
    }
    else{
      this.graphComponent.highLigh(
        this.getIndex(this.currentStep.currentStateInverted, this.currentStep.currentDay),
      );
      this.tableComponent.highLight(this.currentStep.currentStateInverted, this.currentStep.currentDay);
    }
  }

  /**
   * Push emitted line from graph to stepsList
   * @param event finished line from graph 
   */
  onStep(event: any){
    this.stepsList.push(event);
    this.stepsList = this.stepsList.concat([]);
    this.currentStep = event; 
  }

  /**
   * Called when user, hovers out of selected step.
   * Changes currentStep to last step. 
   * @param event 
   */
  onOut(event: any){
    if(this.showingSolution){
      this.currentStep = this.stepsListBackup[this.stepsList[this.stepsList.length - 1].id];
      this.graphComponent.removeHighLightPath(event, this.currentStep.id);
    }else{
      this.currentStep = this.stepsList[this.stepsList.length - 1];
      this.graphComponent.removeHighLightPath(event);
    }
    this.tableComponent.highLight(this.currentStep.currentStateInverted, this.currentStep.currentDay, this.currentStep.nextStateInverted, this.currentStep.nextDay);

    if(this.currentStep.valid){
      this.graphComponent.highLigh(
        this.getIndex(this.currentStep.currentStateInverted, this.currentStep.currentDay),
        this.getIndex(this.currentStep.nextStateInverted, this.currentStep.nextDay)
      );
    }
    else{
      this.graphComponent.highLigh(
        this.getIndex(this.currentStep.currentStateInverted, this.currentStep.currentDay),
      );
    }

  }

  /**
   * When forward button is clicked. Makes step.
   * If all steps are made check if solution exists.
   */
  onNextStep(){
    if(this.forwardSteps.length > 0)
    {
      this.stepCounter++;
      let st: Step = this.forwardSteps.shift()!;
      if(this.forward){
        this.makeStep(st.demand, st.quantity, st.currenState, st.day)
      }else{
        this.makeStepBackward(st.demand, st.quantity, st.currenState, st.day)
      }
    }
    //called when no more steps can be done
    if(this.forwardSteps.length == 0){
      this.calculateSolutionPossible();
    }
  }

  /**
   * When back button is clicked. Makes step back.
   */
  onBackStep(){
    this.stepCounter--;
    this.stepsList.pop();

    if(this.stepCounter >= 0)
      this.currentStep = this.stepsList[this.stepCounter];
    else
      this.currentStep = {} as stepsInList;
    
    if(this.forward){
      this.makeBackStepForward(this.backwardSteps.shift()!);
    }else{
      this.makeBackStepBackward(this.backwardSteps.shift()!);
    }
    this.solutionPossible = false;
  }

  /**
   * Checks if solutions is possible.
   * If we visited starting and ending state, solution is possible.
   */
  calculateSolutionPossible(){
    if(this.problemType == ProblemType.Stock){
      let startValue = this.bTable[this.getIndex(this.startingStateInverted, 0)];
      let endValue = this.bTable[this.getIndex(this.capacity - this.endingState, this.days)];

      if(startValue != this.baseValue && endValue != this.baseValue){
        this.solutionPossible = true;
      }
    }else{
      this.solutionPossible = true;
    }
  }

  /**
   * Used for play stop button, not being used.
   */
  onPlayStop(){
    if(this.playStopInterval == undefined)
      this.playStopInterval =  setInterval(() => this.onNextStep(), 1000);
    else{
      clearInterval(this.playStopInterval);
      this.playStopInterval = undefined
    }

    if(this.forwardSteps.length == 0){
      clearInterval(this.playStopInterval);
      this.playStopInterval = undefined
    }
  }

  getIndex(row : number, column: number): number{
    return row * (this.days + 1) + column;
  }

  /**
   * Calculates possible new steps, if decision range is not fixed.
   * Currently not being used. 
   * @param currentState current state 
   * @param day current day 
   */
  nextStepsCalculation(currentState: number, day: number){
    let minValue: number = Math.max(this.items[2][day] - currentState, 0);
    let maxValue: number = Math.floor((this.capacity   - currentState) / this.items[1][day]);

    if(this.forward){
      for(let i = this.decisionMin; i <= this.decisionMax;i++)
        this.addStep(this.items[2][day], i, currentState, day);
    }else{
      for(let i = this.decisionMin; i <= this.decisionMax;i++)
        this.addStep(this.items[2][day - 1], i, currentState, day);
    }

    if(this.forward){
      this.forwardSteps.sort((a, b) => {
        if(a.day == b.day)
          return a.currenState - b.currenState;
        return a.day - b.day;
      });
    }else{
      this.forwardSteps.sort((a, b) => {
        if(a.day == b.day)
          return b.currenState - a.currenState;
        return b.day - a.day;
      });
    }

  }

  /**
   * Add step into the list 
   * @param demand 
   * @param quantity 
   * @param currentState 
   * @param day 
   */
  addStep(demand: number, quantity: number, currentState: number, day: number){
    this.forwardSteps.push(
      {demand: demand, currenState: currentState, day: day, quantity: quantity}
    );
  }

  addBackwardStep(demand: number, quantity: number, currentState: number, nextState: number, day: number, valueBefore: number, zValueBefore: number, valid: boolean){
    this.backwardSteps.unshift(
      {
        demand: demand,
        quantity: quantity, 
        currenState: currentState, 
        nextState: nextState, 
        day: day,
        valueBefore: valueBefore, 
        zValueBefore: zValueBefore, 
        valid: valid
      }
    );
  }

  /**
   * Calculates possible new steps, checks if decision is valid.
   * @param capacity current capacity
   * @param currentState current state
   * @param quantity current quantity 
   * @param demand current demand 
   * @param day current day 
   * @returns returns valid or invalid step 
   */
  nextStateCalculation(capacity: number, currentState: number, quantity: number, demand: number, day : number): nextStateReturn{
    let nextState = -1;

    if(this.forward){
      nextState = (capacity - (currentState + ((quantity - demand) * this.items[1][day])));
      if(quantity + currentState > this.capacity)      
        return {valid: false, nextState: nextState};
    }
    else{
      nextState = (capacity - (currentState - (quantity - demand) * this.items[1][day - 1]));

      if(currentState + demand > this.capacity){
        return {valid: false, nextState: nextState};
      }
    }

    if(nextState < 0 || nextState > this.capacity)
      return {valid: false, nextState: nextState};
    return {valid: true, nextState: nextState};
  }

  /**
   * Makes step forward, for backwards calculations. 
   * @param demand demand for item
   * @param quantity quantity 
   * @param state currentState 
   * @param currentDay currentDay 
   */
  makeStepBackward(demand: number, quantity: number, state: number, currentDay: number){
    let nn : nextStateReturn = this.nextStateCalculation(this.capacity, state, quantity, demand, currentDay);
    let nextState: number = nn.nextState;
    let currentState: number = this.capacity - state;

    let nextDay: number = currentDay - 1;

    let currentIndex: number = this.getIndex(currentState, currentDay);
    let currentValue: number = this.bTable[currentIndex];

    //partial step, values used for both valid and invalid step
    let partialStepinList: Partial<stepsInList> = 
    {
      id: this.stepCounter, 
      currentState: this.capacity - currentState,
      currentStateInverted: currentState,
      currentDay: currentDay, 
      nextDay: nextDay,
      currentValue: this.bTable[this.getIndex(currentState, currentDay)],
      price: this.items[0][currentDay - 1],
      demand: this.items[2][currentDay - 1],
      quantity: quantity,
      weight: this.items[1][currentDay - 1],
      valid: nn.valid,
      oldNextValue: this.baseValue,
    };

    //if step is valid calculate value
    if(nn.valid){
      let nextIndex: number = this.getIndex(nextState, nextDay);
      let nextValue: number = this.bTable[nextIndex];
      let newNextValue: number = currentValue + quantity * this.items[0][currentDay - 1];

      partialStepinList.oldNextValue = this.bTable[nextIndex];
      partialStepinList.nextStateInverted = nextState;
      partialStepinList.nextState= this.capacity - nextState;

      //decision limit to display for user, not needed for calculation
      this.addDecisionLimit(partialStepinList);

      //change graph values if new calculated values are more optimal 
      this.changeValueGraph(nextIndex, nextValue, newNextValue);
      partialStepinList.nextValue = this.bTable[nextIndex];
      partialStepinList.decisionMax = Math.floor((nextState) / this.items[1][nextDay]),

      //add backward step
      this.addBackwardStep(demand, quantity, state, nextState, currentDay, nextValue, this.table[nextState][currentDay* 2 + 2], nn.valid);
      setTimeout(() =>this.changeValueTable(nextValue, newNextValue, quantity, nextState, currentDay), 500);

      if(0 != nextDay)
        this.addNewSteps(nextIndex, this.capacity - nextState, nextDay);
    }

    if(!nn.valid)
      this.addBackwardStep(demand, quantity, state, nextState, currentDay, -1, -1, false);

    //draw step in graph
    this.graphComponent.drawStep(currentState, nextState, currentDay, nextDay, true, true, partialStepinList, nn.valid);

    //hightlight step in table
    if(nn.valid){
      this.tableComponent.highLight(currentState, currentDay, nextState, nextDay);
    }
    else{
      this.tableComponent.highLight(currentState, currentDay);
    }

  };

  /**
   * Makes step forward. 
   * @param demand item demand 
   * @param quantity quantity decision 
   * @param state currentState 
   * @param currentDay currentDay 
   */
  makeStep(demand: number, quantity: number, state: number, currentDay: number){
    let nn : nextStateReturn = this.nextStateCalculation(this.capacity, state, quantity, demand, currentDay);
    let nextState: number = nn.nextState;
    let currentState: number = this.capacity - state;

    let nextDay: number = currentDay + 1;

    let currentIndex: number = this.getIndex(currentState, currentDay);
    let currentValue: number = this.bTable[currentIndex];

    let partialStepinList: Partial<stepsInList> = 
    {
      id: this.stepCounter, 
      currentState: state,
      currentStateInverted: currentState,
      currentDay: currentDay, 
      nextDay: nextDay,
      currentValue: this.bTable[this.getIndex(currentState, currentDay)],
      price: this.items[0][currentDay],
      demand: this.items[2][currentDay],
      quantity: quantity,
      weight: this.items[1][currentDay],
      valid: nn.valid,
      oldNextValue: this.baseValue,
      decisionMax: Math.floor((this.capacity - state) / this.items[1] [currentDay]),
    };

    this.addDecisionLimit(partialStepinList);

    if(nn.valid){
      let nextIndex: number = this.getIndex(nextState, nextDay);
      let nextValue: number = this.bTable[nextIndex];
      let newNextValue: number = currentValue + quantity * this.items[0][currentDay];

      partialStepinList.oldNextValue = this.bTable[nextIndex];
      partialStepinList.nextStateInverted = nextState;
      partialStepinList.nextState= this.capacity - nextState;
      this.changeValueGraph(nextIndex, nextValue, newNextValue);
      partialStepinList.nextValue = this.bTable[nextIndex];

      this.addBackwardStep(demand, quantity, state, nextState, currentDay, nextValue, this.table[nextState][currentDay* 2 + 2], nn.valid);
      setTimeout(() =>this.changeValueTable(nextValue, newNextValue, quantity, nextState, currentDay), 500);

      if(this.days != nextDay)
        this.addNewSteps(nextIndex, this.capacity - nextState, nextDay);
    }

    if(!nn.valid)
      this.addBackwardStep(demand, quantity, state, nextState, currentDay, -1, -1, false);

    this.graphComponent.drawStep(currentState, nextState, currentDay, nextDay, true, true, partialStepinList, nn.valid);

    if(nn.valid){
      this.tableComponent.highLight(currentState, currentDay, nextState, nextDay);
    }
    else{
      this.tableComponent.highLight(currentState, currentDay);
    }
  }

  /**
   * Calculates decision limit to be displayed for user, not needed for computation.
   * Values are based on problem type.
   * @param step 
   */
  addDecisionLimit(step: Partial<stepsInList>){
    if(this.forward){
      switch(this.problemType){
        case ProblemType.Stock:{
          step.decisionMin = Math.max(0, step.demand! - step.currentState!);
          break; 
        }
        case ProblemType.Knapsack:{
          step.decisionMin = 0;
          break; 
        }
        case ProblemType.Tickets:{
          step.decisionMin = 0 - step.currentState!;
          break; 
        }
      }
    }else{
      switch(this.problemType){
        case ProblemType.Stock:{
          step.decisionMin = Math.max(0, step.demand! - step.nextState!);
          break; 
        }
        case ProblemType.Knapsack:{
          step.decisionMin = 0;
          break; 
        }
        case ProblemType.Tickets:{
          step.decisionMin = 0 - step.nextState!;
          break; 
        }
      }
    }
  }


  changeValueGraph(nextIndex: number, nextValue: number, newNextValue: number){
    if(this.min){
      this.bTable[nextIndex] = Math.min(nextValue, newNextValue);
    }else{
      this.bTable[nextIndex] = Math.max(nextValue, newNextValue);
    }
  }

  /**
   * Changes values in talbe based on parameters.
   * Needs to calculate offset and change the values. 
   * @param nextValue 
   * @param newNextValue 
   * @param quantity 
   * @param nextState 
   * @param currentDay 
   */
  changeValueTable(nextValue: number, newNextValue: number, quantity: number, nextState: number, currentDay: number){
    let offSet = -1;
    if(this.forward)
      offSet = 1;

    if(this.forward){
      if(this.min){
        if(nextValue > newNextValue)
        {
          this.table[nextState][currentDay * 2 + 1] = newNextValue;
          this.table[nextState][currentDay * 2 + 2] = quantity;
        }
      }else{
        if(nextValue < newNextValue)
        {
          this.table[nextState][currentDay * 2 + 1] = newNextValue;
          this.table[nextState][currentDay * 2 + 2] = quantity;
        }
      }
    }else{
      if(this.min){
        if(nextValue > newNextValue)
        {
          this.table[nextState][currentDay * 2 - 2] = newNextValue;
          this.table[nextState][currentDay * 2 - 1] = quantity;
        }
      }else{
        if(nextValue < newNextValue)
        {
          this.table[nextState][currentDay * 2 - 2] = newNextValue;
          this.table[nextState][currentDay * 2 - 1] = quantity;
        }
      }
    }

    this.table = this.table.concat([]);
  }

  addNewSteps(nextIndex: number, nextStateInverted: number, nextDay: number){
    if(!this.visitedTable[nextIndex])
    {
      this.visitedTable[nextIndex] = true;
      this.nextStepsCalculation(nextStateInverted, nextDay);
    }
  }

  /**
   * Restores previous values for table and graph, then adds step back in forwardSteps.
   * This functions is called when forward = true.
   * @param sBack contains previous values 
   */
  makeBackStepForward(sBack: StepBack){
    //add current step to forward step to be performed again
    //when user clicks forward button
    this.forwardSteps.unshift({currenState: sBack.currenState, demand: sBack.demand, quantity: sBack.quantity, day: sBack.day});

    let nextState : number = sBack.nextState;
    let nextStateInverted: number = this.capacity - nextState;
    let nextDay: number = sBack.day + 1;
    let currentStateInverted: number = this.capacity - sBack.currenState;
    let nextStateIndex: number = this.getIndex(nextState, nextDay);

    //If step is valid change values back
    if(sBack.valid){
      this.bTable[nextStateIndex] = sBack.valueBefore;
      this.table[nextState][nextDay * 2 - 1] = sBack.valueBefore;
      this.table[nextState][nextDay * 2] = sBack.zValueBefore;
    }

    let aa : StepBack = {} as StepBack;

    if(this.stepCounter >= 0){
      aa = this.backwardSteps[0];
    }else{
      aa.valid = false;
      aa.currenState = sBack.currenState;
      aa.day = sBack.day;
    }

    //remove 2 paths 
    this.graphComponent.removeLashPath();
    this.graphComponent.removeLashPath();

    //last one is drawn again to signal user what is the current step
    this.graphComponent.drawStep(this.capacity - aa.currenState, aa.nextState, aa.day, aa.day + 1, false, false,{}, aa.valid);

    //highlight table
    if(sBack.valid)
      this.tableComponent.highLight(this.capacity - aa.currenState, aa.day, aa.nextState, aa.day + 1);
    else
      this.tableComponent.highLight(this.capacity - aa.currenState, aa.day);

    this.table = this.table.concat([]);
    this.stepsList.concat([]);
  }

  /**
   * Restores previous values for table and graph, then adds step back in forwardSteps.
   * This functions is called when calculation is made backwards, forward = false.
   * @param sBack contains previous values 
   */
  makeBackStepBackward(sBack: StepBack){
    this.forwardSteps.unshift({currenState: sBack.currenState, demand: sBack.demand, quantity: sBack.quantity, day: sBack.day});

    let nextState : number = sBack.nextState;
    let nextStateInverted: number = this.capacity - nextState;
    let nextDay: number = sBack.day;
    let currentStateInverted: number = this.capacity - sBack.currenState;
    let nextStateIndex: number = this.getIndex(nextState, nextDay - 1);

    //If step is valid change values back
    if(sBack.valid){
      this.bTable[nextStateIndex] = sBack.valueBefore;
      this.table[nextState][nextDay * 2 - 2] = sBack.valueBefore;
      this.table[nextState][nextDay * 2 - 1] = sBack.zValueBefore;
    }

    let aa : StepBack = {} as StepBack;

    if(this.stepCounter >= 0){
      aa = this.backwardSteps[0];
    }else{
      aa.valid = false;
      aa.currenState = sBack.currenState;
      aa.day = sBack.day;
    }

    this.graphComponent.removeLashPath();
    this.graphComponent.removeLashPath();
    this.graphComponent.drawStep(this.capacity - aa.currenState, aa.nextState, aa.day, aa.day - 1, false, false,{}, aa.valid);

    if(sBack.valid)
      this.tableComponent.highLight(this.capacity - aa.currenState, aa.day, aa.nextState, aa.day - 1);
    else
      this.tableComponent.highLight(this.capacity - aa.currenState, aa.day);

    this.table = this.table.concat([]);
    this.bTable.concat([]);
  }

}

interface nextStateReturn{
  valid: boolean
  nextState: number
}
