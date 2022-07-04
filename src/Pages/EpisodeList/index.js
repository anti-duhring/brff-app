import { View, Text, ActivityIndicator, Image, StyleSheet, TouchableOpacity, FlatList, Pressable, Animated, ImageBackground, TextInput, Keyboard, ScrollView } from "react-native";
import { useState, useEffect, useContext, useRef } from "react";
import * as rssParser from 'react-native-rss-parser'
import { LinearGradient } from 'expo-linear-gradient';
import TrackPlayer from "react-native-track-player";
import { scaleAnimation } from "../../animations/scale";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { BORDER_RADIUS } from "../../components/Variables";

const EpisodeList = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingPagination, setIsLoadingPagination] = useState(false)
    const [pageCurrent, setPageCurrent] = useState(1)
    const [errorMessage, setErrorMessage] = useState(null)

    const [searchText, setSearchText] = useState('')
    const [episodes,setEpisodes] = useState([])
    const [DATA, setDATA] = useState([])
    const [showItems, setShowItems] = useState(10)

    const animateX = useRef(new Animated.Value(1)).current;
    const [itemAnimate, setItemAnimate] = useState(null);

    const getPodcasts = async() => {
        const RSS_URL = `https://anchor.fm/s/dea812c/podcast/rss`;
        try {
            const response = await fetch(RSS_URL)
            const responseData = await response.text()
            const data = await rssParser.parse(responseData)
            setEpisodes(                
                data.items.map((episode, index) => {
                    return {
                    key: episode.id,
                    episodeObject: {
                        url: 'https://'+episode.enclosures[0].url.split('https%3A%2F%2F')[1].replace(/%2F/g,'/'),
                        title: episode.title,
                        artist: episode.authors[0].name,
                        artwork: episode.itunes.image,
                        duration: episode.itunes.duration, //(Number(episode.enclosures[0].length) / 1000).toFixed(0),
                        description: episode.description,
                        date: episode.published
                    },
                    episodeID: index
                    }
                })
              )

            //setPlaylistPodcast(data.items)
            setDATA(
                data.items.map((episode, index) => {
                  return {
                    key: episode.id,
                    episodeObject: {
                        url: 'https://'+episode.enclosures[0].url.split('https%3A%2F%2F')[1].replace(/%2F/g,'/'),
                        title: episode.title,
                        artist: episode.authors[0].name,
                        artwork: episode.itunes.image,
                        duration: episode.itunes.duration, //(Number(episode.enclosures[0].length) / 1000).toFixed(0),
                        description: episode.description,
                        date: episode.published
                    },
                    episodeID: index
                  }
                })
              )
              setIsLoading(false)
        } catch(e) {
            console.log('Erro:',e)
        } 
    }

    const weekDay = (date) => {
        const day = date.split(',')[0]
        const datecalendar = date.split(',')[1]
        const daycalendar = datecalendar.split(' ')[1];
        const monthcalendar = datecalendar.split(' ')[2];
        const yearcalendar = datecalendar.split(' ')[3];
        let dayPT;
        switch(day) {
            case 'Mon':
                dayPT = 'Segunda-feira';
                break;
            case 'Tue':
                dayPT = 'Terça-feira';
                break;
            case 'Wed':
                dayPT = 'Quarta-feira';
                break;
            case 'Thu':
                dayPT = 'Quinta-feira';
                break;
            case 'Fri':
                dayPT = 'Sexta-feira'
                break;
            case 'Sat':
                dayPT = 'Sábado'
                break;
            case 'Sun':
                dayPT = 'Domingo'
                break;
            default:
                dayPT = '';
        }
        return `${dayPT} - ${daycalendar} ${monthcalendar} ${yearcalendar}`
    }

    const secondsToHms = (d) => {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? "hr " : "hrs ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? "min" : "mins") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
        return hDisplay + mDisplay; 
    } 

    useEffect(() => {
        getPodcasts();
    },[])

    useEffect(() => {
        if(searchText=='') {
            setEpisodes(DATA)
        } else {
            setEpisodes(
                DATA.filter(item => {
                    if(item.episodeObject.title.toLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1) {
                        return true
                    } else {
                        return false
                    }
                })
            )
        }
    },[searchText])

    const Footer = () => (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size='large' color='rgba(0, 128, 55, 1)' />
        </View>
    )

    const EpisodePlaceholder = () => {
        return (
            <View style={{marginHorizontal:10,marginBottom:30,}}>
                <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
                    <View style={{height:85, width:'100%', borderTopLeftRadius:BORDER_RADIUS,borderTopRightRadius:BORDER_RADIUS}} />
                    <View style={{marginTop:10,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <View style={{width:200,height:20}} />
                        <View style={{width:36,height:36,borderRadius:36,marginRight:30}} />
                        
                    </View>
                    <View style={{width:100,height:20,marginTop:-5,}} />
                </SkeletonPlaceholder>
            </View>
        )
    }

    const Episode = ({item,index}) => {
        if(index > showItems) return
        if(!item) return null
        return (
            <Animated.View
                style={{ 
                marginHorizontal:10,
                marginBottom:10,
                borderRadius:12,
                marginBottom:10,
                borderWidth:1,
                borderColor: 'rgba(255,255,255,0)',
                transform:[{scale: (itemAnimate == item.key) ? animateX : 1}]
                }}
              >
              <Pressable onPressIn={() => setItemAnimate(item.key)} onPress={() =>{ 
              scaleAnimation(animateX,() => {
                navigation.navigate('Episode',{
                    episodeObject: item.episodeObject,
                    episodeName: item.episodeObject.title,
                    episodeID: item.episodeID,
                    trackLength: DATA.length
                })
              })}}>
                <ImageBackground imageStyle={{borderRadius:12,resizeMode:'center'}} style={styles.imageBackground} source={{uri: item.episodeObject.artwork}}>
                    <LinearGradient locations={[0, 0.8]} colors={['transparent', 'rgba(0, 128, 55, .6)']} style={styles.episodeContainer}>
                            <View style={{height:'100%',flexDirection:'row',paddingBottom:5}}>
                                <View style={{flex:7, justifyContent:'flex-end'}}>
                                    <Text style={{fontSize:17,fontWeight:'700',color:'white'}}>{
                                        item.episodeObject.title.replace(/[0-9]x[0-9][0-9] /g,'').replace('- ','')
                                    }</Text>
                                    <Text style={{fontSize:12,color:'rgba(255,255,255,0.6)',}}>{weekDay(item.episodeObject.date)}</Text>
                                    <Text  style={{fontSize:12,color:'rgba(255,255,255,0.6)',}}>{secondsToHms(item.episodeObject.duration)}</Text>
                                </View>
                                <View style={{flex:1, justifyContent:'flex-end',padding:10}}>
                                    <AntDesign name="play" size={36} color="white" />
                                </View>
                            </View>
                    </LinearGradient>
                </ImageBackground>
                </Pressable>
              </Animated.View>
        )
    }

    return ( 
        <View style={{flex:1,backgroundColor:'#0B0D0F'}}>
            <Pressable onPress={Keyboard.dismiss}>
            {errorMessage && <Text>{errorMessage}</Text>}
            <View style={{alignItems:'center', padding:10}}>
                <View style={{ padding:5, borderRadius: 5, backgroundColor: '#15191C', width:200, flexDirection:'row', alignItems:'center'}}>
                    <FontAwesome name="search" style={{paddingLeft:5,paddingRight:10}} size={17} color="#C1C1C1" />
                    <TextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        style={{width:150, color:'#FCFCFC'}}
                        placeholder='Pesquisar...'
                        placeholderTextColor={'#C1C1C1'}
                    />
                </View>
                <View>

                </View>
            </View>
            { isLoading ?
            new Array(5).fill(0).map((item, index) => {
                return <EpisodePlaceholder key={index} />
            }) :
            <Animated.FlatList
                data={episodes}
                keyExtractor={item => item.key}
                contentContainerStyle={{
                paddingBottom:80
                }}
                removeClippedSubviews={false}
                ListFooterComponent={<Footer />}
                //getItemLayout={(data, index) => ({length: 175, offset: 175 * index, index})}
                onEndReachedThreshold={0.5}
                onEndReached={
                    () => setShowItems(showItems + 10)
                }
                renderItem={Episode}
            />
            }
          </Pressable>
        </View>
     );
}
 
export default EpisodeList;

const styles = StyleSheet.create({
    imageBackground: {
        height:170,
        backgroundColor: 'black',
        borderRadius:BORDER_RADIUS,
    },
    episodeContainer:{
        padding:10,
        height:'100%',
        borderRadius:BORDER_RADIUS,
    }
})