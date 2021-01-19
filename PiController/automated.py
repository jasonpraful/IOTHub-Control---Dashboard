import RPi.GPIO as GPIO
import time
import pymongo
from datetime import datetime
connection = pymongo.MongoClient(
    'localhost',
    27017,
    username='',
    password=''
)
db=connection['assignment']
collection = db['connections']
#GPIO SETUP
sensorchannel = 21
motorchannel = 23
GPIO.setmode(GPIO.BCM)
GPIO.setup(sensorchannel, GPIO.IN)
GPIO.setup(motorchannel, GPIO.IN)

def callback(sensorchannel):
        if GPIO.input(sensorchannel):
            motor_on(motorchannel)
            updatedb()
            print( "Water Not Detected!")
        else:
            motor_off(motorchannel)
            print("Water Detected!")
 
GPIO.add_event_detect(21, GPIO.BOTH)  # let us know when the pin goes HIGH or LOW
GPIO.add_event_callback(21, callback)  # assign function to GPIO PIN, Run function on change


def motor_on(pin):
    GPIO.setup(motorchannel, GPIO.OUT)


def motor_off(pin):
    GPIO.setup(motorchannel, GPIO.IN)

def updatedb():
    data = {'value':'last_watered','time':datetime.now()}
    key = {'value':'last_watered'}
    collection.update({'value':'last_watered'}, data, upsert=True)

# infinite loop
while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        GPIO.cleanup()
        exit()