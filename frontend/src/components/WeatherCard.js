

import React, { Component } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBView, MDBIcon } from 'mdbreact';

import axios from 'axios'
import weatherLogo from '../assets/images/weather.jpg'
import temperatureLogo from '../assets/images/temperature.png'
import humidityLogo from '../assets/images/humidity.png'
import pressureLogo from '../assets/images/pressure.png'

class WeatherCard extends Component {
    render() {
    var currWeather = `https://openweathermap.org/img/wn/${this.props.icon}@4x.png`
        return (
            <div>
                <MDBCard style={{ width: "22rem", borderRadius: 20 }}>
                  <MDBCardImage className="img-fluid" style={{ borderRadius: 20 }} src={weatherLogo} waves />
                  <MDBCardBody>
                    <MDBCardTitle>Weather</MDBCardTitle>
                    <MDBCardText style={{ fontSize: 20 }}>Current weather in <b>Uxbridge</b>
                      <div style={{display:"flex",alignItems: "center"}}>
                        <img src={currWeather} style={{width:60}} alt="Weather Logo"/>
                        <h3 style={{padding:10,marginTop:'10px',fontSize:25,textTransform:'capitalize'}}>{this.props.main}</h3>
                      </div>
                      <div style={{marginLeft:30,display:"flex",alignItems: "center"}}>
                        <img src={temperatureLogo} style={{width:30}} alt="Weather Logo"/>
                        <h3 style={{padding:10,top:10,fontSize:25,textTransform:'capitalize'}}>{this.props.temperature}°c</h3>
                      </div>
                      <div style={{marginLeft:30,display:"flex",alignItems: "center"}}>
                        <img src={humidityLogo} style={{width:30}} alt="Weather Logo"/>
                        <h3 style={{padding:10,top:10,fontSize:25,textTransform:'capitalize'}}>{this.props.humidty}%</h3>
                      </div>
                      <div style={{marginLeft:40,display:"flex",alignItems: "center"}}>
                        <img src={pressureLogo} style={{width:20,top:-10}} alt="Weather Logo"/>
                        <h3 style={{padding:10,top:10,fontSize:25,textTransform:'capitalize'}}>{this.props.pressure}hPa</h3>
                      </div>
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
            </div>
        );
    }
}

export default WeatherCard;