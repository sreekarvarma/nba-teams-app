import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '../interfaces/game';
import { Team } from '../interfaces/team';

interface Meta {
  current_page: number;
  next_page: number | null;
  per_page: number;
  total_count: number;
  total_pages: number;
}

export interface AllTeamsResponse {
  data: Team[];
  meta: Meta;
}

export interface Last12DaysGamesResponse {
  data: Game[];
  meta: Meta;
}

@Injectable({
  providedIn: 'root'
})
export class ApiRequestsService {

  baseUrl: string = 'https://free-nba.p.rapidapi.com/';
  headers: {
    'X-RapidAPI-Key': string,
    'X-RapidAPI-Host': string
  } = {         
    'X-RapidAPI-Key':'2QMXSehDLSmshDmRQcKUIAiQjIZAp1UvKUrjsnewgqSP6F5oBX',
    'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'
    }

  get_last_12_dates_url_params = () => {
    let dates_url_param = ""
    for (let i = 0; i < 12; i++) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      dates_url_param += '&dates[]=' + date.toISOString().slice(0, 10);
    }
    return dates_url_param;
  }

  apiEndpoints = {
    teams: () => this.baseUrl + 'teams' + '?per_page=45',
    last12DaysGames: (team_id: number) => this.baseUrl + 'games?team_ids[]=' + team_id + '&per_page=12' + this.get_last_12_dates_url_params(),
    fetchTeamLogo: (team_abbreviation: string) => "https://interstate21.com/nba-logos/" + team_abbreviation + ".png",
    team: (team_id: number) => this.baseUrl + 'teams/' + team_id
  }

  constructor(private http: HttpClient) { }

  allTeams = () => {
    return this.http.get<{
      data: Team[],
      meta: Meta
    }>(this.apiEndpoints.teams(), {headers: this.headers});
  }

  last12DaysGames = (team_id: number) => {
    return this.http.get<{
      data: Game[],
      meta: Meta
    }>(this.apiEndpoints.last12DaysGames(team_id), {headers: this.headers});
  }

  fetchTeamLogo = (team_abbreviation: string):string => {
    return this.apiEndpoints.fetchTeamLogo(team_abbreviation);
  }

  getTeam = (team_id: number) => {
    return this.http.get<Team>(this.apiEndpoints.team(team_id), {headers: this.headers});
  }

}
