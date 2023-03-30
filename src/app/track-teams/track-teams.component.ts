import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Game } from '../interfaces/game';
import { Team } from '../interfaces/team';
import { AllTeamsResponse, ApiRequestsService, Last12DaysGamesResponse } from '../services/api-requests.service';

interface TrackedTeam {
  trackedTeam: Team;
  games: Game[];
}

@Component({
  selector: 'app-track-teams',
  templateUrl: './track-teams.component.html',
  styleUrls: ['./track-teams.component.css']
})
export class TrackTeamsComponent implements OnInit {

  teams: Team[] = [];
  selectedTeam = new FormControl('')
  fetchingTeams: boolean = false;
  teamSelected: boolean = false;
  fetchingTeamGames: boolean = false;
  trackedTeams: TrackedTeam[] = [];

  constructor(
    private apiRequestsService: ApiRequestsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.getAllTeams();
    this.selectedTeam.valueChanges.subscribe((res: Partial<string | null>) => {
      if (res) {
        this.teamSelected = true;
      } else {
        this.teamSelected = false;
      }
    }
    )
  }

  getAllTeams() {
    this.fetchingTeams = true;
    this.apiRequestsService.allTeams().subscribe((res: AllTeamsResponse) => {
      this.teams = res.data;
      this.fetchingTeams = false;
      this.updateTeamGamesOnParamsChange();
    })
  }

  updateTeamGamesOnParamsChange() {
    this.activatedRoute.params.subscribe((res: Params) => {
      const trackedTeamIdsFromParams = res['trackedTeamIds'];
      if(!trackedTeamIdsFromParams) {
        if (this.trackedTeams.length > 0) {
          this.trackedTeams = [];
        }
        return;
      }
      const trackedTeamIds = trackedTeamIdsFromParams.split(',');
      this.trackedTeams = this.trackedTeams.filter((trackedTeam: TrackedTeam) => trackedTeamIds.includes(trackedTeam.trackedTeam.id.toString()))
      trackedTeamIds.forEach((teamId: string) => {
        if (this.trackedTeams.find((team: TrackedTeam) => team.trackedTeam.id === Number(teamId))) {
          return;
        }
        this.fetchingTeamGames = true;
        this.apiRequestsService.last12DaysGames(Number(teamId)).subscribe((res: Last12DaysGamesResponse) => {
          this.addTeamToTrackedFromParams(res.data, Number(teamId));
          this.fetchingTeamGames = false;
        }
        )
    })
  })
  }

  addTeamToTrackedFromParams(games: Game[], teamId: number) {
    const trackedTeamData = this.teams.find((team: Team) => team.id === Number(teamId));
    this.trackedTeams.push({
      trackedTeam: trackedTeamData!,
      games: games
    })
  }

  removeTeamFromTracked(teamId: number) {
    const trackedTeamIds = this.trackedTeams.map((team: TrackedTeam) => team.trackedTeam.id).filter((id: number) => id !== teamId);
    this.router.navigate(['./', {trackedTeamIds: trackedTeamIds}])
  }


  onTeamSelected() {
    if (this.trackedTeams.find((team: TrackedTeam) => team.trackedTeam.id === Number(this.selectedTeam.value))) {
      return;
    }
    const trackedTeamIds = this.trackedTeams.map((team: TrackedTeam) => team.trackedTeam.id).concat(Number(this.selectedTeam.value));
    
    this.router.navigate(['./', {trackedTeamIds: trackedTeamIds}])
  }


}

