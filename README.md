# All in one Plant Control IOT Dashboard

All in one Python+ Node.JS Plant control system running on top of Raspberry Pi 3B+ 
Project provides the user with RESTful API Endpoints which allows the user to control the system from anywhere. 

###Project requirements

###1. PiController
####Python

```
pip3 install pymongo
```
####NodeJS
```
npm i -s 
```
This portion is used to controll the soil moisture sensor and the submersible motor used to pump water. This entire package is sued to completely automate the plant watering process as well as provide the suer with the last watered time.

###Setup
- Install Ubuntu for Raspberry Pi 
- Connect the motor with the relay to GPiO 23 and the soil moisture sensor to GPiO 21
- Install  and run MongoDB [MongoDB Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- Install all dependencies 
- Then run ```npm start```

###Tips
If you only wish to use the plant watering system without the API endpoints you will not need to install any node dependencies. Kindly install the python dependencies and run the command ```python3 automated.py``` to turn on the automation system.

###2. Frontend React Dashboard

###Requirements
1. Node.JS

###Setup

1. Install all dependencies within the 'Frontend' frontend folder using ```npm i -s```
2. Replace all domain names within ```src/components``` to the Pi's IP Address or domain name
3. ```npm start```

###3. React Native Mobile app
1. Install all dependencies within the 'IotAssignment' folder using ```npm i -s```
2. Replace all domain names within ```screens/components```
3. ```npx react-native run-android```
