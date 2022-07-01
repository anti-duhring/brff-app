import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import ProgressiveImage from "../ProgressiveImage";
import { DARK_BLACK, DARK_GRAY, WHITE } from "../Variables";
import ViewLightDark from '../ViewLightDark'

const SearchPlayers = ({navigation, searchPlayers}) => {

    const Player = ({player}) => {
        return (
        <View style={styles.playerContainer}>
            <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => navigation.navigate('PlayerStats', {
            playerObject: player,
            goTo: 'TrendingPlayers'
            })}>
            <ProgressiveImage style={styles.imagePlayer} uri={`https://sleepercdn.com/content/nfl/players/thumb/${player.player_id}.jpg`} resizeMode='cover' />
            <View style={styles.playerNameContainer}>
                <Text style={styles.playerName}>{player.full_name}</Text>
                <Text style={styles.playerPosition}>{player.position} - {(player.team) ? player.team : 'Free Agent'}</Text>
            </View>
            </TouchableOpacity>
        </View>
        )
    }

    return ( 
        <ViewLightDark title='Buscar jogadores' titleSize={18} containerStyle={{margin:0,marginTop:10}}>
            {
                searchPlayers?.map((player, index) => {
                    if(!player.full_name) return
                    
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
        width: 50,
        height: 50,
        borderRadius:50,
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
        marginTop:20,
    },
    playerNameContainer: {
        flex: 1,
        marginLeft:10,
    }
})