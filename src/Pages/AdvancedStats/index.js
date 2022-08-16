import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, {useEffect, useState} from 'react'
import PlayerStatsHeader from '../../components/PlayerStatsHeader';
import { colors } from '../../utils/colors';
import {PieChart, BarChart} from 'react-native-chart-kit'

const WIDTH = Dimensions.get('window').width;

const AdvancedStats = ({route, navigation}) => {
    const {
        player,
        item,
        leagues,
        allLeagues,
        rosters
    } = route.params;

    const data = [
        {
            name: `Rosters com o jogador`,
            color: colors.LIGHT_GREEN,
            population: leagues.length,
            legendFontColor: "white",
            legendFontSize: 10,
            
        },
        {
            name: `Outros rosters`,
            color: colors.LIGHT_GREEN_TRANSPARENT,
            population: rosters.length - leagues.length,
            legendFontColor: colors.DARK_GRAY,
        },
    ]

    const barData = {
        labels: ["Vitórias com o jogador", "Vitórias sem o jogador"],
        datasets: [
          {
            data: [3, 5]
          }
        ]
      };

    const chartConfig = {
        backgroundGradientFrom: "#FFFFFF",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        barPercentage: 1,
        strokeWith: 50,
        useShadowColorFromDataset: false, // optional
    };

  return (
    <PlayerStatsHeader player={player}>
        <View>
            <Text style={styles.text}>{player.first_name} {player.last_name}</Text>
            <PieChart
                data={data}
                width={WIDTH - 40}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
                center={[20, 0]}
                style={{
                    backgroundColor:colors.LIGHT_BLACK, 
                    marginHorizontal: 20,
                    borderRadius: 10,
                }}
            />
            <BarChart
                data={barData}
                width={WIDTH - 40}
                height={220}
                //yAxisLabel="$"
                showValuesOnTopOfBars
                withHorizontalLabels={false}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                style={{
                    backgroundColor:colors.LIGHT_BLACK, 
                    marginHorizontal: 20,
                    borderRadius: 10,
                    marginTop: 10,
                }}
            />
        </View>
    </PlayerStatsHeader>
  )
}

export default AdvancedStats

const styles = StyleSheet.create({
    text: {
        color: colors.WHITE
    }
})