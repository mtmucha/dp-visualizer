import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KnapsackComponent } from './knapsack/knapsack.component';
import { HelperComponent } from './helper/helper.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  {path: '', redirectTo: '/bag', pathMatch: "full"},
  {path: 'stock', component: WarehouseComponent, data: {animation: 'stock'}},
  {path: 'bag', component: KnapsackComponent, data : {animation: 'bag'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
