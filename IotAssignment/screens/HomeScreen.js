import React, { Component } from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Image,ActivityIndicator } from 'react-native';
import axios from 'axios'
import moment from 'moment'
import Spinner from 'react-native-loading-spinner-overlay';

var logo = require('../assets/logos/brunel.png')
var plantIcon = require('../assets/images/plant.gif')
var ledIcon = require('../assets/images/led.png')

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            temperature: 0,
            main: '',
            icon: '',
            humidty: 0,
            pressure: 0,
            lightstatus: 'off',
            lightModel: 'Unavailable',
            lightOnline: 'Unavailable',
            lightbrightness: 100,
            lightred: 0,
            lightblue: 0,
            lightgreen: 0,
            plantauto: 'off',
        };
        this.weatherData = this.weatherData.bind(this);
        this.plantData = this.plantData.bind(this);
        this.lightData = this.lightData.bind(this);
    }
    async weatherData() {
        await fetch('https://api.openweathermap.org/data/2.5/weather?q=uxbridge,gb&appid=befaa63fe48af867e9cc7b656f32ef3f&units=metric')
            .then((res) => res.json())
            .then((res) => {
                this.setState({ temperature: res.main.temp, humidty: res.main.humidity, pressure: res.main.pressure, main: res.weather[0].main.toLowerCase(), icon: res.weather[0].icon });
            })

    }
    async lightData() {
        await axios('https://iotassignment.herokuapp.com/api/current')
            .then(res => res.data.data.data)
            .then(res => { console.log(res.properties[3]); this.setState({ lightModel: res.model, 
                lightOnline: res.properties[0].online,
                lightstatus: res.properties[1].powerState, 
                lightbrightness: res.properties[2].brightness, 
                lightred:res.properties[3].color.r,
                lightgreen:res.properties[3].color.g,
                lightblue:res.properties[3].color.b }) })
            .catch(err => { alert('Light Data: ' + err); })
    }
    async plantData() {
        const headers = {
            'Bypass-Tunnel-Reminder': 'true'
        }
        await axios.get('https://jasonpraful.loca.lt/api/automationstatus',
            {
                headers: headers,
            })
            .then(res => { this.setState({ plantauto: res.data.data.value }); })
            .catch(err => { alert('Plant Data: ' + err); })
        await axios.get('https://jasonpraful.loca.lt/api/lastwatered',
            {
                headers: headers,
            })
            .then(res => { this.setState({ plantlastwatered: res.data.data.value }); })
            .catch(err => { alert('Plant Data: ' + err); })
    }

    async componentDidMount() {
        this.setState({loading:true})
        await this.weatherData();
        await this.plantData();
        await this.lightData()
        this.setState({loading:false})
        this.props.navigation.addListener('focus', async() =>{ 
            this.setState({loading:true})
            await this.weatherData();
            await this.plantData();
            await this.lightData();
            this.setState({loading:false})
        })
    }
    render() {
        return (
            <>
            <SafeAreaView style={styles.container} pointerEvents={this.state.loading?'none':'auto'}>
                <View style={styles.header}>
                    <Image source={logo} style={{ width: 60, height: 75 }} />
                    <Text style={styles.headerText}>Brunel CDEPS IOT</Text>
                </View>
                <View style={{ flex: 1, margin: 10 }}>
                    {/* body */}
                    <View style={{ alignSelf: 'center' }}>
                        <Text style={{ padding: 10, fontSize: 20, fontFamily: 'kreon' }}> Welcome to IOT Dashboard!</Text>
                        <View style={styles.card}>
                            <Image source={{ uri: `https://openweathermap.org/img/wn/${this.state.icon}@4x.png` }} style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }} />
                            <View style={{ flex: 2 }}>
                                <Text style={{ fontSize: 23, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}>Weather Status</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Current weather in<Text style={{ fontWeight: "bold" }}> Uxbridge</Text></Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 25, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}>{this.state.temperature}°C</Text></Text>
                                    <Text style={{ fontSize: 25, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}> {this.state.humidty}%</Text></Text>
                                    <Text style={{ fontSize: 25, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}> {this.state.pressure}hPa</Text></Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <Image source={plantIcon} style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }} />
                            <View style={{ flex: 2 }}>
                                <Text style={{ fontSize: 23, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}>Plant Watering Status</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Automation: Currently<Text style={{ fontWeight: "bold" }}> {this.state.plantauto == 'on' ? 'Active' : 'Inactive'}</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Last Watered:</Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}>{moment(this.state.plantlastwatered).format('llll')}</Text></Text>
                                {/* <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 25, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}> {this.state.temperature}°C</Text></Text>
                                    <Text style={{ fontSize: 25, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}> {this.state.humidty}%</Text></Text>
                                    <Text style={{ fontSize: 25, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}> {this.state.pressure}hPa</Text></Text>
                                </View> */}
                            </View>
                        </View>
                        <View style={styles.card}>
                            <Image source={ledIcon} style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }} />
                            <View style={{ flex: 2 }}>
                                <Text style={{ fontSize: 23, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}>Lighting Status</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Model: <Text style={{ fontWeight: "bold" }}>{this.state.lightModel}</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Online: <Text style={{ fontWeight: "bold" }}>{this.state.lightOnline == true ? 'Online' : 'Offline'}</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Currently: <Text style={{ fontWeight: "bold" }}>{this.state.lightstatus == 'on' ? 'Active' : 'Inactive'}</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Brightness: <Text style={{ fontWeight: "bold" }}>{this.state.lightbrightness}%</Text></Text>
                                <Text style={{ fontSize: 23, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}>Color</Text></Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View>
                                        <Text style={{ fontSize: 20, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}>Red</Text></Text>
                                        <Text style={{ fontSize: 20, fontFamily: 'kreon', alignSelf: 'center' }}>{this.state.lightred}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 20, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}>Green</Text></Text>
                                        <Text style={{ fontSize: 20, fontFamily: 'kreon', alignSelf: 'center' }}>{this.state.lightgreen}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 20, fontFamily: 'kreon', alignSelf: 'center' }}><Text style={{ fontWeight: "bold" }}>Blue</Text></Text>
                                        <Text style={{ fontSize: 20, fontFamily: 'kreon', alignSelf: 'center' }}>{this.state.lightblue}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </View>




                </View>
            </SafeAreaView>
            {this.state.loading && <View style={styles.spinnerContainer}><Spinner visible={this.state.loading} textContent="Loading..." textStyle={{color:'#fff'}}/></View>}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
      },
    header: {
        flexDirection: 'row',
        margin: 5,
        alignItems: 'center',
        alignSelf: 'center'
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    card: {
        width: '90%',
        flexDirection: 'row',
        backgroundColor: '#e1f1e1',
        borderRadius: 15,
        padding: 10,
        shadowColor: '#0001',
        margin: 5,
        marginBottom: 20,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10
    }
})
export default HomeScreen;
