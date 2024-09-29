import { AfterViewInit, Component, OnInit, Input, Output,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ProblemType } from '../problemTypes'

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() items: number[][] = [];
  @Input() problemType: ProblemType = -1;
  @Input() started: boolean = false;

  @Output() itemsChange = new EventEmitter<number[][]>();

  underline: string = "";

  constructor() { }

  ngOnChanges(changes: SimpleChanges){
    //used to hide underline when user click start
    if(changes.started){
      if(!this.started){
        this.underline = "inputUnderline";
      }else{
        this.underline = "noInputUnderline";
      }
    }

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void{

  }

  trackByFn<T>(index:number, item:T):any{
    return index;
  }

}
