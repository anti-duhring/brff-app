import { API_URL_BASE } from "../../utils/constants";

export const getColorPosition = (position) => {
    let colorPosition = '#a3bbd3';
    switch(position){
        case 'QB':
            colorPosition = '#ff2a6d'
            break;
        case 'RB':
            colorPosition = '#00ceb8'
            break;
        case 'WR':
            colorPosition = '#58a7ff'
            break;
        case 'TE':
            colorPosition = '#ffae58'
            break;
        case 'FLEX':
            colorPosition = '#a3bbd3'
            break;
        case 'SUPER_FLEX':
            colorPosition = 'pink'
            break;
        case 'K':
            colorPosition = '#bd66ff'
            break;
        case 'DEF':
            colorPosition = '#7988a1'
            break;
        case 'DL':
            colorPosition = '#ff795a'
            break;
        case 'LB':
            colorPosition = '#6d7df5'
            break;
        case 'DB':
            colorPosition = '#ff7cb6'
            break;
        default:
            colorPosition = '#a3bbd3'
    }
    return colorPosition
}

export const getStartersPlayers = async(players) => {
    let startersWithInfo = []
    await players.reduce(async(memo, player, index) => {
        await memo;
        if(player != 0){
            const response = await fetch(`https://teste-draft.netlify.app/.netlify/functions/getplayersdata?name=${player}`)
            const data = await response.json()
            
            let name = data.full_name;
            if(isNaN(player)) name = `${data.first_name} ${data.last_name}`

            startersWithInfo.push({
                name: name,
                player_id: player,
                position: data.fantasy_positions[0],
                index: index
            })
        } else {
            startersWithInfo.push({
                name: 'Empty',
                player_id: 0,
                position: 'Empty',
                index: index
            })
        }
    }, Promise.resolve())
    return startersWithInfo
    
}

export const getBenchPlayers = async(allplayers, startersplayers) => {
    let benchWithInfo = [];
    let allbenchs = allplayers.filter((item) => {
        return startersplayers.indexOf(item) === -1;
    });
    await allbenchs.reduce(async(memo, player, index) => {
        await memo;
        if(player != 0){
            const response = await fetch(`https://teste-draft.netlify.app/.netlify/functions/getplayersdata?name=${player}`)
            const data = await response.json()
            
            let name = data.full_name;
            if(isNaN(player)) name = `${data.first_name} ${data.last_name}`

            benchWithInfo.push({
                name: name,
                player_id: player,
                position: data.fantasy_positions[0],
                index: index
            })
        } else {
            benchWithInfo.push({
                name: 'Empty',
                player_id: 0,
                position: 'Empty',
                index: index
            })
        }
    }, Promise.resolve())
    return benchWithInfo
    
}

export const getPlayerPoints = (_id, _user_points, _opponent_points) => {
    const players = {..._user_points, ..._opponent_points}
    let point = '0.0';
    Object.keys(players).forEach(key => {
        if(key == _id) {
            point = players[key]
            if(players[key]==0||!players[key]) point = '0.0'
        }
    })

    return point
}

export const getPlayerProjectedPoints = (_player_stats, _league_scoring_settings) => {
    let points = 0;
    Object.entries(_player_stats).map(item => {
        if(!_league_scoring_settings[item[0]]) return

        const league_score = _league_scoring_settings[item[0]];
        const point_made = item[1] * league_score;
        points +=  point_made
        //projected_points.push(item)
    })
    return points
}

export const getRosterFromLeague = async(leagueID, userID) => {
   return fetch(`${API_URL_BASE}/league/${leagueID}/rosters`)
    .then(rosterResponse => rosterResponse.json())
    .then(roster => {
        return roster.find(i => i.owner_id == userID)
    })

}