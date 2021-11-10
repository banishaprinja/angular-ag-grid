import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfiniteGridComponent } from './infinite-grid/infinite-grid.component';
import { NormalGridComponent } from './normal-grid/normal-grid.component';


const routes: Routes = [
  { path: 'normal-grid', component: NormalGridComponent },
  { path: 'infinite-grid', component: InfiniteGridComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
