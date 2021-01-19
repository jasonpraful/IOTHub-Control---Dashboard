

import React, { Component } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBView, MDBIcon } from 'mdbreact';
import ReactCardFlip from 'react-card-flip';
import { Switch } from '@material-ui/core'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import axios from 'axios'
import lightLogo from '../assets/images/light.jpg'
import ColorPicker from "react-pick-color";


const PrettoSlider = withStyles({
    root: {
        color: '#52af77',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);
class LightCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFlipped: false,
            lightstatus: 'on',
            lightModel: '',
            lightOnline: '',
            lightbrightness: 0.5,
            lightred: 0,
            lightblue: 0,
            lightgreen: 0,
        }
        this.lightData = this.lightData.bind(this)
        this.controlLightSwitch = this.controlLightSwitch.bind(this)
        this.controlLightBrightness = this.controlLightBrightness.bind(this)

    }

    async lightData() {
        await axios('https://iotassignment.herokuapp.com/api/current')
            .then(res => res.data.data.data)
            .then(res => {
                this.setState({
                    lightModel: res.model,
                    lightOnline: res.properties[0].online ? "Online" : "Offline",
                    lightstatus: res.properties[1].powerState,
                    lightbrightness: res.properties[2].brightness,
                    lightred: res.properties[3].color.r,
                    lightgreen: res.properties[3].color.g,
                    lightblue: res.properties[3].color.b
                })
            })
            .catch(err => { alert('Light Data: ' + err); })
    }
    async controlLightSwitch() {
        await fetch('https://iotassignment.herokuapp.com/api/switch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ value: this.state.lightstatus == 'on' ? 'off' : 'on' })
        }
        )
            .then((res) => res.json())
            .then(res => {
                this.setState({ lightstatus: this.state.lightstatus == 'on' ? 'off' : 'on' })
            })
            .catch(err => { alert(err); })
    }

    async controlLightBrightness(event, value) {
        var initialBrightness = this.state.lightbrightness
        this.setState({ lightbrightness: value })
        await fetch('https://iotassignment.herokuapp.com/api/brightness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ value: value })
        }
        )
            .then((res) => res.json())
            .then(res => { console.log(res.data) })
            .catch(err => { alert(err); this.setState({ lightbrightness: initialBrightness }) })
        setTimeout(() => this.lightData(), 1500)
    }

    async controlLightColor(value) {
        console.log('Called')
        await fetch('https://iotassignment.herokuapp.com/api/color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ red: value.r, green: value.g, blue: value.b })
        }
        )
            .then((res) => res.json())
            .then(res => { console.log(res.data) })
            .catch(err => { alert(err) })
        setTimeout(() => this.lightData(), 1500)
    }


    async componentDidMount() {
        await this.lightData()
    }



    render() {
        return (
            <div>
                <ReactCardFlip isFlipped={this.state.isFlipped}>
                    <MDBCard style={{ width: "22rem", borderRadius: 20 }}>
                        <MDBCardImage className="img-fluid" style={{ borderRadius: 20, width: '22rem' }} src={lightLogo} waves />
                        <MDBCardBody>
                            <MDBCardTitle>Lights Status</MDBCardTitle>
                            <MDBCardText style={{ fontSize: 20 }}>
                                <h3 style={{ marginTop: '10px', fontSize: 15, textTransform: 'capitalize' }}><b>Model: </b>{this.state.lightModel}</h3>
                                <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize' }}><b>Online: </b>{this.state.lightOnline}</h3>
                                <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize' }}><b>Status: </b>{this.state.lightstatus}</h3>
                                <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize' }}><b>Brightness: </b>{this.state.lightbrightness}%</h3>
                                <h3 style={{ top: 10, fontSize: 20, textTransform: 'capitalize', textAlign: 'center' }}><b>Color</b></h3>
                                <MDBRow>
                                    <MDBCol>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>Red</b></h3>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>{this.state.lightred}</b></h3>
                                    </MDBCol>
                                    <MDBCol>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>Green</b></h3>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>{this.state.lightgreen}</b></h3>
                                    </MDBCol>
                                    <MDBCol>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>Blue</b></h3>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>{this.state.lightblue}</b></h3>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardText>
                            <MDBBtn style={{borderRadius: 20 }} onClick={() => { this.setState({ isFlipped: true }) }}>Control</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>


                    <MDBCard style={{ width: "22rem", borderRadius: 20 }}>
                        <MDBCardBody>
                            <MDBCardTitle>Lights Control</MDBCardTitle>
                            <MDBCardText style={{ fontSize: 20 }}>
                                <div>
                                    <span>Switch: </span>
                                    <Switch
                                        checked={this.state.lightstatus == 'on' ? true : false}
                                        onChange={() => this.controlLightSwitch()}
                                        name="LightToggle"
                                    />
                                </div>
                                <div>
                                    <span>Brightness: </span>
                                </div>
                                <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" key={`slider-${this.state.lightbrightness}`} defaultValue={this.state.lightbrightness} onChangeCommitted={this.controlLightBrightness} />
                                <h3 style={{ top: 10, fontSize: 20, textTransform: 'capitalize', textAlign: 'center' }}><b>Color</b></h3>
                                <MDBRow>
                                    <MDBCol>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>Red</b></h3>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>{this.state.lightred}</b></h3>
                                    </MDBCol>
                                    <MDBCol>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>Green</b></h3>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>{this.state.lightgreen}</b></h3>
                                    </MDBCol>
                                    <MDBCol>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>Blue</b></h3>
                                        <h3 style={{ top: 10, fontSize: 15, textTransform: 'capitalize', textAlign: 'center' }}><b>{this.state.lightblue}</b></h3>
                                    </MDBCol>
                                </MDBRow>
                                <ColorPicker color={'#FFFFFF'} hideAlpha hideInputs onChange={(color) => {this.controlLightColor(color.rgb)}} />
                            </MDBCardText>
                            <MDBBtn style={{borderRadius: 20 }} onClick={() => { this.setState({ isFlipped: false }) }}>Back</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>

                </ReactCardFlip>

            </div>
        );
    }
}

export default LightCard;