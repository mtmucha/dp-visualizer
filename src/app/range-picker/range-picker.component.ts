import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ProblemType } from '../problemTypes'

@Component({
  selector: 'app-range-picker',
  templateUrl: './range-picker.component.html',
  styleUrls: ['./range-picker.component.css']
})
export class RangePickerComponent implements OnInit, OnChanges {

  disable: boolean = false;
  underline: string = "inputUnderline"

  @Input() decisionMin: number = -1;
  @Input() decisionMax: number = -1;
  @Input() startingState: number = -1;
  @Input() endingState: number = -1;
  @Input() days: number = -1;
  @Input() capacity: number = -1;
  @Input() problemType: ProblemType = -1;
  @Input() started: boolean = false;


  @Output() decisionMinChange = new EventEmitter<number>();
  @Output() decisionMaxChange = new EventEmitter<number>();
  @Output() startingStateChange = new EventEmitter<number>();
  @Output() endingStateChange = new EventEmitter<number>();
  @Output() daysChange = new EventEmitter<number>();
  @Output() capacityChange = new EventEmitter<number>();


  constructor() { 

  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.started){
      if(!this.started){
        this.underline = "inputUnderline";
      }else{
        this.underline = "noInputUnderline";
      }
    }

  }

  onDecisionMinChange(){
    this.decisionMinChange.emit(this.decisionMin);
  }

  onDecisionMaxChange(){
    this.decisionMaxChange.emit(this.decisionMax);
  }

  onStartingStateChange(){
    if(this.startingState >= 0 && this.startingState <= this.capacity)
      this.startingStateChange.emit(this.startingState);
  }

  onEndingStateChange(){
    if(this.endingState >= 0 && this.endingState <= this.capacity)
      this.endingStateChange.emit(this.endingState);
  }

  onDaysChange(){
    if(this.days > 0 && this.days < 6)
      this.daysChange.emit(this.days);
  }

  onCapacityChange(){
    if(this.capacity > 0 && this.capacity < 6)
      this.capacityChange.emit(this.capacity);
  }

  ngOnInit(): void {
  }

}
