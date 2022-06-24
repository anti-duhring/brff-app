import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import TabTopLeague from "../../components/TabTopLeague";
import { HeaderLeagueContextProvider } from "../../components/HeaderLeagueContext";
import ViewLightDark from "../../components/ViewLightDark";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { DARK_BLACK, DARK_GRAY, DARK_GREEN, LIGHT_BLACK, LIGHT_GRAY, LIGHT_GREEN, WHITE } from "../../components/Variables";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Tooltip from "react-native-walkthrough-tooltip";
import TooltipButton from "../../components/TooltipButton";

const PlayoffBracket = ({route}) => {
    const leagueId = route.params?.leagueObject.league_id;
    const leagueObject = route.params?.leagueObject;
    const leagueDraftSettings = route.params?.leagueDraftSettings;
    const leagueUsers = route.params?.leagueUsers;

    const [playoffData, setPlayoffData] = useState(null);
    const [toiletBowlData, setToiletBowlData] = useState(null);
    const [leagueRostersData, setLeagueRostersData] = useState(null);
    const [leagueUsersData, setLeagueUsersData] = useState(leagueUsers)
    const [round, setRound] = useState(1);
    const [showTip, setTip] = useState(false)

    class PlayerNull {
        constructor(name) {
            this.rosterID = 0;
            this.userData = {};
            this.userData.display_name = name;
            this.userData.avatar = null;
            this.rosterData = {};
            this.rosterData.settings = {};
            this.rosterData.settings.wins = 0;
            this.rosterData.settings.ties = 0;
            this.rosterData.settings.losses = 0;
            this.rosterData.settings.fpts = 0;
        }
    }
    class Player {
        constructor(rosterID) {
            this.rosterID = rosterID;
            this.rosterData = getPlayerRoster(rosterID);
            this.userData = getPlayerInfo(this.rosterData.owner_id);
        }
    }

    const getPlayerRoster = (rosterID) => {
        let playerRoster = null;
        leagueRostersData.map(roster => {
            if(roster.roster_id == rosterID) {
                playerRoster =  roster
            }
        });

        return playerRoster
    }

    const getPlayerInfo = (owner_id) => {
        let playerInfo = null;
        leagueUsersData.map(user => {
            if(user.user_id == owner_id) {
                playerInfo = user
            } 
        })

        return playerInfo
    }

    const getPlayoffBracket = async(_type) => {
        const URL = (_type=='winners') ? `https://api.sleeper.app/v1/league/${leagueId}/winners_bracket` : `https://api.sleeper.app/v1/league/${leagueId}/losers_bracket`;

        fetch(URL)
        .then(response => response.json())
        .then(data => {
            (_type=='winners') ? setPlayoffData(data) : setToiletBowlData(data);
        })
    }

    const getLeagueRostersData = async() => {
        const URL = `https://api.sleeper.app/v1/league/${leagueId}/rosters`;
        
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setLeagueRostersData(data);
        })
    }

    const TooltipMessage = ({children, message,position, hasBackground}) => (
        <Tooltip
            isVisible={showTip}
            content={
                   <View>
                     <Text style={{color:WHITE}}> {message} </Text>
                   </View>
            }

            onClose={() =>setTip(false)}
            placement={position}
            backgroundColor={(hasBackground) ? 'rgba(0,0,0,0.5)' :'rgba(0,0,0,0)'}
            useReactNativeModal={true}
            contentStyle={{backgroundColor:DARK_GREEN}}
        >
            {children}
        </Tooltip>
    )


    const RoundSelect = () => (
        <ViewLightDark style={styles.roundSelect} containerStyle={styles.roundSelectContainer}>
                <TouchableOpacity 
                    disabled={(round==1) ? true : false}
                    onPress={() => setRound(round - 1)} 
                    style={{flex:1,opacity:(round==1) ? 0.2 : 1}}
                >
                    <Entypo name="chevron-left" style={{textAlign:'center'}} size={24} color={LIGHT_GRAY} />
                </TouchableOpacity>
                
                <Text style={{color:LIGHT_GRAY,flex:3,textAlign:'center'}}>Round {round}</Text>
                <TouchableOpacity 
                    disabled={(playoffData && playoffData[playoffData.length - 1].r == round) ? true : false}
                    onPress={() => setRound(round + 1)} 
                    style={{flex:1,opacity:(playoffData && playoffData[playoffData.length - 1].r == round) ? 0.2 : 1}}
                >
                    <Entypo name="chevron-right" style={{textAlign:'center'}} size={24} color={LIGHT_GRAY} />
                </TouchableOpacity>
        </ViewLightDark>
        
    )

    const PlayerAvatar = ({player}) => (
        <Image source={(player.userData.avatar) ? {uri: `https://sleepercdn.com/avatars/${player.userData.avatar}`} : require('../../../assets/Images/player_default.png')} style={styles.playerAvatar} />
    );

    const PlayerFantasyPoints = ({player, position}) => (
        <Text style={[{fontSize:22,color:WHITE},(position=='left') ? {marginLeft:0} : {marginRight: 15}]}>
            {player.rosterData.settings.fpts.toFixed(1)}
        </Text>
    );

    const PlayerMatchup = ({player, position, winner, index}) => {
        return (
            <View style={{flex:2}}>
                <View style={[styles.playerMatchupContainer,{justifyContent: (position=='left') ? 'flex-start' : 'flex-end'}]}>
                    {
                        (position=='left') ?
                        <>
                                <PlayerAvatar player={player} />
                            
                            {(index==0) ? <View style={{alignContent:'flex-start',marginLeft:15}}>
                                <TooltipMessage hasBackground={true} position='top' message='Pontos de fantasy do time.'>
                                    <PlayerFantasyPoints player={player} position={position} />
                                </TooltipMessage>
                            </View> : <View style={{marginLeft:15}}><PlayerFantasyPoints player={player} position={position} /></View>}
                            
                        </> :
                        <>
                            <PlayerFantasyPoints player={player} position={position} />
                            <PlayerAvatar player={player} />
                        </>
                    }

                    </View>
                    <View style={{flex:1,alignItems:(position=='left') ? 'flex-start' : 'flex-end'}}>
                        <Text style={{color:WHITE, textAlign: (position=='left') ? 'left' : 'right'}}>    
                            { player.userData.display_name }
                        </Text>
                        {(index==0 && position=='right') ? <View style={{flex:1,alignItems:'flex-end'}}>
                            <TooltipMessage position='left' message='Vitórias - Derrotas (- Empates)'>
                                <Text style={{color:DARK_GRAY}}>{player.rosterData.settings.wins} - {player.rosterData.settings.losses}{(player.rosterData.settings.ties!=0) ? ' - '+player.rosterData.settings.ties : null}</Text>
                            </TooltipMessage>
                        </View> : <Text style={{color:DARK_GRAY}}>{player.rosterData.settings.wins} - {player.rosterData.settings.losses}{(player.rosterData.settings.ties!=0) ? ' - '+player.rosterData.settings.ties : null}</Text>}
                        
                    </View>
                </View>
        )
    }

    const Matchup = (props) => {
        return (
            <ViewLightDark style={{flexDirection:'row'}} title={(props.type=='winners') ? `Matchup ${props.matchup.m}` : `Toilet Bowl - Matchup ${props.matchup.m}`} titleAlign='center'>

                <PlayerMatchup player={props.player1} position='left' index={props.index} winner={(props.matchup.w == props.player1.rosterID) ? true : false} />
                <View style={styles.matchupVsContainer}>
                    {(props.type=='winners') ?
                    <MaterialCommunityIcons name="sword-cross" size={35} color={LIGHT_GREEN} /> : <FontAwesome5 name="toilet" size={35} color={LIGHT_GREEN} />}
                </View>
                <PlayerMatchup player={props.player2} position='right' index={props.index} winner={(props.matchup.w == props.player2.rosterID) ? true : false} />

            </ViewLightDark>
        )
    }

    const PlayerPlaceholder = (props) => {
        return (
            <View style={{flex:1}}>
                <View style={[styles.playerMatchupContainer,{justifyContent: (props.position=='left') ? 'flex-start' : 'flex-end'}]}>
                    {
                        (props.position=='left') ?
                        <>
                             <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                                <View style={styles.playerAvatar} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                                <View style={{width:60, height:25,marginLeft:15,borderRadius: 4}} />
                            </SkeletonPlaceholder>                       
                        </> :
                        <>
                            <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                                <View style={{width:60, height:25,marginRight:15,borderRadius: 4}} />
                            </SkeletonPlaceholder> 
                            <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                                <View style={styles.playerAvatar} />
                            </SkeletonPlaceholder>
                        </>
                    }

                    </View>
                    <View style={{flex:1,alignItems:(props.position=='left') ? 'flex-start' : 'flex-end'}}>
                        <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                            <View style={{width:100, height:20,marginBottom:10,borderRadius: 4}} />
                            <View style={{width:60, height:20,borderRadius: 4,alignSelf:(props.position=='left') ? 'flex-start' : 'flex-end'}} />
                        </SkeletonPlaceholder>
                    </View>
            </View>
        )
    }

    const MatchupPlaceholder = (props) => {
        return (
            <ViewLightDark>
                <View style={{alignItems:'center'}}>
                    <SkeletonPlaceholder highlightColor="#303840" backgroundColor="#262D33">
                        <View style={{width:120, height:25,marginBottom:10,borderRadius: 4}} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{flexDirection:'row'}}>
                <PlayerPlaceholder position='left' />
                <View style={styles.matchupVsContainer}>
                    <MaterialCommunityIcons name="sword-cross" size={35} color={LIGHT_GREEN} />
                </View>
                <PlayerPlaceholder position='right' />
                </View>
            </ViewLightDark>
            
        )
    }

    useEffect(() => {
        getLeagueRostersData();
        //getLeagueUsersData();
        getPlayoffBracket('winners');
        getPlayoffBracket('losers');
    },[])

    return ( 
        <View style={{flex:1,backgroundColor:'#0B0D0F',}}>
            <HeaderLeagueContextProvider leagueObject={leagueObject}>
                <TabTopLeague activeButton={route.params?.active} isAble={true} leagueDraftSettings={leagueDraftSettings} leagueObject={route.params?.leagueObject} leagueUsers={leagueUsers}  />

                <View style={{marginTop:20,marginLeft:10,marginRight:20,flexDirection:'row'}}>
                    <RoundSelect />
                    <TooltipButton setTip={setTip} showTip={showTip} />
                </View>

                <View>
                    {(leagueRostersData && leagueUsersData && playoffData) ?
                    
                    
                    playoffData.map((matchup, index) => {
                        if(matchup.r != round) return

                        let player1;
                        let player2;

                        if(matchup.t1) {
                            player1 = new Player(matchup.t1);
                        } else if(!matchup.t1 && matchup.t1_from) {
                            player1 = new PlayerNull((matchup.t1_from.w) ? `Vencedor do matchup ${matchup.t1_from.w}` : `Perdedor do matchup ${matchup.t1_from.l}`)

                        } else {
                            player1 = new PlayerNull('Vaga em aberto');
                        }

                        if(matchup.t2) {
                            player2 = new Player(matchup.t2);
                        } else if(!matchup.t2 && matchup.t2_from) {
                            player2 = new PlayerNull((matchup.t2_from.w) ? `Vencedor do matchup ${matchup.t2_from.w}` : `Perdedor do matchup ${matchup.t2_from.l}`)
                        } else {
                            player2 = new PlayerNull('Vaga em aberto');
                        }
                        
                            return (
                                <Matchup type='winners' matchup={matchup} player1={player1} player2={player2} key={index} index={index} />
                            )
                        
                    }) : 
                    <>
                        <MatchupPlaceholder />
                        <MatchupPlaceholder />
                    </>}
                </View>
                <View>
                    {(leagueRostersData && leagueUsersData && toiletBowlData) ?
                    
                    
                    toiletBowlData.map((matchup, index) => {
                        if(matchup.r != round) return

                        let player1;
                        let player2;

                        if(matchup.t1) {
                            player1 = new Player(matchup.t1);
                        } else if(!matchup.t1 && matchup.t1_from) {
                            player1 = new PlayerNull((matchup.t1_from.w) ? `Vencedor do Toilet matchup ${matchup.t1_from.w}` : `Perdedor do Toilet matchup ${matchup.t1_from.l}`)

                        } else {
                            player1 = new PlayerNull('Vaga em aberto');
                        }

                        if(matchup.t2) {
                            player2 = new Player(matchup.t2);
                        } else if(!matchup.t2 && matchup.t2_from) {
                            player2 = new PlayerNull((matchup.t2_from.w) ? `Vencedor do Toilet matchup ${matchup.t2_from.w}` : `Perdedor do Toilet matchup ${matchup.t2_from.l}`)
                        } else {
                            player2 = new PlayerNull('Vaga em aberto');
                        }
                        
                            return (
                                <Matchup type='losers' matchup={matchup} player1={player1} player2={player2} key={index} />
                            )
                        
                    }) : 
                    <>
                        <MatchupPlaceholder />
                        <MatchupPlaceholder />
                    </>}
                </View>
            </HeaderLeagueContextProvider>
        </View>
     );
}
 
export default PlayoffBracket;

const styles = StyleSheet.create({
    playerMatchupContainer: {
        flexDirection:'row',
        flex:1,
        alignItems:'center',
        marginBottom:10,
    },
    matchupVsContainer: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    matchupVsText: {
        color:LIGHT_GREEN,
    },
    playerAvatar: {
        width:50,
        height:50,
        borderRadius:50,
        resizeMode: 'cover',
        backgroundColor:DARK_BLACK
    },
    roundSelect: {
        flexDirection:'row',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    roundSelectContainer: {
        width:150,
        height:40,
    },
    title: {
        fontSize:19,
        fontWeight:'bold',
        color:WHITE,
        flex:1,
        textAlign:'center'
    }, 
    titleContainer: {
        marginBottom:0,
    }
})