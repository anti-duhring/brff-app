import { View, Text, ActivityIndicator, Image, StyleSheet, TouchableOpacity, FlatList, Pressable, Animated, ImageBackground, TextInput, Keyboard, ScrollView } from "react-native";
import { useState, useEffect, useContext, useRef } from "react";
import * as rssParser from 'react-native-rss-parser'
import { LinearGradient } from 'expo-linear-gradient';
import TrackPlayer from "react-native-track-player";
import { scaleAnimation } from '../../../animations/scale'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

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
                    episodeObject: episode,
                    episodeID: index
                    }
                })
              )

            setPlaylistPodcast(data.items)
            setDATA(
                data.items.map((episode, index) => {
                  return {
                    key: episode.id,
                    episodeObject: episode,
                    episodeID: index
                  }
                })
              )
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

    const setPlaylistPodcast = async(episodesData) => {
        let playlist = []
        episodesData.map((episode, index) => { 
            playlist.push({
                url: 'https://'+episode.enclosures[0].url.split('https%3A%2F%2F')[1].replace(/%2F/g,'/'),
                title: episode.title,
                artist: episode.authors[0].name,
                artwork: 'https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png',
                duration: (Number(episode.enclosures[0].length) / 1000).toFixed(0)
            })
        })

        await TrackPlayer.add(playlist);
        console.log(playlist.length,'episodes tracked')
        setIsLoading(false)
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

            {!errorMessage && isLoading ?
                            <View>
                                <View style={{padding:10, marginBottom:10,}}>
                    <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
                        <View style={{marginBottom:10}}>
                            <View style={{height:100, width: 340, borderRadius: 4}} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <View style={{ marginRight: 20 }}>
                                <View style={{ width: 270, height: 20, borderRadius: 4 }} />
                                <View style={{ marginTop: 6, width: 130, height: 20, borderRadius: 4 }} />  
                            </View>
                            <View style={{ marginLeft:0,width: 36, height: 36, borderRadius: 50 }} />    
                        </View>
                    </SkeletonPlaceholder>
                </View>
                                <View style={{padding:10, marginBottom:10}}>
                    <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
                    <View style={{marginBottom:10}}>
                    <View style={{height:100, width: 340, borderRadius: 4}} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <View style={{ marginRight: 20 }}>
                        <View style={{ width: 270, height: 20, borderRadius: 4 }} />
                        <View style={{ marginTop: 6, width: 130, height: 20, borderRadius: 4 }} />  
                    </View>
                    <View style={{ marginLeft:0,width: 36, height: 36, borderRadius: 50 }} />    
                </View>
            </SkeletonPlaceholder>
        </View>
        <View style={{padding:10, marginBottom:10}}>
            <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
                <View style={{marginBottom:10}}>
                    <View style={{height:100, width: 340, borderRadius: 4}} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <View style={{ marginRight: 20 }}>
                        <View style={{ width: 270, height: 20, borderRadius: 4 }} />
                        <View style={{ marginTop: 6, width: 130, height: 20, borderRadius: 4 }} />  
                    </View>
                    <View style={{ marginLeft:0,width: 36, height: 36, borderRadius: 50 }} />    
                </View>
            </SkeletonPlaceholder>
        </View>
        </View>
            : 
            <Animated.FlatList
            data={episodes}
            keyExtractor={item => item.key}
            contentContainerStyle={{
              padding:10,
              paddingBottom:80
            }}
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            ListFooterComponent={<Footer />}
            //getItemLayout={(data, index) => ({length: 175, offset: 175 * index, index})}
            onEndReachedThreshold={0.5}
            onEndReached={
                () => setShowItems(showItems + 10)
            }

            renderItem={({item, index}) => {
                if(index > showItems) return

              return <Animated.View
                style={{ 
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
                <ImageBackground imageStyle={{borderRadius:12,resizeMode:'center'}} style={styles.imageBackground} source={{uri: item.episodeObject.itunes.image}}>
                    <LinearGradient locations={[0, 0.8]} colors={['transparent', 'rgba(0, 128, 55, .6)']} style={styles.episodeContainer}>
                            <View style={{height:'100%',flexDirection:'row',paddingBottom:5}}>
                                <View style={{flex:7, justifyContent:'flex-end'}}>
                                    <Text style={{fontSize:17,fontWeight:'700',color:'white'}}>{
                                        (item.episodeObject.title.indexOf('-')!=-1) ? item.episodeObject.title.split('- ')[1] : 
                                        item.episodeObject.title
                                    }</Text>
                                    <Text style={{fontSize:12,color:'rgba(255,255,255,0.6)',}}>{weekDay(item.episodeObject.published)}</Text>
                                    <Text  style={{fontSize:12,color:'rgba(255,255,255,0.6)',}}>{secondsToHms(item.episodeObject.itunes.duration)}</Text>
                                </View>
                                <View style={{flex:1, justifyContent:'flex-end',padding:10}}>
                                    <AntDesign name="play" size={36} color="white" />
                                </View>
                            </View>
                    </LinearGradient>
                </ImageBackground>
                </Pressable>
              </Animated.View>
              
            }}
          />}
          </Pressable>
        </View>
     );
}
 
export default EpisodeList;

const styles = StyleSheet.create({
    imageBackground: {
        height:170,
        backgroundColor: 'black',
        borderRadius:12,
    },
    episodeContainer:{
        padding:10,
        height:'100%',
        borderRadius:12,
    }
})