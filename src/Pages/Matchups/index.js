import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import TabTopLeague from '../../components/TabTopLeague'
import { useState, useEffect, useContext } from "react";
import { UserDataContext } from "../../components/UserDataContext";
import { HeaderLeagueContextProvider } from "../../components/HeaderLeagueContext";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Tooltip from 'react-native-walkthrough-tooltip'
import { Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { getColorPosition, getPlayerPoints, getPlayerProjectedPoints } from "../../functions/GetRoster";
import { AllPlayersContext } from "../../components/AllPlayersContext";
import { LIGHT_GREEN, LIGHT_BLACK, LIGHT_GRAY, DARK_GRAY, DARKER_GRAY, WHITE, DARK_BLACK, DARK_GREEN } from '../../components/Variables'
import ViewLightDark from '../../components/ViewLightDark';
import TooltipButton from "../../components/TooltipButton";

const windowWidth = Dimensions.get('window').width;

const Matchups = ({route}) => {
    const league = route.params?.leagueObject;
    const leagueID = league.league_id
    const leagueScoringSettings = league.scoring_settings;
    const leagueDraftSettings = route.params?.leagueDraftSettings;
    const leagueUsers = route.params?.leagueUsers;
    const scoring_type = leagueDraftSettings[0].metadata.scoring_type;
    const roster = league.roster_positions;
    const roster_bench = roster.filter((item) => {
        return item.indexOf('BN') !== -1;
    });
    const { allPlayers } = useContext(AllPlayersContext)
    const { userData } = useContext(UserDataContext)
    const userID = userData.user_id;
    const [allProjectedPoints, setAllProjectedPoints] = useState(null);
    const [leagueRosters, setLeagueRosters] = useState(null);
    const [hasMatchup, setHasMatchup] = useState(true);
    const [week, setWeek] = useState((route.params?.week<=0) ? 1 : route.params?.week);

    // Player
    const [playerData, setPlayerData] = useState({})
    const [starters, setStarters] = useState(null)
    const [bench, setBench] = useState(null)
    const [playersPoints, setPlayersPoints] = useState(null)
    const [totalPoints, setTotalPoints] = useState(null)
    const [playerRosterID, setPlayerRosterID] = useState(null)
    const playerEmpty = {
        index: null,
        name: 'Vazio',
        player_id: 0,
        position: null,
        points: 0,
        projected_points: 0
    }

    // Opponent
    const [opponentData, setOpponentData] = useState({})
    const [opponentStarters, setOpponentStarters] = useState(null)
    const [opponentBench, setOpponentBench] = useState(null)
    const [opponentPlayersPoints, setOpponentPlayersPoints] = useState(null)
    const [opponentTotalPoints, setOpponentTotalPoints] = useState(null)
    const [opponentRosterID, setOpponentRosterID] = useState(null)

    const [showTip, setTip] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {
        getPlayersProjectedPoints(week, 'regular', scoring_type)

        setTotalPoints(null)
        setOpponentTotalPoints(null)

        setStarters(null)
        setBench(null)

        setOpponentStarters(null)
        setOpponentBench(null)

        setOpponentData(null)
        setHasMatchup(true)

        if(!leagueRosters) {
            getLeagueRosters(userID,leagueID)
        } else {
            getMatchup(playerRosterID, leagueID, week, leagueRosters);
        }

    },[week])
    

    const getLeagueRosters = async(_user_ID, _league_ID) => {
        fetch(`https://api.sleeper.app/v1/league/${_league_ID}/rosters`,{signal})
        .then(response => response.json())
        .then((data) => {
            setLeagueRosters(data);
            data.map((roster, index) => {
                if(roster.owner_id==_user_ID && roster.players) {
                    setPlayerRosterID(roster.roster_id)
                    getMatchup(roster.roster_id, leagueID, week, data)
                }
            })
        }).catch((e) => {
            console.log('Erro gl:',e)
            controller.abort()
            setErrorMessage(e)
        })
    }

    const getMatchup = async(_roster_id, _league_id, _week, _league_rosters) => {
        const URL = `https://api.sleeper.app/v1/league/${_league_id}/matchups/${_week}`
        let matchup_id;
        let opponent_roster_id;
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            if(data.length==0) {
                setHasMatchup(false)
                return
            } 
            data.map((roster, index) => {

                if(roster.roster_id==_roster_id) {
                    matchup_id = roster.matchup_id
                    const benchs = roster.players.filter((item) => {
                        return roster.starters.indexOf(item) === -1;
                    })

                    setPlayersPoints(roster.players_points)
                    setTotalPoints(roster.points)

                    setStarters(getPlayers(roster.starters))
                    setBench(getPlayers(benchs))

                }
                
            })

            data.map((roster, index) => {
                if(roster.matchup_id == matchup_id && roster.roster_id != _roster_id) {
                    const benchs = roster.players.filter((item) => {
                        return roster.starters.indexOf(item) === -1;
                    })

                    setOpponentPlayersPoints(roster.players_points)
                    setOpponentTotalPoints(roster.points)
                    setOpponentRosterID(roster.roster_id)
                    opponent_roster_id = roster.roster_id;

                    setOpponentStarters(getPlayers(roster.starters))
                    setOpponentBench(getPlayers(benchs))

                }
            })

            getUsersData(leagueID, _roster_id, opponent_roster_id, _league_rosters)
        }).catch((e) => {
            console.log('Erro gm:',e)
            controller.abort()
            setErrorMessage(e)
        })
    }

    const getPlayers = (_players) => {
        let players = [];
        _players.map((player, index) => {
            if(player!=0) {
                let projected_points = 0;

                players.push({
                    name: allPlayers[player].full_name,
                    position: allPlayers[player].fantasy_positions[0],
                    player_id: player,
                    index: index,
                    points:0,
                    projected_points:projected_points
                })
            } else{
                players.push({
                    name: 'Vazio',
                    position: 'Vazio',
                    player_id: 0,
                    index: index,
                    points:0,
                    projected_points:0
                })
            }
        })
        return players
    }

    const getPlayersProjectedPoints = async(_week, _season_type, _league_type) => {
        console.log('Fetching projections...')
        const WEEK = 1;
        const SEASON_TYPE = 'regular';
        const POSITIONS = 'position[]=DEF&position[]=FLEX&position[]=K&position[]=QB&position[]=RB&position[]=TE&position[]=WR&position[]=IDP_FLEX&position[]=SUPER_FLEX&position[]=DL&position[]=LB&position[]=DB';
        const LEAGUE_TYPE = 'ppr';

        const URL = `https://api.sleeper.com/projections/nfl/2022/${_week}?season_type=${_season_type}&${POSITIONS}&order_by=${_league_type}`;

        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setAllProjectedPoints(data);

        }).catch((e) => {
            console.log('Error pp:', e)
        })
    }

    const getUsersData = async(_id_league, _id_user, _id_opponent, _league_rosters) => {
        let user_id;
        let opponent_id;

        _league_rosters.map(roster => {
            if(roster.roster_id==_id_user){
                user_id = roster.owner_id
                setPlayerData({
                    ...playerData, 
                    rosterID: _id_user,
                    ownerID: roster.owner_id
                })
            }
            else if(roster.roster_id==_id_opponent){
                opponent_id = roster.owner_id
                setOpponentData({
                    ...opponentData, 
                    rosterID: _id_user,
                    ownerID: roster.owner_id
                })
            }
        })

        leagueUsers.map(player => {
            if(player.user_id == user_id) {
                setPlayerData({
                    ...playerData, 
                    displayName: player.display_name,
                    avatar: player.avatar,
                    teamData: player.metadata
                })
            }
            else if(player.user_id == opponent_id) {
                setOpponentData({
                    ...opponentData, 
                    displayName: player.display_name,
                    avatar: player.avatar,
                    teamData: player.metadata
                })
            }
        })

    }


    const Shadow = () => (
        <Image source={require('../../../assets/Images/shadow50.png')} style={styles.shadowStyle} />
    )

    const AvatarField = ({avatar, position}) => {
        let positionStyle = styles.rightAvatar;
        let avatarImage = 'https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png';

        if(position=='left') positionStyle = styles.leftAvatar
        if(avatar) avatarImage = `https://sleepercdn.com/avatars/${avatar}`


        return (
            <View style={[styles.avatar,positionStyle]}>
                <Image source={{uri: avatarImage}} style={styles.avatarImage} />
                <Shadow />
            </View>
    )}

    const MatchupField = () => (
        <View style={styles.matchupField}>
            <Image source={require('../../../assets/Images/field1.png')} style={styles.imageField} />
            <AvatarField avatar={(opponentData && opponentData.avatar) ? opponentData.avatar : null} position='left' />
            <AvatarField avatar={playerData.avatar ? playerData.avatar : null}
            position='right' />
        </View>
    )

    const SliderBox = () => {
        let userProjectedPoints = 0.0;
        let opponentProjectedPoints = 0.0;


        if(allProjectedPoints && starters && opponentStarters) {
            const arr1 = allProjectedPoints?.filter((item) => 
            { return starters.map(a => a.player_id).includes(item.player_id); }
            );
            const arr2 = allProjectedPoints?.filter((item) => 
            { return opponentStarters.map(a => a.player_id).includes(item.player_id); }
            );
            arr1.map((player) => {
                userProjectedPoints += getPlayerProjectedPoints(player.stats, leagueScoringSettings)

            })
            arr2.map((player) => {
                opponentProjectedPoints += getPlayerProjectedPoints(player.stats, leagueScoringSettings)
            })
        }


        return (
        <View style={{justifyContent:'flex-start',
        alignItems:'center',marginTop:-30,marginBottom:20,}}>
                <MultiSlider 
                    markerStyle={{backgroundColor:'blue',display:'none'}} 
                    unselectedStyle={{backgroundColor:LIGHT_GREEN,borderTopRightRadius:12,borderBottomRightRadius:12}} 
                    selectedStyle={{backgroundColor:'gray',borderTopLeftRadius
                    :12,borderBottomLeftRadius:12}} 
                    max={
                        (totalPoints + opponentTotalPoints > 0) ? 
                        totalPoints + opponentTotalPoints 
                        : 
                        (userProjectedPoints + opponentProjectedPoints > 0) ?
                        userProjectedPoints + opponentProjectedPoints : 100
                    } 
                    sliderLength={windowWidth -30} 
                    values={
                        (opponentTotalPoints > 0) ? 
                        [opponentTotalPoints] 
                        : 
                        (opponentProjectedPoints > 0) ?
                        [opponentProjectedPoints] : [50]
                    }
                    
                    trackStyle={{height:5,}} 
                    containerStyle={{height:5,}} 
                />
                <View style={{flexDirection:'row',paddingHorizontal:20,}}>
                    <View style={{flex:1,alignItems:'flex-start',}} >
                    <TooltipMessage hasBackground={true}  position='bottom' message='Pontos de fantasy do oponente.'>
                        <Text style={{color:LIGHT_GRAY,textAlign:'left'}}>
                            {opponentTotalPoints ? opponentTotalPoints : 
                            opponentProjectedPoints.toFixed(1)}
                        </Text>
                    </TooltipMessage>
                    </View>
                    <View style={{flex:1,alignItems:'flex-end'}} >
                    <TooltipMessage position='top' message='Pontos de fantasy do seu time.'>
                        <Text style={{color:LIGHT_GREEN,textAlign:'right'}}>
                            {totalPoints ? totalPoints 
                            : userProjectedPoints.toFixed(1)} 
                        </Text>
                    </TooltipMessage>
                    </View>
                </View>
        </View>
    )}

    const WeekSelect = () => (

            <View style={{width:150,height:40,backgroundColor:LIGHT_BLACK,flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center',borderRadius:12,}}>
                <TouchableOpacity 
                    disabled={(week==1) ? true : false}
                    onPress={() => setWeek(week - 1)} 
                    style={{flex:1,opacity:(week==1) ? 0.2 : 1}}
                >
                    <Entypo name="chevron-left" style={{textAlign:'center'}} size={24} color="#C6C6C6" />
                </TouchableOpacity>
                
                <Text style={{color:LIGHT_GRAY,flex:3,textAlign:'center'}}>Semana {week}</Text>
                <TouchableOpacity 
                    onPress={() => setWeek(week + 1)} 
                    style={{flex:1}}
                >
                    <Entypo name="chevron-right" style={{textAlign:'center'}} size={24} color="#C6C6C6" />
                </TouchableOpacity>
            </View>

        
    )

    const TooltipMessage = ({children, message,position, hasBackground}) => (
        <Tooltip
            isVisible={showTip}
            content={
                   <View>
                     <Text style={{color:WHITE}}> {message} </Text>
                   </View>
            }
            onClose={() => setTip(false)}
            placement={position}
            backgroundColor={(hasBackground) ? 'rgba(0,0,0,0.5)' :'rgba(0,0,0,0)'}
            useReactNativeModal={true}
            contentStyle={{backgroundColor:DARK_GREEN}}
        >
            {children}
        </Tooltip>
    )

    const PlayerContainer = (props) => {
        const Points = () => (
            <Text style={[styles.playerMatchupPoints,{textAlign:(props.position=='left') ? 'right' : 'left',color: DARKER_GRAY /*(props.playerPoints=='0.0') ? DARKER_GRAY : LIGHT_GRAY*/}]}>
            {(props.player.player_id!=0) ?(props.playerPoints=='0.0') ? `${(props.position=='left') ? '*' : ''}${props.projectedPoints.toFixed(1)}${(props.position=='right') ? '*' : ''}` : props.playerPoints : null}
            </Text>
        )

        if(props.position=='left') {
            return(
                <View style={styles.matchupPlayerContainer}>
                    <Text style={styles.playerMatchupLeft}>{props.player.name}</Text>   
                    <Points />
                </View>
            )
        } else {
            return (
                <View style={styles.matchupPlayerContainer}>
            { (props.index==0) ? 
                <View style={{flex:1,alignContent:'center'}}>
                <TooltipMessage position='bottom' message='Pontos de fantasy do jogador. O asterisco (*) indica que o número é apenas uma projeção dos pontos.'>
                    <Points />
                </TooltipMessage>
                </View> :
                <Points />
            }
            <Text style={styles.playerMatchupRight}>{props.player.name}</Text>
        </View>
            )
            
        }

    }

    const MatchupPlayers = (props) => {
        const playerUser = props.playerUser;
        const playerOpponent = props.playerOpponent;
        
        let player_projected_points = 0;
        let opponent_projected_points = 0;

        const playerOpponentPoints = getPlayerPoints(playerOpponent.player_id, playersPoints, opponentPlayersPoints);
        const playerUserPoints = getPlayerPoints(playerUser.player_id, playersPoints, opponentPlayersPoints);
        
         allProjectedPoints?.map((playerItem, index) => {
             if(playerItem.player_id==playerUser.player_id) {
                player_projected_points = getPlayerProjectedPoints(playerItem.stats, leagueScoringSettings);
             }
             else if(playerItem.player_id==playerOpponent.player_id) {
                opponent_projected_points = getPlayerProjectedPoints(playerItem.stats, leagueScoringSettings);
            }
         })
        
        return (
        <View style={styles.matchupContainer}>

            <PlayerContainer player={playerOpponent} projectedPoints={opponent_projected_points} playerPoints={playerOpponentPoints} position='left' index={props.index} />
            <Text style={[styles.position, {color:getColorPosition(props.position)}]}>
                {props.position.replace(/_/g,' ')}
            </Text>
            <PlayerContainer player={playerUser} projectedPoints={player_projected_points} playerPoints={playerUserPoints} index={props.index} position='right' />
        
        </View>
    )}

    const MatchupPlayersPlaceholder = ({position}) => (
        <View style={styles.matchupContainer}>
            <View style={{flex:3}}>
                <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                    <View style={styles.placeholderBarName} />
                </SkeletonPlaceholder>
            </View>

        <Text style={[styles.position, {color:getColorPosition(position)}]}>{position.replace(/_/g,' ')}</Text>

        <View style={{flex:3}}>
            <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                <View style={styles.placeholderBarName} />
            </SkeletonPlaceholder>
        </View>
        
        </View>
    )

    if(league.status!='in_season') {
        return (
            <View style={{flex:1,backgroundColor:'#0B0D0F'}}>
            <HeaderLeagueContextProvider leagueObject={league}>
                <TabTopLeague isAble={true} leagueDraftSettings={leagueDraftSettings} activeButton={route.params?.active} leagueObject={league} leagueUsers={leagueUsers} />
                <ViewLightDark>
                    <Text style={{color: WHITE, textAlign:'center'}}>A temporada regular da liga ainda não começou.</Text>
                </ViewLightDark>
            </HeaderLeagueContextProvider>
        </View>
        )
    }

    if(!hasMatchup) {
        return (
            <View style={{flex:1,backgroundColor:'#0B0D0F'}}>
            <HeaderLeagueContextProvider leagueObject={league}>
                <TabTopLeague isAble={true} leagueDraftSettings={leagueDraftSettings} activeButton={route.params?.active} leagueObject={league} leagueUsers={leagueUsers} />
                <WeekSelect />
                <ViewLightDark>
                    <Text style={{color: WHITE, textAlign:'center'}}>A liga não possui matchup para a semana {week}.</Text>
                </ViewLightDark>
            </HeaderLeagueContextProvider>
        </View>
        )
    }

    return ( 
        <View style={{flex:1,backgroundColor:'#0B0D0F'}}>
            <HeaderLeagueContextProvider leagueObject={league}>
                <TabTopLeague isAble={true} leagueDraftSettings={leagueDraftSettings} activeButton={route.params?.active} leagueObject={league} leagueUsers={leagueUsers} />
                <View style={{marginTop:20,marginLeft:10,marginRight:20,flexDirection:'row'}}>
                    <WeekSelect />
                    {starters && opponentStarters && <TooltipButton setTip={setTip} showTip={showTip} />}
                </View>
                
                <MatchupField />
                <SliderBox />
                <View style={[styles.boxContainer,{marginTop:0}]}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title,{textAlign:'left'}]}>{(opponentData && opponentData.displayName) ? opponentData.displayName : 'Oponente'}</Text>
                        <Text style={styles.title}>Titulares</Text>
                        <Text style={[styles.title,{textAlign:'right'}]}>{userData.display_name}</Text>
                    </View>
                    {(starters && opponentStarters) ?
                        
                        roster.map((position, index) => {
                            if(position=='BN') return

                            const playerUser = starters[index] || playerEmpty;
                            const playerOpponent = opponentStarters[index] || playerEmpty;
                            
                            return (
                                <MatchupPlayers
                                    key={index}
                                    index={index}
                                    playerUser={playerUser}
                                    playerOpponent={playerOpponent}
                                    position={position}
                                />
                            )
                        })
                    :
                        roster.map((position, index) => {
                            if(position=='BN') return
                            
                            return (
                                <MatchupPlayersPlaceholder
                                    key={index}
                                    position={position}
                                />
                            )
                        })}
                </View>
                <View style={[styles.boxContainer,{marginTop:0}]}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Banco</Text>
                    </View>
                    {(bench && opponentBench) ?
                        
                        roster_bench.map((position, index) => {

                            const playerUser = bench[index] || playerEmpty;

                            const playerOpponent = opponentBench[index] || playerEmpty;
                            
                            return (
                                <MatchupPlayers
                                    key={index}
                                    playerUser={playerUser}
                                    playerOpponent={playerOpponent}
                                    position={position}
                                />
                            )
                        })
                    :
                        roster_bench.map((position, index) => {
                            
                            return (
                                <MatchupPlayersPlaceholder
                                    key={index}
                                    position={position}
                                />
                            )
                        })}
                </View>
            </HeaderLeagueContextProvider>
        </View>
     );
}
 
export default Matchups;

const styles = StyleSheet.create({
    boxContainer: { 
        borderRadius:12,
        margin:10,
        padding:10,
        elevation:10,
        borderWidth:1,
        borderColor: 'rgba(255,255,255,0)',
        backgroundColor: LIGHT_BLACK,
    },
    shadowStyle: {
        width:40,
        height:20,
        marginTop:-5
    },
    avatar: {
        flex:1,
        elevation:10,
        position:'absolute',
        right:75,
        bottom:100,
        width:40,
        height:40,
        borderRadius:40,
    },
    avatarImage: {
        width:40,
        height:40,
        borderRadius:40,
        resizeMode: 'cover'
    },
    leftAvatar: {
        left: (windowWidth / 2) / 2 
    },
    rightAvatar: {
        right: (windowWidth / 2) / 2
    },
    matchupField: {
        marginTop:20,
        justifyContent:'flex-end',
        alignItems:'center',
        position:'relative'
    },
    imageField: {
        width:330,
        height:150,
        resizeMode:'contain'
    },
    titleContainer: {
        marginBottom: 10,
        flexDirection:'row',
        justifyContent:'center',
        alignContent:'center'
    },
    title:{
        fontSize:17,
        fontWeight:'bold',
        color:WHITE,
        flex:1,
        textAlign:'center'
    },
    titleContent:{
        flexDirection:'row',
        //marginLeft:20,
        paddingHorizontal:10,
        marginTop:20,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        flex:1,
    },
    position: {
        flex:1,
        textAlign:'center',
        width:50,
        paddingTop:5,
        paddingBottom:5,
        borderRadius:5,
        justifyContent:'center',
        backgroundColor:'#262D33',
        marginLeft:5,
        marginRight: 5,
        fontWeight:'bold',
    },
    playerMatchupLeft: {
        flex:3,
        textAlign:'left',
        color:LIGHT_GRAY,
    },
    playerMatchupRight: {
        flex:3,
        textAlign:'right',
        color:LIGHT_GRAY
    },
    placeholderBarName: {
        width: '100%', 
        height: 20, 
        borderRadius: 4,
    },
    playerMatchupPoints: {
        flex:1,
        color:LIGHT_GRAY
    },
    matchupContainer: {
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center', 
        marginBottom:10,
    },
    matchupPlayerContainer: {
        flex:3,
        flexDirection:'row',
        alignItems:'center'
    }
})