import { StyleSheet, Text, View, Dimensions, PixelRatio, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import PlayerStatsHeader from '../../components/PlayerStatsHeader';
import { colors, getColorTeam } from '../../utils/colors';
import DonutChart from '../../components/Rostership/DonutChart';
import {useFont} from '@shopify/react-native-skia'
import BarChart from '../../components/Rostership/BarChart';
import { API_URL_BASE } from '../../utils/constants';
import { getLeagueData } from '../../utils/getSleeperData';

const WIDTH = Dimensions.get('window').width;
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
    const [allLeaguesData, setAllLeaguesData] = useState([]);
    const rostersWithPlayer = rosters.filter(i => i.players && i.players.indexOf(item.id) != -1);
    const rostersWithoutPlayer = rosters.filter(i => i.players && i.players.indexOf(item.id) == -1);

    // Donut chart
    const percentageComplete = Number((item.amount / rosters.length).toFixed(2));
    const percentageStarter = Number((rosters.filter(i => i.starters && i.starters.indexOf(item.id) != -1).length / rosters.length).toFixed(2));
    const font = useFont(require('../../../assets/fonts/Roboto-Light.ttf'), 50);
    const smallerFont = useFont(require('../../../assets/fonts/Roboto-Light.ttf'), 20);

    // Bar chart
        // Wins
    const dataCharts = [
        {label: 'Vitórias sem o jogador', value: rostersWithoutPlayer.map(i => i.settings.wins).reduce((acc, value) => { return acc + value},0) / rostersWithoutPlayer.length} ,
        {label: 'Vitórias com o jogador', value: rostersWithPlayer.map(i => i.settings.wins).reduce((acc, value) => { return acc + value},0) / rostersWithPlayer.length}
    ]
        // Fantasy points
    const dataChartsFPTS = [
        {label: 'Pontos sem o jogador', value: rostersWithoutPlayer.map(i => i.settings.fpts).reduce((acc, value) => { return acc + value},0) / rostersWithoutPlayer.length},
        {label: 'Pontos com o jogador', value: rostersWithPlayer.map(i => i.settings.fpts).reduce((acc, value) => { return acc + value},0) / rostersWithPlayer.length}
    ]
    const fontBar = useFont(require('../../../assets/fonts/Roboto-Bold.ttf'), 15)
    const legendFontBar = useFont(require('../../../assets/fonts/Roboto-Bold.ttf'), 20)

    useEffect(() => {
        if(allLeaguesData.length) return
        Promise.all(
            allLeagues.map((league) => {
                return getLeagueData(league.league_id)
            })
        ).then(leaguesData => {
            setAllLeaguesData(leaguesData)
        }).catch(err => {
            console.log('Error:',err);
        })
      },[])

    if(!font || !smallerFont || !fontBar || !legendFontBar || !allLeaguesData.length) {
        return (
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.DARK_BLACK}}>
                <ActivityIndicator size="large" color={colors.LIGHT_GREEN} />
            </View>
        )
    }

  return (
    <PlayerStatsHeader player={player}>
        <View>
            <Text style={{color:'white'}}>{allLeaguesData.length}</Text>
            <Text style={{color:'white'}}>

            </Text>
            <View style={styles.chartContainer}>
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
            </View>
            <View style={styles.chartContainer}>
                <BarChart
                    data={dataCharts}
                    font={fontBar}
                    rerender={player}
                    player={player}
                    legendFont={legendFontBar}
                    //color={getColorTeam(player.team)}
                />
            </View>
            <View style={styles.chartContainer}>
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
            </View>
            <View style={styles.chartContainer}>
                <BarChart
                    data={dataChartsFPTS}
                    font={fontBar}
                    rerender={player}
                    player={player}
                    legendFont={legendFontBar}
                    //color={getColorTeam(player.team)}
                />
            </View>
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
    }
})