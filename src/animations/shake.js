import { Animated, Easing } from 'react-native'

export const shakeAnimation = (value, callback) => {
    Animated.sequence([
        Animated.timing(value, {
            duration: 50,
            toValue: 4,
            ease: Easing.bounce,
            useNativeDriver: true
        }),
        Animated.timing(value, {
            duration: 50,
            toValue: -4,
            ease: Easing.bounce,
            useNativeDriver: true
        }),
        Animated.timing(value, {
            duration: 50,
            toValue: 0,
            ease: Easing.bounce,
            useNativeDriver: true
        })
    ]).start(callback)
}