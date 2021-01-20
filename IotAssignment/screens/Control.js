import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, Text, StyleSheet, Image, StatusBar, Switch, TouchableOpacity } from 'react-native';
import Slider from 'react-native-slider'
import axios from 'axios'
import ColorPicker from 'react-native-wheel-color-picker'
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment'

import rgbHex from 'rgb-hex'
import hexRgb from 'hex-rgb'

var logo = require('../assets/logos/brunel.png')
var plantIcon = require('../assets/images/plant.gif')
var ledIcon = require('../assets/images/led.png')


class Control extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            automationstatus: 'off',
            lightstatus: true,
            lightbrightness: 0.5,
            lightred: 0,
            lightblue: 0,
            lightgreen: 0,
            initialHex: '#FFFFFF',

        };
        this.lightData = this.lightData.bind(this)
        this.plantData = this.plantData.bind(this)
        this.controlLightSwitch = this.controlLightSwitch.bind(this)
        this.controlLightBrightness = this.controlLightBrightness.bind(this)
        this.controlLightColor = this.controlLightColor.bind(this)
        this.controlPlantAutomation = this.controlPlantAutomation.bind(this)
        this.controlMotor = this.controlMotor.bind(this)
    }
    async lightData() {
        await axios('https://iotassignment.herokuapp.com/api/current')
            .then(res => res.data.data.data)
            .then(res => {
                console.log(res.properties[1]); this.setState({
                    lightModel: res.model,
                    lightOnline: res.properties[0].online,
                    lightstatus: res.properties[1].powerState == 'on' ? true : false,
                    lightbrightness: res.properties[2].brightness / 100,
                    lightred: res.properties[3].color.r,
                    lightgreen: res.properties[3].color.g,
                    lightblue: res.properties[3].color.b,
                    initialHex: rgbHex(res.properties[3].color.r, res.properties[3].color.g, res.properties[3].color.b)
                });

            })
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

    async controlLightSwitch(val) {
        console.log(val)
        this.setState({ lightstatus: val })
        await fetch('https://iotassignment.herokuapp.com/api/switch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ value: val == true ? 'on' : 'off' })
        }
        )
            .then((res) => res.json())
            .then(res => console.log(res.data))
            .catch(err => { alert(err); this.setState({ lightstatus: !val }) })
    }

    async controlLightBrightness(value) {
        console.log(value)
        var initialBrightness = this.state.lightbrightness
        this.setState({ lightbrightness: value })
        await fetch('https://iotassignment.herokuapp.com/api/brightness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ value: value * 100 })
        }
        )
            .then((res) => res.json())
            .then(res => { console.log(res.data) })
            .catch(err => { alert(err); this.setState({ lightbrightness: !val }) })
        setTimeout(() => this.lightData(), 1500)
    }

    async controlLightColor(value) {
        console.log('color' + this.state.initialHex)
        var color = hexRgb(value)
        console.log(color)
        await fetch('https://iotassignment.herokuapp.com/api/color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ red: color.red, green: color.green, blue: color.blue })
        }
        )
            .then((res) => res.json())
            .then(res => { console.log(res.data) })
            .catch(err => { alert(err) })
        setTimeout(() => this.lightData(), 1500)
    }

    async controlPlantAutomation(value) {
        console.log(value)
        this.setState({ plantauto: value == true ? 'on' : 'off' })
        await fetch('https://jasonpraful.loca.lt/api/controlautomation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'Bypass-Tunnel-Reminder': 'true' },
            body: JSON.stringify({ value: value == true ? 'on' : 'off' })
        }
        )
            .then((res) => res.json())
            .then(res => console.log(res.data))
            .catch(err => { alert(err); this.setState({ plantauto: value == true ? 'off' : 'on' }) })
        setTimeout(() => this.plantData(), 1500)
    }

    async controlMotor(value) {
        if (value == 'on') {
            await fetch('https://jasonpraful.loca.lt/api/motorcontrol', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'Bypass-Tunnel-Reminder': 'true' },
                body: JSON.stringify({ value: 'on' })
            }
            )
                .then((res) => res.json())
                .then(res => console.log(res.data))
                .catch(err => { alert(err); this.setState({ plantauto: value == true ? 'off' : 'on' }) })
        }
        else if (value == 'off') {
            await fetch('https://jasonpraful.loca.lt/api/motorcontrol', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'Bypass-Tunnel-Reminder': 'true' },
                body: JSON.stringify({ value: 'off' })
            }
            )
                .then((res) => res.json())
                .then(res => console.log(res.data))
                .catch(err => { alert(err); this.setState({ plantauto: value == true ? 'off' : 'on' }) })

        }
    }

    async componentDidMount() {
        this.setState({loading:true})
        await this.lightData()
        await this.plantData()
        this.setState({loading:false})
        this.props.navigation.addListener('focus', async () => {
            this.setState({loading:true})
            await this.lightData();
            await this.plantData();
            this.setState({loading:false})
        })
    }
    render() {
        return (
            <>
            <ScrollView style={styles.container} pointerEvents={this.state.loading?'none':'auto'}>

                <View style={styles.header}>
                    <Image source={logo} style={{ width: 60, height: 75 }} />
                    <Text style={styles.headerText}>Brunel CDEPS IOT</Text>
                </View>
                <View style={styles.header}>
                    <Text style={{ marginTop: 30 }, styles.headerText}>Control Devices</Text>
                </View>
                <View style={{ flex: 1, margin: 10 }}>
                    {/* body */}
                    <View style={{ alignSelf: 'center' }}>
                        <View style={styles.card}>
                            <Image source={plantIcon} style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }} />
                            <View style={{ flex: 2 }}>
                                <Text style={{ fontSize: 23, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}>Plant Watering System</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Automation: Currently<Text style={{ fontWeight: "bold" }}> {this.state.plantauto == 'on' ? 'Active' : 'Inactive'}</Text></Text>
                                <View style={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={this.state.plantauto ? "#f5dd4b" : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={this.controlPlantAutomation}
                                        value={this.state.plantauto == 'on' ? true : false} />
                                </View>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Last Watered:</Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}>{moment(this.state.plantlastwatered).format('llll')}</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}> </Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}>MANUAL CONTROL</Text></Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}>Press and Hold to manually control the pump</Text>
                                <Text style={{ fontSize: 15, fontFamily: 'kreon' }}>(this option is unavailable when automation is enabled)</Text>
                                <Text style={{ fontSize: 20, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}> </Text></Text>
                                <TouchableOpacity
                                    onPressIn={() => { this.controlMotor('on') }}
                                    onPressOut={() => { this.controlMotor('off')}}
                                    disabled={this.state.plantauto == 'on' ? true : false}
                                    // onPress={buttonClickedHandler}
                                    style={this.state.plantauto == 'on' ? styles.roundButton1disabled : styles.roundButton1}>
                                    <Text>CAUTION</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <Image source={ledIcon} style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }} />
                            <View style={{ flex: 2 }}>
                                <Text style={{ fontSize: 25, fontFamily: 'kreon' }}><Text style={{ fontWeight: "bold" }}>Lighting</Text></Text>
                                <Text style={{ fontSize: 25, fontFamily: 'kreon' }}>Power: </Text>
                                <View style={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={this.state.lightstatus ? "#f5dd4b" : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={this.controlLightSwitch}
                                        value={this.state.lightstatus} />
                                </View>
                                <Text style={{ fontSize: 25, fontFamily: 'kreon' }}>Brightness:</Text>
                                <Slider
                                    minimumTrackTintColor='#13a9d6'
                                    thumbImage={require('../assets/images/thumb.png')}
                                    thumbStyle={customStyles9.thumb}
                                    thumbTintColor='#0c6692'
                                    value={this.state.lightbrightness}
                                    onSlidingComplete={this.controlLightBrightness}
                                />
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
                                <View style={{ height: 200 }}>
                                    <ColorPicker
                                        onColorChangeComplete={(value) => this.controlLightColor(value)}
                                        thumbSize={30}
                                    />
                                </View>
                            </View>

                        </View>

                    </View>




                </View>
            </ScrollView>
            {this.state.loading && <Spinner visible={this.state.loading} textContent="Loading..." textStyle={{color:'#fff'}}/>}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
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
    roundButton1: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'orange',
    },
    roundButton1disabled: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'grey',
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


var customStyles9 = StyleSheet.create({
    thumb: {
        width: 30,
        height: 30,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
    }
});

export default Control;





