export const colors = {
    DARK_GREEN: '#008037',
    LIGHT_GREEN: 'rgba(0, 206, 78,  1)',LIGHT_GREEN_TRANSPARENT : 'rgba(0, 206, 78,  .1)',DARK_BLACK : '#0B0D0F',LIGHT_BLACK : '#15191C', HIGHTLIGHT_BLACK: '#303840',LIGHT_GRAY : '#C6C6C6',DARKER_GRAY : '#656668',DARK_GRAY : '#949494',WHITE : '#FCFCFC',HEADER_BUTTON_BG : 'rgba(0, 0, 0, 0.7)',BORDER_RADIUS : 12
}

export const getColorTeam = (team) => {
    let color;
    switch(team) {
        case 'LAC':
            color = 'rgb(0, 34, 68)'
            break;
        case 'KC':
            color = 'rgb(227, 24, 55)'
            break;
        case 'LV':
            color = 'rgb(165, 172, 175)'
            break;
        case 'DEN':
            color = 'rgb(251, 79, 20)'
            break;     
        case 'NE':
            color = 'rgb(0, 34, 68)'
            break;
        case 'NYJ':
            color = 'rgb(32, 55, 49)'
            break;
        case 'MIA':
            color = 'rgb(0, 142, 151)'
            break;
        case 'BUF':
            color = 'rgb(0, 51, 141)'
            break;
        case 'BAL':
            color = 'rgb(36, 23, 115)'
            break;
        case 'CLE':
            color = 'rgb(49, 29, 0)'
            break;
        case 'PIT':
            color = 'rgb(255, 182, 18)'
            break;
        case 'CIN':
            color = 'rgb(251, 79, 20)'
            break;
        case 'TEN':
            color = 'rgb(0, 34, 68)'
            break;
        case 'JAX':
            color = 'rgb(0, 103, 120)'
            break;
        case 'IND':
            color = 'rgb(0, 44, 95)'
            break;
        case 'HOU':
            color = 'rgb(3, 32, 47)'
            break;
        case 'TB':
            color = 'rgb(213, 10, 10)'
            break;
        case 'CAR':
            color = 'rgb(0, 133, 202)'
            break;
        case 'ATL':
            color = 'rgb(167, 25, 48)'
            break;
        case 'NO':
            color = 'rgb(177, 177, 177)'
            break;
        case 'LAR':
            color = 'rgb(0, 34, 68)'
            break;
        case 'SEA':
            color = 'rgb(0, 34, 68)'
            break;
        case 'SF':
            color = 'rgb(170, 0, 0)'
            break;
        case 'ARI':
            color = 'rgb(151, 35, 63)'
            break;
        case 'GB':
            color = 'rgb(32, 55, 49)'
            break;
        case 'DET':
            color = 'rgb(0, 118, 182)'
            break;
        case 'CHI':
            color = 'rgb(11, 22, 42)'
            break;
        case 'MIN':
            color = 'rgb(79, 38, 131)'
            break;
        case 'NYG':
            color = 'rgb(11, 34, 101)'
            break;
        case 'DAL':
            color = 'rgb(0, 34, 68)'
            break;
        case 'PHI':
            color = 'rgb(0, 76, 84)'
            break; 
        case 'WAS':
            color = 'rgb(90, 20, 20)'
            break;
        default:
            color = DARK_GREEN;
    }
    return color
}

export const addAlpha = (color, opacity) => {
    // coerce values so ti is between 0 and 1.
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}