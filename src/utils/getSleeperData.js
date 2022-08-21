import { API_URL_BASE } from "./constants"

export const getLeagueData = async(leagueID) => {
    const URL = `${API_URL_BASE}/league/${leagueID}`

    return fetch(URL)
    .then(response => response.json())
    .then(league => {
        return league
    }).catch(err => {
        console.log('Err')
        return err
    })
}

export const getMatchup = async(leagueID, week) => {
    const URL = `${API_URL_BASE}/league/${leagueID}/matchups/${week}`

    return fetch(URL)
    .then(response => response.json())
    .then(matchup => {
        return matchup.map(m => {
            return {...m, league_id: leagueID}
        })
    }).catch(err => {
        console.log('Err')
        return err
    })
}

export const getLeaguesFromUser = async(userID, season) => {
    const response = await fetch(`${API_URL_BASE}/user/${userID}/leagues/nfl/${season}`);
    const data = await response.json();
    return data
    
}
export const getDraftSettings = async(leagueID) => {
    const URL = `${API_URL_BASE}/league/${leagueID}/drafts`;
    const response = await fetch(URL);
    const data = await response.json()
    return data
}

export const getLeagueRosters = async(leagueID) => {
    const URL = `${API_URL_BASE}/league/${leagueID}/rosters`;
    const response = await fetch(URL);
    const data = await response.json()
    return data
}
export const getLeaguePlayers = async(leagueID) => {
    const URL = `${API_URL_BASE}/league/${leagueID}/users`;
    const response = await fetch(URL);
    const data = await response.json()
    return data
}