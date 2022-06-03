import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import TabTopLeague from '../TabTopLeague'
import { useState, useEffect, useContext } from "react";
import { UserDataContext } from "../../../../components/UserDataContext";
import { HeaderLeagueContextProvider } from "../../../../components/HeaderLeagueContext";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { getColorPosition, getPlayerPoints } from "../../../../functions/GetRoster";
import { AllPlayersContext } from "../../../../components/AllPlayersContext";

const windowWidth = Dimensions.get('window').width;

const Matchups = ({route}) => {
    const league = route.params?.leagueObject;
    const leagueID = league.league_id
    const leagueScoringSettings = league.scoring_settings;
    const leagueDraftSettings = route.params?.leagueDraftSettings;
    const scoring_type = leagueDraftSettings[0].metadata.scoring_type;
    const roster = league.roster_positions;
    const roster_bench = roster.filter((item) => {
        return item.indexOf('BN') !== -1;
    });
    const { allPlayers } = useContext(AllPlayersContext)
    const { userData } = useContext(UserDataContext)
    const userID = userData.user_id;
    const [allProjectedPoints, setAllProjectedPoints] = useState(null);

    const navigation = useNavigation();
    let week = route.params?.week;

    // Player
    const [playerData, setPlayerData] = useState({})
    const [starters, setStarters] = useState(null)
    const [bench, setBench] = useState(null)
    const [playersPoints, setPlayersPoints] = useState(null)
    const [totalPoints, setTotalPoints] = useState(null)
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

    const [errorMessage, setErrorMessage] = useState(null)
    const controller = new AbortController();
    const signal = controller.signal;

    if(week<=0) week = 1;
  
    useEffect(() => {
        if(!allProjectedPoints) return

        setTotalPoints(null)
        setOpponentTotalPoints(null)

        setStarters(null)
        setBench(null)

        setOpponentStarters(null)
        setOpponentBench(null)

        setOpponentData({})

        getRosterID(userID,leagueID)
    },[allProjectedPoints])

    useEffect(() => {
        getPlayersProjectedPoints(week, 'regular', scoring_type)
    },[week])

    

    const getRosterID = async(_user_ID, _league_ID) => {
        fetch(`https://api.sleeper.app/v1/league/${_league_ID}/rosters`,{signal})
        .then(response => response.json())
        .then((data) => {
            data.map((roster, index) => {
                if(roster.owner_id==_user_ID && roster.players) {
                    getMatchup(roster.roster_id, leagueID, week)
                }
            })
        }).catch((e) => {
            console.log('Erro:',e)
            controller.abort()
            setErrorMessage(e)
        })
    }

    const getMatchup = async(_roster_id, _league_id, _week) => {
        const URL = `https://api.sleeper.app/v1/league/${_league_id}/matchups/${_week}`
        let matchup_id;
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            data.map(async (roster, index) => {
                if(roster.roster_id==_roster_id) {
                    matchup_id = roster.matchup_id
                    const benchs = roster.players.filter((item) => {
                        return roster.starters.indexOf(item) === -1;
                    })

                    setPlayersPoints(roster.players_points)
                    setTotalPoints(roster.points)

                    setStarters(getPlayers(roster.starters))
                    setBench(getPlayers(benchs))
                    //setStarters(await getStartersPlayers(roster.starters))
                    //setBench(await getBenchPlayers(roster.players, roster.starters))
                }
            })
            data.map(async (roster) => {
                if(roster.matchup_id == matchup_id && roster.roster_id != _roster_id) {
                    const benchs = roster.players.filter((item) => {
                        return roster.starters.indexOf(item) === -1;
                    })

                    setOpponentPlayersPoints(roster.players_points)
                    setOpponentTotalPoints(roster.points)
                    getOwnersID(leagueID, _roster_id, roster.roster_id)

                    setOpponentStarters(getPlayers(roster.starters))
                    setOpponentBench(getPlayers(benchs))

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
                let projected_points = 0;
                let player_n;
                allProjectedPoints.map((playerItem, index) => {
                    if(playerItem.player_id==player) {
                        Object.entries(playerItem.stats).map(item => {
                            if(!leagueScoringSettings[item[0]]) return

                            const league_score = leagueScoringSettings[item[0]];
                            const point_made = item[1] * league_score;
                            projected_points +=  point_made
                            //projected_points.push(item)
                        })
                        player_n = index
                    }
                })

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
                    name: 'Empty',
                    position: 'Empty',
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
        const POSITIONS = 'position[]=DEF&position[]=FLEX&position[]=K&position[]=QB&position[]=RB&position[]=TE&position[]=WR';
        const LEAGUE_TYPE = 'ppr';

        const URL = `https://api.sleeper.com/projections/nfl/2022/${_week}?season_type=${_season_type}&${POSITIONS}&order_by=${_league_type}`;

        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setAllProjectedPoints(data);
        }).catch((e) => {
            console.log('Error:', e)
        })
    }

    const getOwnersID = async(_id_league, _id_user, _id_opponent) => {
        const URL = `https://api.sleeper.app/v1/league/${_id_league}/rosters`;
        let user_id;
        let opoonent_id;
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            data.map(roster => {
                if(roster.roster_id==_id_user){
                    user_id = roster.owner_id
                    setPlayerData({
                        ...playerData, 
                        rosterID: _id_user,
                        ownerID: roster.owner_id
                    })
                }
                else if(roster.roster_id==_id_opponent){
                    opoonent_id = roster.owner_id
                    setOpponentData({
                        ...opponentData, 
                        rosterID: _id_user,
                        ownerID: roster.owner_id
                    })
                }
            })
            getPlayersData(_id_league, user_id, opoonent_id)
        }).catch((e) => {
            console.log('Erro:',e)
        })
    }

    const getPlayersData = async(_league_id, _player_id, _opponent_id) => {
        const URL = `https://api.sleeper.app/v1/league/${_league_id}/users`
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            data.map(player => {
                if(player.user_id == _player_id) {
                    setPlayerData({
                        ...playerData, 
                        displayName: player.display_name,
                        avatar: player.avatar,
                        teamData: player.metadata
                    })
                }
                else if(player.user_id == _opponent_id) {
                    setOpponentData({
                        ...opponentData, 
                        displayName: player.display_name,
                        avatar: player.avatar,
                        teamData: player.metadata
                    })
                }
            })
        })
    }

    const Shadow = () => (
        <Image source={require('../../../../../assets/Images/shadow50.png')} style={styles.shadowStyle} />
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
            <Image source={require('../../../../../assets/Images/field1.png')} style={styles.imageField} />
            <AvatarField avatar={opponentData.avatar ? opponentData.avatar : null} position='left' />
            <AvatarField avatar={playerData.avatar ? playerData.avatar : null}
            position='right' />
        </View>
    )

    const SliderBox = () => {
        let userProjectedPoints = 0.0;
        let opponentProjectedPoints = 0.0;

        if(starters && opponentStarters) {
            starters.map(player => {
                userProjectedPoints += player.projected_points
            })
    
            opponentStarters.map(player => {
                opponentProjectedPoints += player.projected_points
            })
        }

        return (
        <View style={{justifyContent:'flex-start',
        alignItems:'center',marginTop:-30,marginBottom:20,}}>
                <MultiSlider 
                    markerStyle={{backgroundColor:'blue',display:'none'}} 
                    unselectedStyle={{backgroundColor:'#008037',borderTopRightRadius:12,borderBottomRightRadius:12}} 
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
                    <Text style={{color:'#C6C6C6',flex:1,textAlign:'left'}}>
                        {opponentTotalPoints ? opponentTotalPoints : 
                        opponentProjectedPoints.toFixed(1)}
                    </Text>
                    <Text style={{color:'#C6C6C6',flex:1,textAlign:'right'}}>
                        {totalPoints ? totalPoints 
                        : userProjectedPoints.toFixed(1)} 
                    </Text>
                </View>
        </View>
    )}

    const WeekSelect = () => (
        <View style={{marginTop:20,marginLeft:10,}}>
            <View style={{width:150,height:40,backgroundColor:'#15191C',flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center',borderRadius:12,}}>
                <TouchableOpacity 
                    disabled={(week==1) ? true : false}
                    onPress={() => navigation.navigate('Matchups',{ active: 'Matchups', week: week - 1})} 
                    style={{flex:1,opacity:(week==1) ? 0.2 : 1}}
                >
                    <Entypo name="chevron-left" style={{textAlign:'center'}} size={24} color="#C6C6C6" />
                </TouchableOpacity>
                
                <Text style={{color:'#C6C6C6',flex:3,textAlign:'center'}}>Semana {week}</Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Matchups',{ active: 'Matchups', week: week + 1})} 
                    style={{flex:1}}
                >
                    <Entypo name="chevron-right" style={{textAlign:'center'}} size={24} color="#C6C6C6" />
                </TouchableOpacity>
            </View>
        </View>
        
    )

    const MatchupPlayers = ({playerUserName, playerOpponentName, playerUserID, playerOpponentID, playerUserProjectedPoints, playerOpponentProjectedPoints, position}) => (
        <View style={styles.matchupContainer}>

        <View style={styles.matchupPlayerContainer}>
            <Text style={styles.playerMatchupLeft}>{playerOpponentName}</Text>
            <Text style={[styles.playerMatchupPoints,{textAlign:'right'}]}>
                {playerOpponentProjectedPoints.toFixed(1)/*(playerOpponentID!=0) ?getPlayerPoints(playerOpponentID, playersPoints, opponentPlayersPoints) : null*/}
            </Text>
        </View>
        <Text style={[styles.position, {color:getColorPosition(position)}]}>
            {position.replace(/_/g,' ')}
        </Text>
        <View style={styles.matchupPlayerContainer}>
            <Text style={[styles.playerMatchupPoints,{textAlign:'left'}]}>
                {playerUserProjectedPoints.toFixed(1)/*(playerUserID!=0) ? getPlayerPoints(playerUserID, playersPoints, opponentPlayersPoints) : null*/}
            </Text>
            <Text style={styles.playerMatchupRight}>{playerUserName}</Text>
        </View>
        
        </View>
    )

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


    return ( 
        <View style={{flex:1,backgroundColor:'#0B0D0F'}}>
            <HeaderLeagueContextProvider leagueObject={league}>
                <TabTopLeague isAble={true} leagueDraftSettings={leagueDraftSettings} activeButton={route.params?.active} />
                <WeekSelect />
                <MatchupField />
                <SliderBox />
                <View style={[styles.boxContainer,{marginTop:0}]}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title,{textAlign:'left'}]}>{(opponentData.displayName) ? opponentData.displayName : 'Oponente'}</Text>
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
                                    playerUserID={playerUser.player_id}
                                    playerOpponentID={playerOpponent.player_id}
                                    
                                    playerUserName={playerUser.name}
                                    playerOpponentName={playerOpponent.name}

                                    playerUserProjectedPoints={playerUser.projected_points}
                                    playerOpponentProjectedPoints={playerOpponent.projected_points}

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
                                    playerUserID={playerUser.player_id}
                                    playerOpponentID={playerOpponent.player_id}
                                    playerUserName={playerUser.name}
                                    playerOpponentName={playerOpponent.name}

                                    playerUserProjectedPoints={playerUser.projected_points}
                                    playerOpponentProjectedPoints={playerOpponent.projected_points}

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
        backgroundColor: '#15191C',
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
        left:75
    },
    rightAvatar: {
        right:75
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
        color:'#C6C6C6',
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
        color:'#C6C6C6',
    },
    playerMatchupRight: {
        flex:3,
        textAlign:'right',
        color:'#C6C6C6'
    },
    placeholderBarName: {
        width: '100%', 
        height: 20, 
        borderRadius: 4,
    },
    playerMatchupPoints: {
        flex:1,
        color:'#C6C6C6'
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