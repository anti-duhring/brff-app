import { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import PlayerStatsHeader from "../../components/PlayerStatsHeader";
import { DARK_GRAY, LIGHT_GRAY, WHITE } from "../../components/Variables";
import ViewLightDark from "../../components/ViewLightDark";
import { NFLStatusContext } from "../../components/NFLStatusContext";

const PlayerStats = ({route}) => {
    const {season} = useContext(NFLStatusContext);

    const player = route.params?.playerObject;
    const [playerSeasonStats, setPlayerSeasonStats] = useState(null);

    const statsToShow = {
        "RB" : ['rush_yd', 'rush_ypa', 'rush_att','rush_yac', 'rush_td', 'rush_rz_att', 'rush_td_lng', 'rush_lng', 'rec_yd', 'rec', 'rec_ypt',  'rec_tgt',   'snp']
    }

    const statsToShowName = (position) => {
        return statsToShow[position].map(stat => { 
            return stat.replace(/\bsnp\b/g,'Snaps').replace(/\brush_yd\b/g,'Jds corridas').replace(/\brush_ypa\b/g,'Jds por tentativa').replace(/\brush_att\b/g,'Corridas tentadas').replace(/\brush_yac\b/g,'Jds após contato').replace(/\brush_td\b/g,'TDs corridos').replace(/\brush_rz_att\b/g,'Corridas na RZ').replace(/\brush_td_lng\b/g,'TD mais longo').replace(/\brush_lng\b/g,'Corrida mais longa').replace(/\brec_yd\b/g,'Jds recebidas').replace(/\brec\b/g,'Recepções').replace(/\brec_ypt\b/g,'Jds por alvo').replace(/\brec_tgt\b/g,'Alvos');
        });
    }

 

    useEffect(() => {
        getPlayerStats(player.player_id, 'regular', 2021);
        //console.log(player.player_id, season - player.years_exp);
    }, [])

    const objectToArray = (obj) => {
        return Object.keys(obj).map((key) => {return key})
    }

    const getPlayerStats = async(_player_id, _type, _year) => {
        const URL = `https://api.sleeper.com/stats/nfl/player/${_player_id}?season_type=${_type}&season=${_year}&grouping=week`;
        //console.log(URL);

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
                <ScrollView horizontal={true} contentContainerStyle={{flexDirection:'column'}}>
                    <View style={{flexDirection:'row',}}>
                        <Text style={styles.columnTitle}>Semana</Text>
                        {
                            statsToShowName(player.fantasy_positions).map(stat => {
                                return (<Text style={styles.columnTitle}>{stat}</Text>)
                            })
                        }
                    </View>

                {playerSeasonStats && 
                    Object.entries(playerSeasonStats).map(item => {
                        if(!item[1]) return

                        const commonStats = objectToArray(item[1].stats).filter(i => statsToShow[player.fantasy_positions].includes(i));

                        if(!commonStats) return

                        return (
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.columnValue}>{item[0]}</Text>
                                { 
                                    statsToShow[player.fantasy_positions].map(stat => {
                                        if(!item[1].stats[stat]) {
                                            return (
                                                <Text style={styles.columnValue}>-</Text>
                                            )
                                        } else {
                                            return (
                                                <Text style={styles.columnValue}>{item[1].stats[stat]}</Text>
                                            )
                                        }
                                    })
                                }
                            </View>
                        )
                        
                     })
                }
                </ScrollView>
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
    },
    columnTitle: {
        flex:1,
        color:WHITE,
        width:80,
        marginRight:10
    },
    columnValue: {
        flex:1,
        color:WHITE,
        width:80,
        marginRight:10
    }
})