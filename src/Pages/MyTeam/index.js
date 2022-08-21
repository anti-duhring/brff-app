import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import TabTopLeague from '../../components/TabTopLeague'
import { HeaderLeagueContextProvider } from "../../components/HeaderLeagueContext";
import { AuthContext } from "../../context/AuthContext";
import { AllPlayersContext } from "../../context/AllPlayersContext";
import { useState, useEffect, useContext } from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { getColorPosition } from "../../functions/GetRoster";
import ProgressiveImage from "../../components/ProgressiveImage";
import ViewLightDark from '../../components/ViewLightDark'
import { DARK_BLACK, WHITE } from "../../components/Variables";
import { playerEmpty } from "../../utils/players";

const MyTeam = ({navigation, route}) => {
    const league = route.params?.leagueObject;
    const leagueID = league.league_id
    const leagueDraftSettings = route.params?.leagueDraftSettings;
    const leagueUsers = route.params?.leagueUsers;
    const roster = league.roster_positions;
    const roster_bench = roster.filter((item) => {
        return item.indexOf('BN') !== -1;
    });
    const roster_starters = roster.filter((item) => {
        return item.indexOf('BN') == -1;
    });

    const { loginState } = useContext(AuthContext);
    const userData = loginState.userData;
    const userID = userData.user_id;

    const [starters, setStarters] = useState(null)
    const [bench, setBench] = useState(null)
    const [userInfos, setUserInfos] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const { allPlayers } = useContext(AllPlayersContext)

    const [errorMessage, setErrorMessage] = useState(null)
    const controller = new AbortController();
    const signal = controller.signal;

    const getRoster = async() => {
        fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`,{signal})
        .then(response => response.json())
        .then((data) => {
            data.map((roster, index) => {
                if(roster.owner_id==userID) {
                    if(roster.players) {
                        const benchs = (roster.starters) ? roster.players.filter((item) => {
                            return roster.starters.indexOf(item) === -1;
                        }) : null;
                        
                        setStarters(getPlayers(roster.starters))
                        setBench(getPlayers(benchs))
                        
                    } else {
                        setStarters(null)
                        setBench(null)
                    }
                    setUserInfos(roster.settings)
                    setIsLoading(false);
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
        if(!_players) return

        _players.map((player, index) => {
            if(player!=0) {
                players.push({
                    name: allPlayers[player].full_name,
                    position: allPlayers[player].fantasy_positions[0],
                    team: allPlayers[player].team,
                    player_id: player,
                    index: index
                })
            } else{
                players.push({
                    name: 'Empty',
                    position: 'Empty',
                    index: index,
                    team: null,
                    player_id: 0,
                })
            }
        })
        return players
    }


    useEffect(() => {
        getRoster()
    },[])

    const Player = ({position, name, player}) => {
        const typePlayer = (isNaN(new Number(player.player_id))) ? 'TEAM' : 'PLAYER';
       return (
        <View style={styles.playerContainer}>
            <View style={[styles.positionLegend,{backgroundColor:getColorPosition(position)}]}>
                <Text style={[styles.playerPosition,{/*color:getColorPosition(position)*/color:WHITE}]}>{position.replace(/_/g,' ')}</Text>
            </View>
            <TouchableOpacity onPress={() => {
                if(!player.player_id) return
                navigation.navigate('PlayerStats', {playerObject: allPlayers[player.player_id]})
            }}>
                <View style={styles.playerNameContainer}>
                    <View style={{flexDirection:'row', alignItems:'flex-end',paddingRight:10}}>
                        <ProgressiveImage style={[styles.imagePlayer, {borderRadius:(typePlayer == 'TEAM') ? 0 : 50,backgroundColor:(typePlayer == 'TEAM') ? 'transparent' : DARK_BLACK}]} uri={(typePlayer == 'TEAM') ? `https://sleepercdn.com/images/team_logos/nfl/${player.team.toLowerCase()}.png` : `https://sleepercdn.com/content/nfl/players/thumb/${player.player_id}.jpg`} resizeMode='cover'/>
                        {player.team && typePlayer == 'PLAYER' &&  <Image style={{width:26,height:26,marginLeft:-25,marginBottom:-5}} source={{uri: `https://sleepercdn.com/images/team_logos/nfl/${player.team.toLowerCase()}.png`}} resizeMode='cover' />}
                    </View>
                    <Text style={styles.playerName}>{(player.player_id) ? `${allPlayers[player.player_id].first_name} ${allPlayers[player.player_id].last_name}` : player.name}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )}

    const PlayerPlaceholder = ({position}) => (
        <View style={styles.playerContainer}>
        <View style={[styles.positionLegend,{backgroundColor:getColorPosition(position)}]}>
            <Text style={[styles.playerPosition,{color:WHITE}]}>{position.replace(/_/g,' ')}</Text></View>
        <View style={styles.playerNameContainer}>
            <Image source={require('../../../assets/Images/player_default.png')} style={styles.imagePlayer} resizeMode='contain' />
            <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                <View style={{ width: 100, height: 20, borderRadius: 4 }} />
            </SkeletonPlaceholder>
        </View>
    </View>
    )

    const InformationPlaceholder = () => (
        <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
            <View style={{ width: 100, height: 20, borderRadius: 4 }} />
        </SkeletonPlaceholder>
    )

    const InformationPlayer = () => (
        <ViewLightDark title='Informações' titleSize={18}>
            <View style={styles.informationView}>
                <Text style={styles.informationTitle}>Pontos</Text>
                {userInfos ?
                    <Text style={styles.informationValue}>      {userInfos.fpts}{userInfos.fpts_decimal && '.'+userInfos.fpts_decimal}
                    </Text>
                    : 
                    <InformationPlaceholder />}
            </View>
            <View style={styles.informationView}>
                <Text style={styles.informationTitle}>Vitórias</Text>
                {userInfos ?
                    <Text style={[styles.informationValue, {color:'rgba(0, 128, 55, 1)'}]}>      {userInfos.wins}
                    </Text>
                    : 
                    <InformationPlaceholder />}
            </View>
            <View style={styles.informationView}>
                <Text style={styles.informationTitle}>Derrotas</Text>
                {userInfos ?
                    <Text style={[styles.informationValue,{color:'red'}]}>      {userInfos.losses}
                    </Text>
                    : 
                    <InformationPlaceholder />}
            </View>
            <View style={styles.informationView}>
                <Text style={styles.informationTitle}>Empates</Text>
                {userInfos ?
                    <Text style={styles.informationValue}>      {userInfos.ties}
                    </Text>
                    : 
                    <InformationPlaceholder />}
            </View>
            <View style={styles.informationView}>
                <Text style={styles.informationTitle}>Posição no waiver</Text>
                {userInfos ?
                    <Text style={styles.informationValue}>      {userInfos.waiver_position}
                    </Text>
                    : 
                    <InformationPlaceholder />}
            </View>
        </ViewLightDark>
    )

    if(isLoading) {
        return (
            <HeaderLeagueContextProvider leagueObject={league}>
            <TabTopLeague leagueDraftSettings={leagueDraftSettings} isAble={true} activeButton={route.params?.active} leagueRosters={route.params?.leagueRosters} leagueObject={league} leagueUsers={route.params?.leagueUsers} />
            <InformationPlayer />
            <ViewLightDark title='Titulares' titleSize={18}>
                {
                roster.map((position, index) => {     
                            if(position=='BN') return
                            return (
                                <PlayerPlaceholder key={index} position={position} />
                            )
                        }) 
                }
                </ViewLightDark>
                <ViewLightDark title='Banco' titleSize={18}>
                { 
                    roster.map((position, index) => {     
                            if(position!='BN') return
                            return (
                                <PlayerPlaceholder key={index} position={position} />
                            )
                    })
                }
                </ViewLightDark>
            </HeaderLeagueContextProvider>
        )
    }

    return ( 
        <HeaderLeagueContextProvider leagueObject={league}>
            <TabTopLeague isAble={true} leagueDraftSettings={leagueDraftSettings} activeButton={route.params?.active} leagueObject={league} leagueUsers={leagueUsers} />
            <InformationPlayer />
                <ViewLightDark title='Titulares' titleSize={18}>
                {
                        roster.map((position, index) => {
                            if(position=='BN') return
                            let player;

                            (starters && starters[index]) ? player = starters[index] : player = playerEmpty

                            return (
                                <Player key={index} position={position} player={player} name={player.name} />
                            )
                        })
                }
                </ViewLightDark>
                <ViewLightDark title='Banco' titleSize={18}>
                {
                
                    roster_bench?.map((position, index) => {
                        let player;

                            (bench && bench[index]) ? player = bench[index] : player = playerEmpty

                        return (
                            <Player key={index} position={position} name={player.name} player={player} />
                        )
                    }) 
                }
                </ViewLightDark>
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
        width:60,
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
        paddingVertical:10,
        alignItems:'center'
    },
    playerPosition: {
        textAlign:'center', 
        fontWeight:'bold'
    },
    playerNameContainer: {
        justifyContent:'center',
        paddingLeft:10,
        flexDirection:'row',
        alignItems:'center'
    },
    playerName: {
        color:'white'
    },
    imagePlayer: {
        width: 45,
        height: 45,
        borderRadius:50,
        backgroundColor: DARK_BLACK,
        marginRight: 10,
    },
    informationTitle:{
        fontSize:15,
        color:'#656668',
        flex:3
    },
    informationValue:{
        fontSize:15,
        flex:1,
        textAlign:'right',
        color: '#C6C6C6',
    },
    informationView: {
        flexDirection:'row',
        paddingVertical:10
    }
})