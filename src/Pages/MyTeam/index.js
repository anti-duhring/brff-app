import { Text, View, StyleSheet } from "react-native";
import TabTopLeague from '../../components/TabTopLeague'
import { HeaderLeagueContextProvider } from "../../components/HeaderLeagueContext";
import { UserDataContext } from "../../components/UserDataContext";
import { AllPlayersContext } from "../../components/AllPlayersContext";
import { useState, useEffect, useContext } from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { getColorPosition } from "../../functions/GetRoster";

const MyTeam = ({navigation, route}) => {
    const league = route.params?.leagueObject;
    const leagueID = league.league_id
    const leagueDraftSettings = route.params?.leagueDraftSettings
    const roster = league.roster_positions;
    const roster_bench = roster.filter((item) => {
        return item.indexOf('BN') !== -1;
    });
    const playerEmpty = {
        index: null,
        name: 'Vazio',
        player_id: 0,
        position: null,
        points: 0,
        projected_points: 0
    }

    const { userData } = useContext(UserDataContext)
    const userID = userData.user_id;

    const [starters, setStarters] = useState(null)
    const [bench, setBench] = useState(null)
    const [hasPlayers, setHasPlayers] = useState(false)

    const { allPlayers } = useContext(AllPlayersContext)

    const [errorMessage, setErrorMessage] = useState(null)
    const controller = new AbortController();
    const signal = controller.signal;

    const getRoster = async() => {
        fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`,{signal})
        .then(response => response.json())
        .then((data) => {
            data.map((roster, index) => {
                if(roster.owner_id==userID && roster.players) {
                    const benchs = roster.players.filter((item) => {
                        return roster.starters.indexOf(item) === -1;
                    });

                    setHasPlayers(true)

                    setStarters(getPlayers(roster.starters))
                    setBench(getPlayers(benchs))
                }
            })
        }).catch((e) => {
            console.log('Erro:',e)
            controller.abort()
            setErrorMessage(e)
        })
    }

    const getPlayers = (_players) => {
        let players = [];
        _players.map((player, index) => {
            if(player!=0) {
                players.push({
                    name: allPlayers[player].full_name,
                    position: allPlayers[player].fantasy_positions[0],
                    index: index
                })
            } else{
                players.push({
                    name: 'Empty',
                    position: 'Empty',
                    index: index
                })
            }
        })
        return players
    }


    useEffect(() => {
        getRoster()
    },[])

    const Player = ({position, name}) => (
        <View style={styles.playerContainer}>
            <View style={styles.positionLegend}>
                <Text style={[styles.playerPosition,{color:getColorPosition(position)}]}>{position.replace(/_/g,' ')}</Text></View>
            <View style={styles.playerNameContainer}>
                <Text style={styles.playerName}>{name}</Text>
            </View>
        </View>
    )

    const PlayerPlaceholder = ({position}) => (
        <View style={styles.playerContainer}>
        <View style={styles.positionLegend}>
            <Text style={[styles.playerPosition,{color:getColorPosition(position)}]}>{position.replace(/_/g,' ')}</Text></View>
        <View style={styles.playerNameContainer}>
            <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                <View style={{ width: 100, height: 20, borderRadius: 4 }} />
            </SkeletonPlaceholder>
        </View>
    </View>
    )

    if(!hasPlayers) {
        return (
            <HeaderLeagueContextProvider leagueObject={league}>
            <TabTopLeague leagueDraftSettings={leagueDraftSettings} isAble={true} activeButton={route.params?.active} leagueObject={league} />

                <View
                    style={styles.boxContainer}
                >
                    <View style={styles.informationContent}>
                        <Text style={styles.title}>Titulares</Text>
                    </View>
                    {roster.map((position, index) => {     
                            if(position=='BN') return
                            return (
                                <Player key={index} name={'Vazio'} position={position} />
                            )
                        })}
                </View>
            </HeaderLeagueContextProvider>
        )
    }

    return ( 
        <HeaderLeagueContextProvider leagueObject={league}>
            <TabTopLeague isAble={true} leagueDraftSettings={leagueDraftSettings} activeButton={route.params?.active} leagueObject={league} />

                <View style={styles.boxContainer}
                >

                    <View style={styles.informationContent}>
                        <Text style={styles.title}>Titulares</Text>
                    </View>
                        {!starters ? 
                        roster.map((position, index) => {     
                            if(position=='BN') return
                            return (
                                <PlayerPlaceholder key={index} position={position} />
                            )
                        }) 
                            : 
                        roster.map((position, index) => {
                            if(position=='BN') return

                            const player = starters[index] || playerEmpty;

                            return (
                                <Player key={index} position={position} name={player.name} />
                            )
                        })}
                    
                    <View style={styles.informationContent}>
                        <Text style={styles.title}>Banco</Text>
                    </View>
                    {!bench ? 
                        roster_bench.map((position, index) => {     
                            
                            return (
                                <PlayerPlaceholder key={index} position={position} />
                            )
                        }) 
                            : 
                        roster_bench.map((position, index) => {
                            const player = bench[index] || playerEmpty;
                            return (
                                <Player key={index} position={position} name={player.name} />
                            )
                        })}
                </View>
        </HeaderLeagueContextProvider> 
    );
}
 
export default MyTeam;

const styles = StyleSheet.create({
    boxContainer: {
        borderRadius:12,
        margin:10,
        padding:10,
        shadowColor:'#000',
        shadowOffset: {
        width: 0,
        height:10
        },
        shadowOpacity:1,
        shadowRadius:20,
        elevation:10,
        borderWidth:1,
        borderColor: 'rgba(255,255,255,0)',
        backgroundColor: '#15191C',
                    
    },
    rosterContainer:{
        paddingBottom:10,
        paddingTop:0,
    },
    positionLegend: {
        width:50,
        paddingTop:5,
        paddingBottom:5,
        borderRadius:5,
        justifyContent:'center',
        backgroundColor:'#262D33'
    },
    titleContainer:{
        paddingLeft:10,
        paddingBottom:10,
    },
    title:{
        fontSize:17,
        fontWeight:'bold',
        color:'#C6C6C6',
        flex:1
    },
    playerContainer: {
        flexDirection:'row',
        paddingVertical:10
    },
    playerPosition: {
        textAlign:'center', 
        fontWeight:'bold'
    },
    playerNameContainer: {
        justifyContent:'center',
        paddingLeft:10
    },
    playerName: {
        color:'white'
    }
})