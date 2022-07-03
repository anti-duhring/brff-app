import { View, Text, StyleSheet, Dimensions, Animated, ImageBackground } from "react-native";
import { useRef } from "react";
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view'
import MusicPlayer from "../../components/MusicPlayer";
import { LinearGradient } from 'expo-linear-gradient';
import ViewLightDark from "../../components/ViewLightDark";
import { DARK_BLACK } from "../../components/Variables";

const MAX_HEIGHT = 200;
const MIN_HEIGHT = 55;
const WIDTH = Dimensions.get('window').width;

const Episode = ({navigation, route}) => {
    const episode = route.params?.episodeObject
    const episodeName = route.params?.episodeName
    const episodeID = route.params?.episodeID
    const episodeDescription = episode.description.replace(/<p>/g,'').replace(/<br>/g,``).replace(/<\/p>/g,'').replace(/--/g,``)
    const trackLength = route.params?.trackLength
    let episodeImage = (episode.itunes.image == 'https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo400/2234723/2234723-1645583930433-8a8b649a48b9d.jpg') ? require('../../../assets/Images/leagueHeader2.png') : {uri: episode.itunes.image};

    const opacity = useRef(new Animated.Value(0)).current;
    const firstRender = useRef(true);

    const fadeIn = () => {
        if(firstRender.current) {
            firstRender.current = false;
            return
        }
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
            useNativeDriver={true}
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
                                artwork: episode.itunes.image,
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
                    <LinearGradient locations={[0.3, 0.99]} colors={['transparent', DARK_BLACK ]} style={styles.episodeContainer}>

                    </LinearGradient>
                 </ImageBackground>
                //<Image source={{uri:episode.itunes.image}} style={styles.imageHeader} />
            )}
        >
        
            <TriggeringView onDisplay={() => fadeOut()} onBeginHidden={() => {fadeIn()}}>
                <View style={styles.titleContainer}>
                    <LinearGradient locations={[0,1]} style={styles.episodeGradient} colors={['transparent', DARK_BLACK]}>
                        <Text style={styles.imageTitle}>
                        {(episode.title.indexOf('-')!=-1) ? episode.title.split('- ')[1] : episode.title}
                        </Text>
                    </LinearGradient>
                    <View style={[styles.section, styles.sectionLarge]}>
                        <ViewLightDark containerStyle={{margin:0}}>
                            <Text style={styles.sectionText}>{episodeDescription.replace(/(<([^>]+)>)/ig,'').replace(/&nbsp;/ig,'')}</Text>
                        </ViewLightDark>
                        <View>
                            <Text style={styles.sectionInfo}>Publicado em: {episode.published}</Text>
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
        backgroundColor:DARK_BLACK
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
        backgroundColor:DARK_BLACK,
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
        paddingHorizontal:50,
    },
    sectionLarge: {
        minHeight: 700,
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
        marginTop: 80,
    },
})