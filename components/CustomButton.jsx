import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import '@/global.css'

const CustomButton = ({ title, buttonStyle, textStyle, handlePress }) => {

    // const Pressed = ({ handlePress }) => {
    //     handlePress()
    // }

    return (
        <TouchableOpacity onPress={handlePress} className={`px-5 rounded-full w-24 h-24 justify-center items-center ${buttonStyle}`}>
            <Text className={`text-3xl ${textStyle}`}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton