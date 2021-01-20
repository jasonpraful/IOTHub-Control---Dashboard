

import React, { Component } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText,} from 'mdbreact';
import ReactCardFlip from 'react-card-flip';
import { Switch } from '@material-ui/core'
import axios from 'axios'
import plantLogo from '../assets/images/plant.gif'
import clockLogo from '../assets/images/clock.png'
import humidityLogo from '../assets/images/humidity.png'
import moment from 'moment'

class PlantCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      plantauto: 'on',
      isFlipped: false
    }
    this.controlPlantAutomation = this.controlPlantAutomation.bind(this)
    this.controlMotor = this.controlMotor.bind(this)
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

  async controlPlantAutomation() {
    console.log()
    await fetch('https://jasonpraful.loca.lt/api/controlautomation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Bypass-Tunnel-Reminder': 'true' },
      body: JSON.stringify({ value: this.state.plantauto === 'on' ? 'off' : 'on' })
    }
    )
      .then((res) => res.json())
      .then(res => this.setState({ plantauto: this.state.plantauto === 'on' ? 'off' : 'on' }))
      .catch(err => { alert(err); })
    setTimeout(() => this.plantData(), 1500)
  }

  async controlMotor(event) {
    console.log(event.type)
     if (event.type === 'mousedown') {
         await fetch('https://jasonpraful.loca.lt/api/motorcontrol', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json; charset=utf-8', 'Bypass-Tunnel-Reminder': 'true' },
             body: JSON.stringify({ value: 'on' })
         }
         )
             .then((res) => res.json())
             .then(res => console.log(res.data))
             .catch(err => { alert(err);})
     }
     else if (event.type === 'mouseup') {
         await fetch('https://jasonpraful.loca.lt/api/motorcontrol', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json; charset=utf-8', 'Bypass-Tunnel-Reminder': 'true' },
             body: JSON.stringify({ value: 'off' })
         }
         )
             .then((res) => res.json())
             .then(res => console.log(res.data))
             .catch(err => { alert(err);})

     }
  }


  async componentDidMount() {
    await this.plantData()
  }

  render() {
    return (
      <div>
        <ReactCardFlip isFlipped={this.state.isFlipped}>
          <MDBCard style={{ width: "22rem", borderRadius: 20 }}>
            <MDBCardImage className="img-fluid" style={{ borderRadius: 20, width: '22rem' }} src={plantLogo} waves />
            <MDBCardBody>
              <MDBCardTitle>Plant Data</MDBCardTitle>
              <MDBCardText style={{ fontSize: 20 }}>
                <div style={{ marginLeft: 30, display: "flex", alignItems: "center" }}>
                  <img src={humidityLogo} style={{ width: 30 }} alt="Weather Logo" />
                  <h3 style={{ padding: 10, top: 10, fontSize: 20, textTransform: 'capitalize' }}>Automation Status: <b>{this.state.plantauto}</b></h3>
                </div>
                <div style={{ marginLeft: 30, display: "flex", alignItems: "center" }}>
                  <img src={clockLogo} style={{ width: 30 }} alt="Weather Logo" />
                  <h3 style={{ padding: 10, top: 10, fontSize: 18, textTransform: 'capitalize' }}>Last Watered:<br />{moment(this.props.plantlastwatered).format('llll')}</h3>
                </div>
              </MDBCardText>
              <MDBBtn style={{ borderRadius: 20 }} onClick={() => { this.setState({ isFlipped: true }) }}>Control</MDBBtn>
            </MDBCardBody>
          </MDBCard>

          <MDBCard style={{ width: "22rem", borderRadius: 20 }}>
            <MDBCardBody>
              <MDBCardTitle>Plant Automation Control</MDBCardTitle>
              <MDBCardText style={{ fontSize: 20 }}>
                <div>
                  <span>Automation: </span>
                  <Switch
                    checked={this.state.plantauto === 'on' ? true : false}
                    onChange={() => this.controlPlantAutomation()}
                    name="PlantToggle"
                  />
                </div>
                <div>
                  <span><b>MANUAL CONTROL</b></span>
                  <p style={{ fontSize: 13 }}>Press and hold the button below to control the motor manually.</p>
                  <MDBBtn disabled={this.state.plantauto === 'on' ? true : false}
                    variant="contained"
                    color="danger"
                    style={{ borderRadius: 50 }}
                    onMouseDown={this.controlMotor}
                    onMouseUp={this.controlMotor}>
                    CONTROL
                    </MDBBtn>
                  <br />
                  <p style={{ fontSize: 13, marginTop: 10 }}>
                    <b>
                      (This option is disabled when automation has been turned on)<br />Please use this option with CAUTION.</b></p>
                </div>
              </MDBCardText>
              <MDBBtn style={{ borderRadius: 20 }} onClick={() => { this.setState({ isFlipped: false }) }}>Back</MDBBtn>
            </MDBCardBody>
          </MDBCard>

        </ReactCardFlip>

      </div>
    );
  }
}

export default PlantCard;