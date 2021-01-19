import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'

import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'


//importing different screens

import HomeScreen from './screens/HomeScreen'
import Control from './screens/Control'
const Tab = createBottomTabNavigator();
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.SettingsScreen = this.SettingsScreen.bind(this);
    }
    SettingsScreen() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Settings</Text>
                <Text>Brunel CDEPS IOT Control System</Text>
                <Text>Made by Jason Praful Francis Xavier</Text>
                <Text>jason.praful@gmail.com</Text>
                <Text>version 1.0</Text>
            </View>
        );
    }


    render() {
        return (
            <>
                <NavigationContainer>
                    <Tab.Navigator initialRouteName='Dashboard'>
                        <Tab.Screen name="Dashboard" component={HomeScreen} options={
                            { headerShown: false, tabBarIcon: ({ color }) => (<Ionicons name='speedometer' size={26} color={color} />) }
                        } />
                        <Tab.Screen name="Control" component={Control} options={
                            { headerShown: false, tabBarIcon: ({ color }) => (<Ionicons name='toggle' size={26} color={color} />) }
                        } />
                        <Tab.Screen name="Settings" component={this.SettingsScreen} options={
                            { headerShown: false, tabBarIcon: ({ color }) => (<Ionicons name='cog' size={26} color={color} />) }
                        } />
                    </Tab.Navigator>
                </NavigationContainer>
            </>
        );
    }
}

const styles = StyleSheet.create({

})
export default App;