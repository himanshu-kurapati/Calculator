import React from "react";
import { View } from "react-native";

export default ({ children }) => (
    <View className="flex-row justify-between my-4">{children}</View>
);