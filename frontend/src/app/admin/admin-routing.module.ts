import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from '../auth.guard';
import { ReviewComponent } from './review/review.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'adminDashboard',
    pathMatch: 'full'
  },

  {
    path: 'adminDashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reviews',
    component: ReviewComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
