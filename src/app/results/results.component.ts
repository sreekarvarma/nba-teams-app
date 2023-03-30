import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Game } from '../interfaces/game';
import { Team } from '../interfaces/team';
import { ApiRequestsService, Last12DaysGamesResponse } from '../services/api-requests.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  games!: Game[];
  teamId!: number;
  teamData!: Team;
  loadingTeamData: boolean = false;
  loadingGames: boolean = false;

  constructor(
    private apiRequestsService: ApiRequestsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getTeamIdFromParams()
    this.getTeamData()
    this.getTeamGames()
  }
  
  getTeamIdFromParams() {
    this.activatedRoute.params.subscribe((res: Params) => {
      this.teamId = res['teamCode'];
    })
  }

  getTeamData() {
    this.loadingTeamData = true
    this.apiRequestsService.getTeam(Number(this.teamId)).subscribe((res: Team) => {
      this.teamData = res;
      this.loadingTeamData = false
    })
  }

  getTeamGames() {
    this.loadingGames = true
    this.apiRequestsService.last12DaysGames(this.teamId).subscribe((res: Last12DaysGamesResponse) => {
      this.games = res.data;
      this.loadingGames = false
    })
  }

  goBack(){
    this.location.back();
  }

}
