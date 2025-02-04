import { View, Text } from 'react-native'
import React from 'react'

const TextDisplay = ({ displayText }) => {

    return (
        <View>
            <Text className='text-white text-5xl text-right pr-8 mb-4'>{displayText}</Text>
        </View>
    )
}

export default TextDisplay