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