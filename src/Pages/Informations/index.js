import { Text, View, StyleSheet, Dimensions, FlatList, Animated, findNodeHandle, TouchableOpacity, ActivityIndicator } from "react-native";
import TabTopLeague from '../../components/TabTopLeague'
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { NFLStatusContext } from "../../context/NFLStatusContext";
import { HeaderLeagueContextProvider } from "../../components/HeaderLeagueContext";
import ViewLightDark from '../../components/ViewLightDark'
import { DARKER_GRAY, DARK_BLACK, DARK_GRAY, LIGHT_BLACK, LIGHT_GRAY, LIGHT_GREEN, WHITE } from "../../components/Variables";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AnimatedTab from "../../components/AnimatedTab";
import { AllPlayersContext } from "../../context/AllPlayersContext";
import ProgressiveImage from "../../components/ProgressiveImage";

const {width} = Dimensions.get('screen');
const dataTab = [
    {
        title: 'Configurações',
        icon: <Ionicons name="settings-outline" size={20} color={LIGHT_GREEN} />,
        key: 0,
        ref: React.createRef()
    },
    {
        title: 'Transações',
        icon: <MaterialIcons name="published-with-changes" size={20} color={LIGHT_GREEN} />,
        key: 1,
        ref: React.createRef()
    }
]

const Informations = ({navigation, route}) => {
    // LEAGUE BASIC INFORMATION
    const league = route.params?.leagueObject;
    const leagueDraftSettings = route.params?.leagueDraftSettings;
    const leagueRosters = route.params?.leagueRosters;
    const scoringLeague = league.scoring_settings;
    const leagueUsers = route.params?.leagueUsers;
    const leagueID = league.league_id;

    // USE CONTEXT
    const {season, week} = useContext(NFLStatusContext);
    const { allPlayers } = useContext(AllPlayersContext);

    // LEAGUE DATA TO FETCH
    const [scoringSettings, setScoringSettings] = useState([])
    const [leagueTransactions, setLeagueTransactions] = useState(null)
    const [generalInformations, setGeneralInformations] = useState([])
    const [errorMessage, setErrorMessage] = useState(null);
    const [dropdownTransactionsOption, setDropdownTransactionsOption] = useState('Trocas');
    const [showItems, setShowItems] = useState(10)
    const [isMoreLoading, setIsMoreLoading] = useState(false)

    // ANIMATED TAB REF
    const flatlistRef = useRef();
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const onTabPress = useCallback(itemIndex => {
        flatlistRef?.current?.scrollToOffset({
            offset: itemIndex * width
        });
    });

    class UserTransaction {
        constructor(roster_id) {
            this.roster = leagueRosters.filter(roster => {
                return roster.roster_id == roster_id
            })[0];
            this.user_data = leagueUsers.filter(user => {
                return user.user_id == this.roster.owner_id
            })[0];
        }
    } 
    
    class UserTransactionNull {
        constructor() {
            this.roster = null;
            this.user_data = null;
        }
    }

    const objectToArray = (obj) => {
        return Object.keys(obj).map((key) => {return [key, obj[key]]})
    }

    const replaceObjectKey = (keyArray) => {
        //console.log(keyArray.join('|'))
        let str = keyArray[0];
        str = str.replace(/\bpass_2pt\b/g,'{ATK}$3%Passe pra conversão de 2pts')
                    .replace(/\brec_2pt\b/g,'{ATK}$11%Recepção pra conversão de 2pts')
                    .replace(/\brec\b/g,'{ATK}$8%Recepção')
                    .replace(/\bpass_int\b/g,'{ATK}$4%Passe interceptado')
                    .replace(/\bfgmiss\b/g,'{ST}$6%FG perdido')
                    .replace(/\brec_yd\b/g,'{ATK}$9%Jarda recebida')
                    .replace(/\brush_yd\b/g,'{ATK}$5%Jarda corrida')
                    .replace(/\bpass_td\b/g,'{ATK}$2%TD passado')
                    .replace(/\bfum_lost\b/g,'{ATK}$12%Fumble não recuperado')
                    .replace(/\bxpmiss\b/g,'{ST}$8%Extra point perdido')
                    .replace(/\bfgm_30_39\b/g,'{ST}$3%FG de 30 até 39jds')
                    .replace(/\bfgm_20_29\b/g,'{ST}$2%FG de 20 até 29jds')
                    .replace(/\bfgm_40_49\b/g,'{ST}$4%FG de 40 até 49jds')
                    .replace(/\bblk_kick\b/g,'{DEF}$13%Chute bloqueado')
                    .replace(/\bpts_allow_7_13\b/g,'{DEF}$4%Ceder de 7 até 13 pontos')
                    .replace(/\bpts_allow_35p\b/g,'{DEF}$8%Ceder 35 pontos ou mais')
                    .replace(/\bpts_allow_14_20\b/g,'{DEF}$5%Ceder de 14 até 20 pontos')
                    .replace(/\bpts_allow_21_27\b/g,'{DEF}$7%Ceder de 21 até 27 pontos')
                    .replace(/\bpts_allow_28_34\b/g,'{DEF}$6%Ceder de 28 até 34 pontos')
                    .replace(/\bpts_allow_1_6\b/g,'{DEF}$2%Ceder de 1 até 6 pontos')
                    .replace(/\bsafe\b/g,'{DEF}$11%Safety')
                    .replace(/\bfum_rec\b/g,'{ATK}$13%Fumble recuperado')
                    .replace(/\bdef_td\b/g,'{DEF}$1%TD defensivo')
                    .replace(/\bst_td\b/g,'{ST}$9%TD de ST')
                    .replace(/\bxpm\b/g,'{ST}$7%Extra point feito')
                    .replace(/\bint\b/g,'{DEF}$10%INT')
                    .replace(/\bpts_allow_0\b/g,'{DEF}$2%Ceder 0 pontos')
                    .replace(/\bdef_st_fum_rec\b/g,'{ST}$10%Fumble recuperado  defensivo')
                    .replace(/\bdef_st_td\b/g,'{ST}$11%Fumble recuperado')
                    .replace(/\bdef_st_fum_rec\b/g,'{ST}$12%TD')
                    .replace(/\bfum_rec_td\b/g,'{ATK}$14%TD de fumble recuperado')
                    .replace(/\brush_2pt\b/g,'{ATK}$7%Corrida pra conversão de 2pts')
                    .replace(/\brec_td\b/g,'{ATK}$10%TD recebido')
                    .replace(/\bff\b/g,'{DEF}$12%Fumble forçado')
                    .replace(/\bst_fum_rec\b/g,'{ST}$13%Fumble recuperado')
                    .replace(/\bdef_st_ff\b/g,'{ST}$14%Fumble forçado defensivo')
                    .replace(/\bfgm_50p\b/g,'{ST}$5%FG de 50jds ou mais')
                    .replace(/\bfgm_0_19\b/g,'{ST}$1%FG de 0 até 19jds')
                    .replace(/\bsack\b/g,'{DEF}$9%Sack')
                    .replace(/\bpass_yd\b/g,'{ATK}$1%Jarda passada')
                    .replace(/\brush_td\b/g,'{ATK}$6%TD corrido')
                    .replace(/\bfum\b/g,'{ATK}$15%Fumble')
                    .replace(/\bst_ff\b/g,'{ST}$15%Fumble forçado')
                    .replace(/\bbonus_rec_te\b/g,'{ATK}Bônus recepção de TE')
                    .replace(/\bpass_int_td\b/g,'{DEF}TD de passe interceptado')
         return [str, keyArray[1]]
    }
    /*objectToArray(scoringLeague).forEach((setting) => {
        console.log(setting)
    })*/
    const getSettings = () => {
        let settings = [];
        for(let i=0;i<objectToArray(scoringLeague).length;i++){
        
            settings.push(replaceObjectKey(objectToArray(scoringLeague)[i]))
            if(i + 1 == objectToArray(scoringLeague).length){
                setScoringSettings(settings)
            }
        }
    }

    const getTransactions = async() => {
        const URL = `https://api.sleeper.app/v1/league/${leagueID}/transactions/${(week > 0) ? week : 1}`;
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            setLeagueTransactions(data)
        });
    }

    const getGeneralInfos = async() => {
        fetch(`https://api.sleeper.app/v1/league/${leagueID}/drafts`)
            .then(response => response.json())
            .then((data) => {
                setGeneralInformations(data)
            }).catch((e) => {
                console.log('Erro:',e)
                setErrorMessage(e)
            })
    }

    useEffect(() => {
        getSettings();
        getGeneralInfos();
        getTransactions();
        console.log(league.league_id)
    },[])

    const Footer = () => {
        if(!leagueTransactions || leagueTransactions.length <= 0) return null

        return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            {isMoreLoading? <ActivityIndicator size='large' color={LIGHT_GREEN} />
             : <TouchableOpacity onPress={() => {setIsMoreLoading(true); setShowItems(showItems + 10)}} style={{flexDirection:'row',backgroundColor:LIGHT_GREEN,
        width:170,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,}}>
                <Text style={{        marginLeft:5,
        color:'white',
        fontWeight:'600'}}>Carregar mais</Text>
            </TouchableOpacity>}
        </View>
    )}

    const InformationContainer = (props) => {
        return (
            <View style={styles.informationContent}>
                <Text style={[styles.informationTitle,styles.informationConfig]}>{props.name} </Text>
                <Text style={[styles.informationValue,styles.informationConfig]}>{props.value}</Text>
            </View>
        )
    }

    const ScoringContainer = (props) => {
        return (
            <ViewLightDark title={props.title} titleSize={18}>
            {scoringSettings.map((key, index) => {
                if(key[0].indexOf(`{${props.type}}`) == -1) return
                const score = key[0].replace(/{ATK}/g,'').replace(/{ST}/g,'').replace(/{DEF}/g,'')
                let styleValue = styles.informationValueNegative;
                let valueSymbol = null;
                if(key[1] > -1) {
                    styleValue = styles.informationValuePositive; valueSymbol = '+';
                }

                return(
                    <View key={index} style={styles.informationContent}>
                        <Text style={styles.informationTitle}>
                            {(score.indexOf('%')!=-1) ? score.split('%')[1] : score} 
                        </Text>
                        <Text style={[styles.informationValue, styleValue]}>
                            {key[1] > 0 && valueSymbol}
                            {(key[1] < 1 && key[1] > 0) ? key[1].toFixed(2) : key[1]}
                        </Text>
                    </View>
                )
            })}
         </ViewLightDark>
        )
    }

    const TransactionsSelectDropDown = () => {
        const data = ['Trocas', 'Free Agency', 'Waiver', 'Todas']
        return (
            <SelectDropdown
                data={data}
                defaultButtonText={dropdownTransactionsOption}
                onSelect={(selectedItem, index) => {
                    setDropdownTransactionsOption(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
                renderDropdownIcon={isOpened => {
                    return <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} color={LIGHT_GRAY} size={18} />;
                }}
                buttonStyle={{backgroundColor:LIGHT_BLACK,width:130,borderRadius:5,height:40}}
                buttonTextStyle={{color:LIGHT_GRAY,fontSize:15}}
                dropdownStyle={{backgroundColor:LIGHT_BLACK,borderRadius:5}}
                rowTextStyle={{color:LIGHT_GRAY,}}
                rowStyle={{borderBottomColor:'transparent'}}
            />
        )
    }

    const TransactionTrade = (props) => {
        const tran = props.transaction;
        const user1 = (tran?.roster_ids[0]) ? new UserTransaction(tran.roster_ids[0]) : new UserTransactionNull();
        const user2 = (tran?.roster_ids[1]) ? new UserTransaction(tran.roster_ids[1]) : new UserTransactionNull();


        const TradeInfo = ({userRoster, userData}) => {
            const adds = tran.adds;
            const picks = tran.draft_picks;
            const waiver = tran.waiver_budget;
            return (
            <View style={{flex:2,alignItems:'center'}}>
                <TouchableOpacity onPress={() => 
                    navigation.navigate('PlayerProfile',{
                    playerObject: userData,
                    leagueID: leagueID,
                    roster: league.roster_positions
                })}>
                    <ProgressiveImage style={{width:50,height:50,borderRadius:50}} uri={`https://sleepercdn.com/avatars/${userData.avatar}`} resizeMode='cover'/>
                </TouchableOpacity>
                <Text style={{color:DARK_GRAY}}>recebe:</Text>
                <View style={{width:'100%',alignItems:'center'}}>
                    { adds &&
                        Object.entries(adds).map((item, index) => {
                            if(item[1]!=userRoster?.roster_id) return

                            return (
                                <TouchableOpacity 
                                    key={index}
                                    style={{marginTop:5}}
                                    onPress={() => 
                                        navigation.navigate('PlayerStats', {playerObject: allPlayers[item[0]]})
                                }
                                >
                                <Text style={{color:WHITE,textAlign:'center'}}>{`${allPlayers[item[0]].first_name} ${allPlayers[item[0]].last_name}`}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                    {
                        picks &&
                        picks.map((pick, index) => {
                            if(pick.owner_id!=userRoster?.roster_id) return

                            return (
                                <Text key={index} style={{color:WHITE,marginTop:5}}>{`Pick round ${pick.round} de ${pick.season}`}</Text>
                            )
                        })
                    }
                                        {
                        waiver &&
                        waiver.map((item, index) => {
                            if(item.receiver!=userRoster?.roster_id) return

                            return (
                                <Text key={index} style={{color:WHITE,marginTop:5}}>{`${item.amount}$ waiver cash`}</Text>
                            )
                        })
                    }
                </View>
            </View>
        )}

        return (
            <ViewLightDark title={`Status: ${tran.status}`} titleSize={15} titleAlign='center' style={{marginTop:10,flexDirection:'row'}}>
                <TradeInfo userRoster={user1.roster} userData={user1.user_data} />
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <FontAwesome name="exchange" size={24} color={LIGHT_GREEN} />
                </View>
                <TradeInfo userRoster={user2.roster} userData={user2.user_data} />
            </ViewLightDark>
        )
    }

    const TransactionFreeAgent = (props) => {
        const tran = props.transaction;
        const drops = tran.drops;
        const adds = tran.adds;
        const user = (tran?.roster_ids[0]) ? new UserTransaction(tran.roster_ids[0]) : new UserTransactionNull();

        return (
            <View style={{backgroundColor:LIGHT_BLACK,borderRadius:12,margin:10,marginBottom:20,elevation:10,padding: 10}}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => 
                        navigation.navigate('PlayerProfile',{
                        playerObject: user.user_data,
                        leagueID: leagueID,
                        roster: league.roster_positions
                    })}>
                        <ProgressiveImage style={{width:50,height:50,borderRadius:50}} uri={`https://sleepercdn.com/avatars/${user.user_data.avatar}`} resizeMode='cover'/>
                        <Text style={{color:DARK_GRAY,marginLeft:10,flexWrap:'wrap',flexShrink:1}}><Text style={{color:WHITE,}}>{user.user_data.display_name}</Text> dispensou/contratou os seguintes jogadores:</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1,flexDirection:'row',padding:10}}>
                    <View style={{flex:1,justifyContent:'center',marginLeft:10}}>
                    {   drops && 
                        Object.entries(drops).map((item, index) => {
                            if(item[1] != user.roster.roster_id) return
                            
                            return (
                                <TouchableOpacity key={index} 
                                onPress={() => 
                                    navigation.navigate('PlayerStats', {playerObject: allPlayers[item[0]]})} 
                                style={{flexDirection:'row'}}>
                                    <ProgressiveImage style={{width:50,height:50,borderRadius:50,backgroundColor:DARK_BLACK,borderWidth:1,borderColor:'red'}} uri={`https://sleepercdn.com/content/nfl/players/${allPlayers[item[0]].player_id}.jpg`} resizeMode='cover'/>
                                    <FontAwesome name="minus-circle" size={17} color='red' style={{marginLeft:-10}} />
                                </TouchableOpacity>
                            )
                        })
                    }
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                    {   adds && 
                        Object.entries(adds).map((item, index) => {
                            if(item[1] != user.roster.roster_id) return
                            
                            return (
                                <TouchableOpacity key={index} 
                                onPress={() => 
                                    navigation.navigate('PlayerStats', {playerObject: allPlayers[item[0]]})} 
                                style={{flexDirection:'row'}}>
                                    <ProgressiveImage style={{width:50,height:50,borderRadius:50,backgroundColor:DARK_BLACK,borderWidth:1,borderColor:LIGHT_GREEN}} uri={`https://sleepercdn.com/content/nfl/players/${allPlayers[item[0]].player_id}.jpg`} resizeMode='cover'/>
                                    <FontAwesome name="plus-circle" size={17} color={LIGHT_GREEN} style={{marginLeft:-10}} />
                                </TouchableOpacity>
                            )
                        })
                    }
                    </View>
                </View>
            </View>
        )
    }

    const TransactionWaiver = (props) => {
        const tran = props.transaction;
        const drops = tran.drops;
        const adds = tran.adds;
        const user = (tran?.roster_ids[0]) ? new UserTransaction(tran.roster_ids[0]) : new UserTransactionNull();

        return (
            <View style={{backgroundColor:LIGHT_BLACK,borderRadius:12,margin:10,marginBottom:20,elevation:10,padding: 10}}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => 
                        navigation.navigate('PlayerProfile',{
                        playerObject: user.user_data,
                        leagueID: leagueID,
                        roster: league.roster_positions
                    })}>
                        <ProgressiveImage style={{width:50,height:50,borderRadius:50}} uri={`https://sleepercdn.com/avatars/${user.user_data.avatar}`} resizeMode='cover'/>
                        <Text style={{color:DARK_GRAY,marginLeft:10,flexWrap:'wrap',flexShrink:1}}><Text style={{color:WHITE,}}>{user.user_data.display_name}</Text> {tran.metadata.notes}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1,flexDirection:'row',padding:10}}>
                    <View style={{flex:1,justifyContent:'center',marginLeft:10}}>
                    {   drops && 
                        Object.entries(drops).map((item, index) => {
                            if(item[1] != user.roster.roster_id) return
                            
                            return (
                                <TouchableOpacity key={index} 
                                onPress={() => 
                                    navigation.navigate('PlayerStats', {playerObject: allPlayers[item[0]]})} 
                                style={{flexDirection:'row'}}>
                                    <ProgressiveImage style={{width:50,height:50,borderRadius:50,backgroundColor:DARK_BLACK,borderWidth:1,borderColor:'red'}} uri={`https://sleepercdn.com/content/nfl/players/${allPlayers[item[0]].player_id}.jpg`} resizeMode='cover'/>
                                    <FontAwesome name="minus-circle" size={17} color='red' style={{marginLeft:-10}} />
                                </TouchableOpacity>
                            )
                        })
                    }
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                    {   adds && 
                        Object.entries(adds).map((item, index) => {
                            if(item[1] != user.roster.roster_id) return
                            
                            return (
                                <TouchableOpacity key={index} 
                                onPress={() => 
                                    navigation.navigate('PlayerStats', {playerObject: allPlayers[item[0]]})} 
                                style={{flexDirection:'row'}}>
                                    <ProgressiveImage style={{width:50,height:50,borderRadius:50,backgroundColor:DARK_BLACK,borderWidth:1,borderColor:LIGHT_GREEN}} uri={`https://sleepercdn.com/content/nfl/players/${allPlayers[item[0]].player_id}.jpg`} resizeMode='cover'/>
                                    <FontAwesome name="plus-circle" size={17} color={LIGHT_GREEN} style={{marginLeft:-10}} />
                                </TouchableOpacity>
                            )
                        })
                    }
                    </View>
                </View>
            </View>
        )
    }

    const TransactionsItem = ({item, index}) => {
        if(index > showItems) {
            setIsMoreLoading(false);
            return
        }

        return (
            <View>
                {item.type == 'trade' && <TransactionTrade transaction={item} />}
                {item.type == 'free_agent' && <TransactionFreeAgent transaction={item} />}
                {item.type == 'waiver' && <TransactionWaiver transaction={item} />}
            </View>
        )
    }

    const TransactionsTab = () => {
        return (
            <View style={{marginTop:20, width}}>
                <View style={{marginHorizontal:10,flexDirection:'row', justifyContent:'space-between',alignItems:'flex-end'}}>
                    {leagueTransactions && <>
                    <Text style={{color:DARK_GRAY}}>{ dropdownTransactionsOption!='Todas' ? `${leagueTransactions?.filter(transaction => {
                        return transaction.type.replace(/trade/g,'Trocas').replace(/waiver/g,'Waiver').replace(/free_agent/g,'Free Agency') == dropdownTransactionsOption
                    }).length} transações` : `${leagueTransactions?.length} transações totais`}</Text>
                    <TransactionsSelectDropDown />
                    </>}
                </View>
                {leagueTransactions && 
                <FlatList
                    data={(dropdownTransactionsOption!='Todas')?
                    leagueTransactions.filter((item, index) => {
                        return item.type.replace(/trade/g,'Trocas').replace(/waiver/g,'Waiver').replace(/free_agent/g,'Free Agency') == dropdownTransactionsOption
                    })
                    : leagueTransactions
                    }
                    keyExtractor={item => item.transaction_id}
                    contentContainerStyle={{marginTop:10,paddingBottom:50}}
                    renderItem={TransactionsItem}
                    nestedScrollEnabled={false}
                    ListFooterComponent={<Footer />}

                />}
            </View>
        )
    }

    const GeneralInformations = () => {
        return (
            <View style={{marginTop:20, width}}>
            <ViewLightDark title='Configurações da liga' titleSize={18}>
                {generalInformations.map((element, index) => {
                    if(element.season!=season) return

                    return (
                        <View key={index}>
                            <InformationContainer name='Status' value={element.status.replace(/_/g,' ')} />
                            <InformationContainer name='Temporada' value={element.season_type} />
                            <InformationContainer name='Tipo' value={element.metadata.scoring_type.replace(/_/g,' ')} />
                            <InformationContainer name='Times' value={element.settings.teams} />
                            <InformationContainer name='Draft rounds' value={element.settings.rounds} />
                            <InformationContainer name='Autopick' value={(element.settings.cpu_autopick == 1) ? 'Ligado' : 'Desligado'}
                                    />
                        </View>
                    )
                })}
            </ViewLightDark>    
            <ScoringContainer type='ATK' title='Ataque' />
            <ScoringContainer type='DEF' title='Defesa' />
            <ScoringContainer type='ST' title='Special Team' />
            </View>
        )
    }

    return ( 
        <HeaderLeagueContextProvider leagueObject={league}>
            <TabTopLeague isAble={true} leagueDraftSettings={leagueDraftSettings} activeButton={route.params?.active} leagueObject={league} leagueRosters={leagueRosters} leagueUsers={leagueUsers} />
            <AnimatedTab scrollX={scrollX} data={dataTab} onTabPress={onTabPress} />
            <Animated.FlatList
                ref={flatlistRef}
                data={dataTab}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    {useNativeDriver: false}
                )}
                keyExtractor={item => item.key}
                renderItem={({item}) => {
                    if(item.key==0) {
                        return (
                            <GeneralInformations />
                        )
                    } else {
                        if(!leagueTransactions) {
                            return (
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <ActivityIndicator size='large' color={LIGHT_GREEN} />
                                </View>
                            )
                        }
                        return (
                            <TransactionsTab />
                        )
                    }
                }}
            />
        </HeaderLeagueContextProvider>
    );
}
 
export default Informations;

const styles = StyleSheet.create({
    informationContainer:{
        marginBottom:20,
    },
    informationContent:{
        flexDirection:'row',
        marginTop:10,
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
    title:{
        fontSize:17,
        fontWeight:'bold',
        color:'#C6C6C6',
        flex:1
    },
    informationValuePositive: {
        color: LIGHT_GREEN
    },
    informationValueNegative: {
        color:'red'
    },
    informationConfig: {
        flex:2,
    },
    activeTab: {
        paddingVertical:5, 
        width:130,
        alignItems:'center',
        backgroundColor:LIGHT_GREEN,
    },
    inactiveTab: {
        paddingVertical:5,
        width:130,
        alignItems:'center',
        backgroundColor:LIGHT_BLACK
    },
    tabLeft: {
        borderTopLeftRadius:5,
        borderBottomLeftRadius:5,
        flexDirection:'row',
        justifyContent:'center'
    },
    tabRight: {
        borderTopRightRadius:5,
        borderBottomRightRadius:5,
        flexDirection:'row',
        justifyContent:'center'
    }
})