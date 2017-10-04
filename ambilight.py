import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from sense_hat import SenseHat

sense = SenseHat()
cred = credentials.Certificate('ambilight-c124f-firebase-adminsdk-c46v8-1b793011da.json')
default_app = firebase_admin.initialize_app(cred,{'databaseURL':'https://ambilight-c124f.firebaseio.com'})

root = db.reference()

while True:
    colors = root.child('colors').get()

    redvalue = colors['red']
    greenvalue = colors['green']
    bluevalue = colors['blue']

    colorsh = (redvalue, greenvalue, bluevalue)
    print(colorsh)
    canvas = [
        colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh,
        colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh,
        colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh,
        colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh,
        colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh,
        colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh,
        colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh,
        colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh, colorsh
        ]

    sense.set_pixels(canvas)
