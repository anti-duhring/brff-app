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
import {FlashList} from '@shopify/flash-list'
import { objectToArray, replaceObjectKey, UserTransaction, UserTransactionNull } from "../../utils/leagueInformations";
import TransactionTrade from "../../components/Transactions/TransactionTrade";
import TransactionFreeAgent from "../../components/Transactions/TransactionFreeAgent";

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
    const {season, week, NFLStatus} = useContext(NFLStatusContext);
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
        const URL = `https://api.sleeper.app/v1/league/${leagueID}/transactions/${(NFLStatus.season_type == 'regular') ? week : 1}`;
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            console.log(leagueID, week)
            setLeagueTransactions(data)
        }).catch(err => {
            console.log('Error:',err)
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

    const TransactionsItem = ({item, index}) => {
       /* if(index > showItems) {
            setIsMoreLoading(false);
            return
        }*/

        return (
            <View>
                {item.type == 'trade' && 
                    <TransactionTrade 
                        navigation={navigation} 
                        transaction={item} 
                        leagueRosters={leagueRosters}
                        leagueUsers={leagueUsers}
                    />
                }
                {item.type == 'free_agent' && 
                    <TransactionFreeAgent 
                        transaction={item} 
                        navigation={navigation} 
                        leagueRosters={leagueRosters}
                        leagueUsers={leagueUsers}
                    />
                }
                {item.type == 'waiver' && 
                    <TransactionWaiver 
                        transaction={item} 
                        navigation={navigation} 
                        leagueRosters={leagueRosters}
                        leagueUsers={leagueUsers}
                    />
                }
            </View>
        )
    }

    const TransactionsTab = () => {
        return (
            <View style={{marginTop:20, width}}>
                <View style={{marginHorizontal:10,flexDirection:'row', justifyContent:'space-between',alignItems:'flex-end'}}>
                    {leagueTransactions && <>
                    <Text style={{color:DARK_GRAY}}>
                        { dropdownTransactionsOption!='Todas' ? 
                        `${leagueTransactions?.filter(transaction => {
                        return transaction.type.replace(/trade/g,'Trocas').replace(/waiver/g,'Waiver').replace(/free_agent/g,'Free Agency') == dropdownTransactionsOption
                        }).length} transações` : 
                    `${leagueTransactions?.length} transações totais`}</Text>
                    <TransactionsSelectDropDown />
                    </>}
                </View>
                {leagueTransactions && 
                <FlashList
                    data={(dropdownTransactionsOption!='Todas')?
                    leagueTransactions.filter((item, index) => {
                        return item.type.replace(/trade/g,'Trocas').replace(/waiver/g,'Waiver').replace(/free_agent/g,'Free Agency') == dropdownTransactionsOption
                    })
                    : leagueTransactions
                    }
                    keyExtractor={item => item.transaction_id}
                    renderItem={TransactionsItem}
                    nestedScrollEnabled={false}
                    //ListFooterComponent={<Footer />}
                    estimatedItemSize={60}
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
            <View style={styles.body}>
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
            </View>
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
    },
    body: {
        backgroundColor:DARK_BLACK,
        paddingTop:20,
        minHeight: 600,
      }
})