import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import ProgressiveImage from "../ProgressiveImage";
import { DARK_BLACK, DARK_GRAY, WHITE } from "../Variables";
import ViewLightDark from '../ViewLightDark'

const SearchPlayers = ({searchPlayers}) => {

    const Player = ({player}) => {
        return (
        <View style={styles.playerContainer}>
            <ProgressiveImage style={styles.imagePlayer} uri={`https://sleepercdn.com/content/nfl/players/thumb/${player.player_id}.jpg`} resizeMode='contain' />
            <View style={styles.playerNameContainer}>
                <Text style={styles.playerName}>{player.full_name}</Text>
                <Text style={styles.playerPosition}>QB - NE</Text>
            </View>
        </View>
        )
    }

    return ( 
        <ViewLightDark containerStyle={{margin:0,marginTop:10}}>
            {
                searchPlayers?.map((player, index) => {
                    return (
                        <Player key={index} player={player} />
                    )
                })
            }
        </ViewLightDark>
     );
}
 
export default SearchPlayers;

const styles = StyleSheet.create({
    imagePlayer: {
        width: 40,
        height: 40,
        borderRadius:20,
        backgroundColor: DARK_BLACK
    },
    playerPosition: {
        color: DARK_GRAY,
        fontSize: 13,
    },
    playerName: {
        color: WHITE,
        fontSize: 15,
    },
    playerContainer: {
        flexDirection:'row',
        alignItems:'center',
    },
    playerNameContainer: {
        flex: 1,
        marginLeft:10,
    }
})