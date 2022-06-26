import { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import PlayerStatsHeader from "../../components/PlayerStatsHeader";
import { DARK_GRAY, LIGHT_GRAY, WHITE } from "../../components/Variables";
import ViewLightDark from "../../components/ViewLightDark";
import { NFLStatusContext } from "../../components/NFLStatusContext";

const PlayerStats = ({route}) => {
    const {season} = useContext(NFLStatusContext);

    const player = route.params?.playerObject;
    const [playerSeasonStats, setPlayerSeasonStats] = useState(null)

    useEffect(() => {
        getPlayerStats(player.player_id, 'regular', 2021);
    }, [])

    const getPlayerStats = async(_player_id, _type, _year) => {
        const URL = `https://api.sleeper.com/stats/nfl/player/${_player_id}?season_type=${_type}&season=${_year}&grouping=week`;
        console.log(URL);

        fetch(URL)
        .then(response => response.json())
        .then((data) => {
            setPlayerSeasonStats(data)
        }).catch(e => {
            console.log('Error:',e)
        })
    }

    const InfoContainer = (props) => {
        return (
            <View style={{flexDirection:'row',marginTop:10}}>
                <Text style={styles.titleInfo}>{props.title}</Text>
                <Text style={styles.valueInfo}>{props.value}</Text>
        </View>
        )
    }

    const Informations = () => (
        <>
        <InfoContainer title='Posição' value={player.fantasy_positions} />
        <InfoContainer title='Idade' value={player.age} />
        <InfoContainer title='Altura' value={`${player.height[0]}'${player.height[1]}"`} />
        <InfoContainer title='Peso' value={`${player.weight} lbs`} />
        <InfoContainer title='Status' value={player.status} />
        <InfoContainer title='Posição no depth chart' value={player.depth_chart_order} />
        <InfoContainer title='Temporadas na NFL' value={player.years_exp} />
        <InfoContainer title='College' value={player.college} />
        </>
    )

    return ( 
        <PlayerStatsHeader player={player}>
            <ViewLightDark title={`${player.full_name} #${player.number}`} titleSize={20}>
                <Informations />
            </ViewLightDark>

            <ViewLightDark>
                {playerSeasonStats && <InfoContainer title='Passes tentados' value={playerSeasonStats[1].stats.pass_att} />}
            </ViewLightDark>
        </PlayerStatsHeader>
     );
}
 
export default PlayerStats;

const styles = StyleSheet.create({
    text: {
        color:WHITE
    },
    titleInfo: {
        flex:1,
        color:DARK_GRAY
    },
    valueInfo: {
        flex:1,
        color:WHITE,
        textAlign:'right'
    }
})