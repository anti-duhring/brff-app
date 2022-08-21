import { StyleSheet, Text, View, PixelRatio, ActivityIndicator } from 'react-native'
import React, {useEffect, useState, useContext} from 'react'
import PlayerStatsHeader from '../../components/PlayerStatsHeader';
import { colors, getColorTeam } from '../../utils/colors';
import DonutChart from '../../components/Rostership/DonutChart';
import {useFont} from '@shopify/react-native-skia'
import BarChart from '../../components/Rostership/BarChart';
import { API_URL_BASE } from '../../utils/constants';
import { getLeagueData, getMatchup } from '../../utils/getSleeperData';
import ViewLightDark from '../../components/ViewLightDark'
import { DARKER_GRAY } from '../../components/Variables';
import { NFLStatusContext } from '../../context/NFLStatusContext';

const RADIUS = PixelRatio.roundToNearestPixel(100);
const STROKE_WIDTH = 10;

const AdvancedStats = ({route, navigation}) => {
    const {
        player,
        item,
        leagues,
        allLeagues,
        rosters
    } = route.params;
    const { NFLStatus } = useContext(NFLStatusContext)
    const currentWeek = NFLStatus.season_type != 'regular' ? 1 : NFLStatus.week;
    const [allLeaguesData, setAllLeaguesData] = useState([]);
    const [allMatchups, setAllMatchups] = useState([])
    const userMatchups =[].concat.apply([], allMatchups.filter(i => i.length))?.filter((i, index) => {
        const leagueID = i.league_id;
        const rosterID = i.roster_id;
        const rosterIndex = rosters.filter(r => r.league_id == leagueID).map(r => r.roster_id).indexOf(rosterID);

        return rosterIndex != -1
    });
    const userMatchupsWithThisPlayer = userMatchups.filter(i => i)?.filter(i => i.starters.indexOf(item.id) != -1);
    const userMatchupsWithoutThisPlayer = userMatchups.filter(i => i)?.filter(i => i.starters.indexOf(item.id) == -1);
    const rostersWithThisPlayer = rosters.filter(i => i.players && i.players.indexOf(item.id) != -1);
    const rostersWithoutThisPlayer = rosters.filter(i => i.players && i.players.indexOf(item.id) == -1);

    // Donut chart
    const percentageComplete = Number((item.amount / rosters.length).toFixed(2));
    const percentageStarter = Number((rosters.filter(i => i.starters && i.starters.indexOf(item.id) != -1).length / rosters.length).toFixed(2));
    const totalStarter = rosters.filter(i => i.starters && i.starters.indexOf(item.id) != -1).length;
    const font = useFont(require('../../../assets/fonts/Roboto-Light.ttf'), 50);
    const smallerFont = useFont(require('../../../assets/fonts/Roboto-Light.ttf'), 20);

    // Bar chart
        // Wins
    const dataCharts = [
        {
            label: 'Vitórias sem o jogador', 
            value: rostersWithoutThisPlayer.map(i => i.settings.wins).reduce((acc, value) => { return acc + value},0) / rostersWithoutThisPlayer.length
        } ,
        {
            label: 'Vitórias com o jogador', 
            value: rostersWithThisPlayer.map(i => i.settings.wins).reduce((acc, value) => { return acc + value},0) / rostersWithThisPlayer.length
        }
    ]
        // Fantasy points
    const dataChartsFPTS = [
        {
            label: 'Pontos sem o jogador', 
            value: userMatchupsWithoutThisPlayer.map(i => i.points).reduce((acc, value) => acc + value,0) / userMatchupsWithoutThisPlayer.length
        },
        {
            label: 'Pontos com o jogador', 
            value: userMatchupsWithThisPlayer.map(i => i.points).reduce((acc, value) => acc + value,0) / userMatchupsWithThisPlayer.length
        }
    ]
    const fontBar = useFont(require('../../../assets/fonts/Roboto-Bold.ttf'), 15)
    const legendFontBar = useFont(require('../../../assets/fonts/Roboto-Bold.ttf'), 20)

    useEffect(() => {
        Promise.all(
            allLeagues.map((league) => {
                return getLeagueData(league.league_id)
            })
        ).then(leaguesData => {
            setAllLeaguesData(leaguesData)
        }).catch(err => {
            console.log('Error:',err);
        })

        let promisesMatchups = [];
        for(let i = 1; i <= currentWeek; i++) { 
            promisesMatchups = [...promisesMatchups, ...allLeagues.map((league) => getMatchup(league.league_id, i) )] 
        }

        Promise.all(
            promisesMatchups
        ).then(matchupsData => {
            setAllMatchups(matchupsData)
        }).catch(err => {
            console.log('Error:',err);
        })
      },[player])

    if(!font || !smallerFont || !fontBar || !legendFontBar || !allLeaguesData.length || !allMatchups.length) {
        return (
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.DARK_BLACK}}>
                <ActivityIndicator size="large" color={colors.LIGHT_GREEN} />
            </View>
        )
    }

    const InfoItem = ({legend, value}) => {
        return (
            <View style={styles.infoItem}>
                <Text style={[styles.infoText, styles.infoLegend]}>
                    {legend}
                </Text>
                <Text style={[styles.infoText,styles.infoValue]}>
                    {value}
                </Text>
            </View>
        )
    }

    const Infos = ({player}) => {
        return (
            <ViewLightDark 
                title={`${player.first_name} ${player.last_name}`} 
                titleSize={20}
            >
                <InfoItem
                    legend={`Posição`}
                    value={`${player.position}`}
                />
                <InfoItem
                    legend={`Time`}
                    value={`${player.team}`}
                />
                <InfoItem
                    legend={`Idade`}
                    value={`${player.age}`}
                />
                <InfoItem
                    legend={`Posição no depth chart`}
                    value={`${player.depth_chart_order}`}
                />
                <InfoItem
                    legend={`Temporadas na NFL`}
                    value={`${player.years_exp}`}
                />
                <InfoItem
                    legend={`Total rostership`}
                    value={leagues.length}
                />
                <InfoItem
                    legend={`Total rostership como starter`}
                    value={totalStarter}
                />
                <InfoItem
                    legend={`Matchups com o jogador como starter`}
                    value={userMatchupsWithThisPlayer.length}
                />
            </ViewLightDark>
        )
    }

  return (
    <PlayerStatsHeader player={player}>
        <View>
            <Infos player={player} />
            <ViewLightDark>
                <View style={styles.donutChartContainer}>
                    <DonutChart 
                        radius={RADIUS}
                        strokeWidth={STROKE_WIDTH}
                        percentageComplete={percentageComplete}
                        targetPercentage={percentageComplete}
                        //color={getColorTeam(player.team)}
                        font={font}
                        smallerFont={smallerFont}
                        legend={`Rostership`}
                        rerender={player}
                    />
                </View>
            </ViewLightDark>
            <ViewLightDark>
                <BarChart
                    data={dataCharts}
                    font={fontBar}
                    rerender={player}
                    player={player}
                    legendFont={legendFontBar}
                    //color={getColorTeam(player.team)}
                />
            </ViewLightDark>
            <ViewLightDark>
                <View style={styles.donutChartContainer}>
                    <DonutChart 
                        radius={RADIUS}
                        strokeWidth={STROKE_WIDTH}
                        percentageComplete={percentageStarter}
                        targetPercentage={percentageStarter}
                        //color={getColorTeam(player.team)}
                        font={font}
                        legend={`Starter`}
                        smallerFont={smallerFont}
                        rerender={player}
                    />
                </View>
            </ViewLightDark>
            <ViewLightDark>
                <BarChart
                    data={[...dataChartsFPTS]}
                    font={fontBar}
                    rerender={player}
                    player={player}
                    legendFont={legendFontBar}
                    //color={getColorTeam(player.team)}
                />
            </ViewLightDark>
        </View>
    </PlayerStatsHeader>
  )
}

export default AdvancedStats

const styles = StyleSheet.create({
    text: {
        color: colors.WHITE
    },
    donutChartContainer: {
        height: RADIUS * 2,
        width: RADIUS * 2,
        alignSelf:'center',
    },
    chartContainer: {
        flex: 1,
        backgroundColor: colors.LIGHT_BLACK,
        margin: 15,
        borderRadius: colors.BORDER_RADIUS,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical: 15,
    },
    infoItem: {
        flexDirection:'row',
        marginTop: 10,
    },
    infoText: {
        color: 'white',
        flex: 1,
    },
    infoLegend: {
        color: DARKER_GRAY,
    },
    infoValue: {
        textAlign:'right'
    }
})