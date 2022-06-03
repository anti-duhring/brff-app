import { Animated, Easing } from 'react-native'

export const fadeIn = (value, callback) => {
    Animated.sequence([
        Animated.timing(value, {
            duration: 50,
            toValue: 0,//4,
            ease: Easing.bounce,
            useNativeDriver: true
        })/*,
        Animated.timing(value, {
            duration: 50,
            toValue: 0.9,//-4,
            ease: Easing.bounce,
            useNativeDriver: true
        })*/,
        Animated.timing(value, {
            duration: 50,
            toValue: 1,//0,
            ease: Easing.bounce,
            useNativeDriver: true
        })
    ]).start(callback)
}