import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Animated, ImageBackground, StatusBar } from "react-native";
import { useRef, useState, useEffect } from "react";
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view'
import MusicPlayer from "../../components/MusicPlayer";
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from "@react-navigation/native";

const MAX_HEIGHT = 200;
const MIN_HEIGHT = 55;
const WIDTH = Dimensions.get('window').width;

const Episode = ({navigation, route}) => {
    const episode = route.params?.episodeObject
    const episodeName = route.params?.episodeName
    const episodeID = route.params?.episodeID
    const episodeDescription = episode.description.replace(/<p>/g,'').replace(/<br>/g,``).replace(/<\/p>/g,'').replace(/--/g,``)
    const trackLength = route.params?.trackLength
    let episodeImage = {uri: episode.itunes.image};

    if(episode.itunes.image == 'https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo400/2234723/2234723-1645583930433-8a8b649a48b9d.jpg') episodeImage = require('../../../assets/Images/leagueHeader2.png')

    const opacity = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        Animated.timing(opacity,{
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const fadeOut = () => {
        Animated.timing(opacity,{
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start()
    }


    return ( 
        <View style={styles.episodeBody}>
        <HeaderImageScrollView
            maxHeight={MAX_HEIGHT}
            minHeight={MIN_HEIGHT}
            maxOverlayOpacity={0.7}
            minOverlayOpacity={0}
            fadeOutForeground={true}
            contentContainerStyle={{backgroundColor:'transparent',top:-30}}
            scrollViewBackgroundColor={'transparent'}
            renderForeground={() => (
                    <View style={styles.foregroundContainer}>
                        <MusicPlayer isThePlayerInEpisodePage={true} trackIndex={episodeID} track={{
                                url: 'https://'+episode.enclosures[0].url.split('https%3A%2F%2F')[1].replace(/%2F/g,'/'),
                                title: episodeName,
                                artist: episode.authors[0].name,
                                artwork: 'https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png',
                                duration: (Number(episode.enclosures[0].length) / 1000).toFixed(0)
                            }} />

                    </View>
              )}
            renderFixedForeground={() => (<Animated.View
                    style={[styles.navTitleView,{opacity}]}
                >
                  <Text style={styles.navTitle}>
                  {(episode.title.indexOf('-')!=-1) ? episode.title.split('- ')[1] : episode.title}
                  </Text>
                </Animated.View>
              )}
            renderHeader={() => (
                <ImageBackground blurRadius={0} imageStyle={{resizeMode:'cover'}} style={styles.imageHeader} source={episodeImage}>
                    <LinearGradient locations={[0.3, 0.99]} colors={['transparent', 'black' ]} style={styles.episodeContainer}>

                    </LinearGradient>
                 </ImageBackground>
                //<Image source={{uri:episode.itunes.image}} style={styles.imageHeader} />
            )}
        >
        
            <TriggeringView onDisplay={() => fadeOut()} onBeginHidden={() => {fadeIn()}}>
                <View style={styles.titleContainer}>
                    <LinearGradient locations={[0,1]} style={styles.episodeGradient} colors={['transparent', 'black']}>
                        <Text style={styles.imageTitle}>
                        {(episode.title.indexOf('-')!=-1) ? episode.title.split('- ')[1] : episode.title}
                        </Text>
                    </LinearGradient>
                    <View style={[styles.section, styles.sectionLarge]}>
                        <View>
                            <Text style={styles.sectionText}>{episodeDescription}</Text>
                        </View>
                        <View>
                            <Text style={styles.sectionInfo}>Publicado em: {episode.published}</Text>
                        <Text style={styles.sectionInfo}>{episode.id}</Text>
                        </View>
                    </View>
                    </View>
            </TriggeringView>
            </HeaderImageScrollView>

        </View>
     );
}
 
export default Episode;

const styles = StyleSheet.create({
    episodeBody: {
        flex:1,
        backgroundColor:'black'
    },  
    imageHeader: {
        height: MAX_HEIGHT,
        width: WIDTH,
        //resizeMode:'cover',
    },
    episodeContainer:{
        height:'100%',
        justifyContent:'flex-end',
    },
    title: {
        fontSize: 20,
    },
    section: {
        padding: 10,
        backgroundColor:'black',
        paddingHorizontal: 20,
    },
    navTitle: {
        color: 'white',
        fontSize: 18,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10,
    },
    navTitleView: {
        height: MIN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0,
        opacity: 0,
        paddingHorizontal:30,
    },
    sectionLarge: {
        height: 600,
    },
    imageTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10,
        padding:10,
        paddingTop:0,
        paddingHorizontal:20,
    },

    sectionInfo: {
        color:'#3A3A3A',
        fontStyle: 'italic'
    },
    sectionText: {
        color:'rgba(255, 255, 255, 0.7)'
    },
    foregroundContainer: {
        marginTop: 70,
    },
})