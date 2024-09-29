import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms'

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AngularMaterialModule } from './material.module'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { GraphComponent } from './graph/graph.component';
import { ListComponent } from './list/list.component';
import { HelperComponent } from './helper/helper.component';
import { ValuesComponent } from './values/values.component';
import { ProblemComponent } from './problem/problem.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { NoPreloading, PreloadingStrategy, RouteReuseStrategy } from '@angular/router'
import { ReuseStrategyOwn} from './reuseStrategy';
import { KnapsackComponent } from './knapsack/knapsack.component';
import { ItemsComponent } from './items/items.component';
import { RangePickerComponent } from './range-picker/range-picker.component';
//import { StartingEndingComponent } from './starting-ending/starting-ending.component';
import { InfiPipePipe } from './infi-pipe.pipe';
import { KnapsackValuesComponent } from './knapsack-values/knapsack-values.component';
import { WarehouseValuesComponent } from './warehouse-values/warehouse-values.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    GraphComponent,
    ListComponent,
    HelperComponent,
    ValuesComponent,
    ProblemComponent,
    WarehouseComponent,
    KnapsackComponent,
    ItemsComponent,
    RangePickerComponent,
    InfiPipePipe,
    KnapsackValuesComponent,
    WarehouseValuesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule
  ],
  providers: [
    //{provide: RouteReuseStrategy, useClass: ReuseStrategyOwn},
    //{provide: PreloadingStrategy, useClass: NoPreloading}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
