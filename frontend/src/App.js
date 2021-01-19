import React, { Component } from 'react';
import { Container, Col, Row, Card } from 'react-bootstrap'
import { MDBRow, MDBCol } from 'mdbreact';
import NavBar from './components/NavBar'
import WeatherCard from './components/WeatherCard'
import PlantCard from './components/PlantCard'
import LightCard from './components/LightCard'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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

  }
  //Get Lights Status
  async weatherData() {
    await fetch('https://api.openweathermap.org/data/2.5/weather?q=uxbridge,gb&appid=befaa63fe48af867e9cc7b656f32ef3f&units=metric')
      .then((res) => res.json())
      .then((res) => {
        this.setState({ temperature: res.main.temp, humidty: res.main.humidity, pressure: res.main.pressure, main: res.weather[0].main.toLowerCase(), icon: res.weather[0].icon });
      })

  }
  

  async componentDidMount() {
    this.setState({ loading: true })
    await this.weatherData();
    this.setState({ loading: false })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
          <NavBar />
          <div>
            <br />
            <h3 style={{textAlign: 'center',fontFamily:'Kreon',fontWeight:'bold',marginBottom:10}}><b>Welcome to Brunel CDEPS IOT Console</b></h3>
          </div>
          <Container>
            <MDBRow >
              <MDBCol md="4">
                <WeatherCard icon={this.state.icon} main={this.state.main} temperature={this.state.temperature} humidty={this.state.humidty} pressure={this.state.pressure}/>
              </MDBCol>
              <MDBCol md="4">
                <PlantCard />
              </MDBCol>
              <MDBCol md="4">
                <LightCard />
              </MDBCol>
            </MDBRow>
          </Container>
      </div>
    );
  }
}

export default App;
