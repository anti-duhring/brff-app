import { StyleSheet, Text, View, Dimensions, PixelRatio, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import PlayerStatsHeader from '../../components/PlayerStatsHeader';
import { colors, getColorTeam } from '../../utils/colors';
import DonutChart from '../../components/Rostership/DonutChart';
import {useFont} from '@shopify/react-native-skia'

const WIDTH = Dimensions.get('window').width;
const RADIUS = PixelRatio.roundToNearestPixel(130);
const STROKE_WIDTH = 12;

const AdvancedStats = ({route, navigation}) => {
    const {
        player,
        item,
        leagues,
        allLeagues,
        rosters
    } = route.params;
    const percentageComplete = Number((item.amount / rosters.length).toFixed(2));
    const test = (item.amount / rosters.length).toFixed(2);
    const font = useFont(require('../../../assets/fonts/Roboto-Light.ttf'), 60);
    const smallerFont = useFont(require('../../../assets/fonts/Roboto-Light.ttf'), 25);


    if(!font || !smallerFont) {
        return <View />
    }


  return (
    <PlayerStatsHeader player={player}>
        <View>
            <TouchableOpacity onPress={() => console.log('Pressed')}>
                <Text style={styles.text}>{test}</Text>
            </TouchableOpacity>
            
            <View style={styles.donutChartContainer}>
                <DonutChart 
                    radius={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    percentageComplete={percentageComplete}
                    targetPercentage={percentageComplete}
                    //color={getColorTeam(player.team)}
                    font={font}
                    smallerFont={smallerFont}
                    rerender={player}
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
        alignSelf:'center'
    }
})