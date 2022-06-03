import { Animated, Easing } from 'react-native'

export const scaleAnimation = (value, callback) => {
    Animated.sequence([
        Animated.timing(value, {
            duration: 50,
            toValue: 1.1,//4,
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