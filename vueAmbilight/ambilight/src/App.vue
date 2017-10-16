<!--NOT Working properly v-on is not firing an event-->
<template>
    <div>
        <nav>
            <div class="nav-wrapper">
                <a href="#" class="brand-logo center">Colorpicker</a>
            </div>
        </nav>
        <div id="app">
            <div class="canvas-container">
                <canvas  v-on:mouseMove="mouseOverCanvas"
                         v-on:click="freezeColor"
                         id="picker" var="1" width="300px" height="300px">
                </canvas>
            </div>
            <div class="colorpicker container ">
                <div class="col s8 offset-s2">

                    <div class=" card controls col s12">
                        <form>
                            <div class="row">
                                <h5 class="col s10 offset-s1">Rgb Sliders</h5>
                            </div>
                            <div class="row">
                                <label class="col s1 offset-s1">Red</label>
                                <input class="col s8" type="range" id="rVal" name="points" v-model="red" min="0" max="255">
                                <label class="col s1 right-align" >{{red}}</label>
                            </div>
                            <div class="row">
                                <label class="col s1 offset-s1">Green</label>
                                <input class="col s8" type="range" id="gVal" name="points" v-model="green" min="0" max="255">
                                <label class="col s1 right-align" >{{green}}</label>
                            </div>
                            <div class="row">
                                <label class="col s1 offset-s1">Blue</label>
                                <input class="col s8" type="range" id="bVal" name="points" v-model="blue" min="0" max="255">
                                <label class="col s1 right-align" >{{blue}}</label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import * as firebase from "firebase";
import img from './assets/colorwheel1.png'

let config = {
    apiKey: "AIzaSyDkWfspxRALQHEx5fF0mk0OV6FtJt3Npqg",
    authDomain: "ambilight-c124f.firebaseapp.com",
    databaseURL: "https://ambilight-c124f.firebaseio.com",
    projectId: "ambilight-c124f",
    storageBucket: "",
    messagingSenderId: "1095782358204"
};
firebase.initializeApp(config);

export default {
  name: 'app',
  components: {
    HelloWorld
  },
    data() {
      return {
          database: firebase.database(),
          red: 255,
          green: 255,
          blue: 255,
          ctx: '',
          picker: '',
          moving: true,
      }
    },
    methods: {
        drawonCanvas: function () {
            let self = this;
            //get canvas element
            self.picker = document.querySelector('canvas');
            // let picker=  this.picker;

            //get 2D context from canvas
            self.ctx = this.picker.getContext('2d');
            // draw image from source
            let image = new Image();
            // console.log(ctx);
            image.src = '/static/img/colorwheel1.065f43d.png'

            image.onload = function () {
                // self.ctx.drawImage(image, 0, 0, image.width, image.height);
                self.ctx.drawImage(image,0, 0, image.width,    image.height,
                    0, 0, self.picker.width, self.picker.height);
            }
        },
        mouseOverCanvas: function (e) {
            console.log('check move');
            if(this.moving) {
                let canvasX = e.pageX - this.picker.offsetLeft;
                let canvasY = e.pageY - this.picker.offsetTop;
                // get current pixel
                let imageData = this.ctx.getImageData(canvasX, canvasY, 1, 1);
                let pixel = imageData.data;
                this.red = pixel[0];
                this.green = pixel[1];
                this.blue = pixel[2];
                this.makeChange();
            }

        },
        makeChange: function () {
            self = this;
            console.log('change color');
            this.setPreview();
            self.database.ref('colors').set({
                red: parseInt(self.red),
                green: parseInt(self.green),
                blue : parseInt(self.blue)
            });


        },
        setPreview: function () {
            let pixelColor = "rgb("+this.red+", "+this.green+", "+this.blue+")";
            document.getElementsByTagName('body')[0].style.backgroundColor = pixelColor;
        },
        freezeColor: function () {
            self = this;
            self.moving = false;
            setTimeout(function() { self.moving = true; }, 2000);
        }

    },

    mounted() {
        this.drawonCanvas();
        console.log('mounted');
    },
    beforeMount() {
        console.log('before mount')
        self = this;
        let colorRef = self.database.ref('colors');
        colorRef.on('value', function(snapshot) {
            let colors = snapshot.val();
            self.red = colors.red;
            self.green = colors.green;
            self.blue = colors.blue;
            self.setPreview(self.red, self.green, self.blue);

        });
    },
    created() {
        console.log('created');

    },
    updated() {
        console.log('something updated')
        this.makeChange();
    },
}
</script>

<style>
    body {
        /*background-color: #e0e0e0;*/
    }
    nav {
        background-color: #37474f;
    }
    .card {
        margin-top: 3rem;
        background-color: #fffde7 ;
    }
    .previewContainer {
        width: 100%;
        height: 300px;
        position: relative;
    }
    #preview{
        background-color: #1d1d1d;
        position: absolute;
        top: 2rem;
        bottom: 2rem;
        left: 2rem;
        right:2rem;
    }
    #picker {
        margin-top:  1rem;
        text-align: center;

    }
    .thumb active {
        display: none;
    }
    .canvas-container {
        text-align: center;
    }
    .row {
        margin: 0;
    }
    .colorpicker {
        /*margin-top: 1rem;*/
    }
</style>
