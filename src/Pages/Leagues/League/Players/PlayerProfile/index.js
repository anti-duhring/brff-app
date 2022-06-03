import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import PlayerProfileHeader from "../../../../../components/PlayerProfileHeader";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const MAX_HEIGHT = 200;
const MIN_HEIGHT = 55;
const WIDTH = Dimensions.get('window').width;

const PlayerProfile = ({navigation, route}) => {
    const player = route.params?.playerObject;
    const leagueID = route.params?.leagueID;
    const userID = player.user_id;
    const name = player.display_name;

    const roster = route.params?.roster
    const [rosterData, setRosterData] = useState(null)
    const [starters, setStarters] = useState(null)
    const [bench, setBench] = useState(null)
    const [userInfos, setUserInfos] = useState(null)
    const [hasPlayers, setHasPlayers] = useState(false)

    const [errorMessage, setErrorMessage] = useState(null)
    const controller = new AbortController();
    const signal = controller.signal;

    const getRoster = async() => {
        fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`,{signal})
        .then(response => response.json())
        .then((data) => {
            data.map((roster, index) => {
                if(roster.owner_id==userID && roster.players) {
                    setHasPlayers(true)
                    setRosterData(roster)
                    setUserInfos(roster.settings)
                    getStartersInfo(roster.starters)
                    getBenchInfo(roster.players, roster.starters)
                }
            })
        }).catch((e) => {
            console.log('Erro:',e)
            controller.abort()
            setErrorMessage(e)
        })
    }

    const getBenchInfo = async(allplayers, startersplayers) => {
        let benchWithInfo = [];
        let allbenchs = allplayers.filter((item) => {
            return startersplayers.indexOf(item) === -1;
        });
        await allbenchs.reduce(async(memo, player, index) => {
            await memo;
            if(player != 0){
                const response = await fetch(`https://teste-draft.netlify.app/.netlify/functions/getplayersdata?name=${player}`)
                const data = await response.json()
                
                let name = data.full_name;
                if(isNaN(player)) name = `${data.first_name} ${data.last_name}`

                benchWithInfo.push({
                    name: name,
                    position: data.fantasy_positions[0],
                    index: index
                })
            } else {
                benchWithInfo.push({
                    name: 'Empty',
                    position: 'Empty',
                    index: index
                })
            }
        }, Promise.resolve())
        setBench(benchWithInfo)
    }

    const getStartersInfo = async(players) => {
        let startersWithInfo = []
        await players.reduce(async(memo, player, index) => {
            await memo;
            if(player != 0){
                const response = await fetch(`https://teste-draft.netlify.app/.netlify/functions/getplayersdata?name=${player}`)
                const data = await response.json()
                
                let name = data.full_name;
                if(isNaN(player)) name = `${data.first_name} ${data.last_name}`

                startersWithInfo.push({
                    name: name,
                    position: data.fantasy_positions[0],
                    index: index
                })
            } else {
                startersWithInfo.push({
                    name: 'Empty',
                    position: 'Empty',
                    index: index
                })
            }
        }, Promise.resolve())
        setStarters(startersWithInfo)
    }
    
    const getColorPosition = (position) => {
        let colorPosition = 'black';
        switch(position){
            case 'QB':
                colorPosition = 'red'
                break;
            case 'RB':
                colorPosition = 'teal'
                break;
            case 'WR':
                colorPosition = 'blue'
                break;
            case 'TE':
                colorPosition = 'yellow'
                break;
            case 'FLEX':
                colorPosition = 'pink'
                break;
            case 'SUPER_FLEX':
                colorPosition = 'green'
                break;
            case 'K':
                colorPosition = 'purple'
                break;
            case 'DEF':
                colorPosition = 'gray'
                break;
            default:
                colorPosition = 'black'
        }
        return colorPosition
    }

    useEffect(() => {
        getRoster()
    },[])

    const ViewPlayer = ({position, isEmpty, playerName}) => (
        <View style={{flexDirection:'row',paddingVertical:10}}>
            <View style={styles.positionLegend}>
                <Text style={{color:getColorPosition(position),textAlign:'center', fontWeight:'bold'}}>{position.replace(/_/g,' ')}</Text>
            </View>
            <View style={{justifyContent:'center', paddingLeft:10}}>
                <Text style={{color:'white'}}>{isEmpty ? 'Empty' : playerName}</Text>
            </View>
        </View>
    )

    const ViewPlayerPlaceholder = ({ position}) => (
        <View style={{flexDirection:'row',paddingVertical:10}}>
        <View style={styles.positionLegend}>
            <Text style={{color:getColorPosition(position),textAlign:'center', fontWeight:'bold'}}>
                {position.replace(/_/g,' ')}
            </Text>
        </View>
        <View style={{justifyContent:'center', paddingLeft:10}}>
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
        <View style={styles.boxContainer}>
            <View style={styles.informationContent}>
                <Text style={styles.title}>Informações</Text>
            </View>
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
        </View>
    )

    if(!hasPlayers) {
        return (
            <PlayerProfileHeader playerObject={player}>
                <InformationPlayer />
                <View style={styles.boxContainer}>
                    <View style={styles.informationContent}>
                        <Text style={styles.title}>Titulares</Text>
                    </View>
                    {roster.map((position, index) => {     
                            if(position=='BN') return
                            return (
                                <ViewPlayer key={index} position={position} isEmpty={true} />
                            )
                        })}
                </View>
                </PlayerProfileHeader>
        )
    }

    return (
        <PlayerProfileHeader playerObject={player}>
            <View>
            <InformationPlayer />
            <View style={styles.boxContainer}>
                    <View style={styles.informationContent}>
                        <Text style={styles.title}>Titulares</Text>
                    </View>
                        {!starters ? 
                        roster.map((position, index) => {     
                            if(position=='BN') return
                            return (
                                <ViewPlayerPlaceholder key={index} position={position} />
                            )
                        }) 
                            : 
                        roster.map((position, index) => {
                            if(position=='BN') return
                            return (
                                <ViewPlayer key={index} position={position} isEmpty={false} playerName={starters[index].name} />
                            )
                        })}
                    
                    <View style={styles.informationContent}>
                        <Text style={styles.title}>Banco</Text>
                    </View>
                    {!bench ? 
                        roster.map((position, index) => {     
                            if(position!='BN') return
                            return (
                                <ViewPlayerPlaceholder key={index} position={position} />
                            )
                        }) 
                            : 
                        bench.map((position, index) => {
                            return (
                                <ViewPlayer key={index} position={'BN'} isEmpty={false} playerName={bench[index].name} />
                            )
                        })}
                </View>
            </View>
        </PlayerProfileHeader>
    )
}
 
export default PlayerProfile;

const styles = StyleSheet.create({
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
    boxContainer: {
        borderRadius:12,margin:10,padding:10,
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