import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { TrackTeamsComponent } from './track-teams/track-teams.component';

const routes: Routes = [
  { path: '', redirectTo: '/track', pathMatch: 'full' },
  { path: 'track', component: TrackTeamsComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '/track'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
