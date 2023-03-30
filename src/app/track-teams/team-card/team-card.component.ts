import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/interfaces/game';
import { Team } from 'src/app/interfaces/team';
import { ApiRequestsService } from 'src/app/services/api-requests.service';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent implements OnInit {

  @Input('trackedTeam') trackedTeam!: {
    trackedTeam: Team;
    games: Game[];
  };
  
  @Output('onRemoveTeam') onRemoveTeam = new EventEmitter<number>();

  trackedTeamLogo: string = '';

  constructor(private apiRequestService: ApiRequestsService,
    private router: Router) { }

  ngOnInit(): void {
    this.getTeamLogo();
  }

  getTeamLogo() {
    this.trackedTeamLogo = this.apiRequestService.fetchTeamLogo(this.trackedTeam.trackedTeam.abbreviation);
  }

  isGameWon(game: Game) {
    if(game.home_team_score === game.visitor_team_score) {
      return false;
    }
    if (game.home_team_score > game.visitor_team_score) {
      return game.home_team.id === this.trackedTeam.trackedTeam.id;
    } else {
      return game.visitor_team.id === this.trackedTeam.trackedTeam.id;
    }
  }

  isGameLost(game: Game) {
    if(game.home_team_score === game.visitor_team_score) {
      return false;
    }
    if (game.home_team_score < game.visitor_team_score) {
      return game.home_team.id === this.trackedTeam.trackedTeam.id;
    } else {
      return game.visitor_team.id === this.trackedTeam.trackedTeam.id;
    }
  }

  isGameTied(game: Game) {
    return game.home_team_score === game.visitor_team_score;
  }

  avgPointsScored() {
    let totalPoints = 0;
    this.trackedTeam.games.forEach((game: Game) => {
      if (game.home_team.id === this.trackedTeam.trackedTeam.id) {
        totalPoints += game.home_team_score;
      } else {
        totalPoints += game.visitor_team_score;
      }
    })
    return (totalPoints / this.trackedTeam.games.length).toFixed(2);
  }

  avgPointsConceded() {
    let totalPoints = 0;
    this.trackedTeam.games.forEach((game: Game) => {
      if (game.home_team.id === this.trackedTeam.trackedTeam.id) {
        totalPoints += game.visitor_team_score;
      } else {
        totalPoints += game.home_team_score;
      }
    })
    return (totalPoints / this.trackedTeam.games.length).toFixed(2);
  }

  onRemoveTeamFromTracked() {
    this.onRemoveTeam.emit(this.trackedTeam.trackedTeam.id);
  }

  viewResults() {
    this.router.navigate(['/results', {teamCode: this.trackedTeam.trackedTeam.id}]);
  }

}
