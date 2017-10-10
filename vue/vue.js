let app = new Vue({
    el: '#app',
    data: {
        database: firebase.database(),
        red: 255,
        green: 255,
        blue: 255,
        ctx: '',
        picker: '',
        moving: true,
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
            image.src = 'images/colorwheel1.png';
            image.onload = function () {
                self.ctx.drawImage(image, 0, 0, image.width, image.height);
            }
        },
        mouseOverCanvas: function (e) {
            console.log('check move');
            if(this.moving) {
                let canvasX = Math.floor(e.pageX - this.picker.offsetLeft);
                let canvasY = Math.floor(e.pageY - this.picker.offsetTop);
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
            // self.database.ref('colors').set({
            //     red: parseInt(self.red),
            //     green: parseInt(self.green),
            //     blue : parseInt(self.blue)
            // });


        },
        setPreview: function () {
            let pixelColor = "rgb("+this.red+", "+this.green+", "+this.blue+")";
            document.getElementById('preview').style.backgroundColor = pixelColor;
        },
        freezeColor: function () {
            self = this;
            self.moving = false;
            setTimeout(function() { self.moving = true; }, 2000);
        }
        
    },

    mounted() {
        // this.mouseOverCanvas();
        this.drawonCanvas();
        // this.mouseOverCanvas();
    },
    beforeMount() {
        // self = this;
        // let colorRef = self.database.ref('colors');
        // colorRef.on('value', function(snapshot) {
        //     colors = snapshot.val();
        //     self.red = colors.red;
        //     self.green = colors.green;
        //     self.blue = colors.blue;
        //     // self.setPreview(self.red, self.green, self.blue);
        //     self.makeChange();
        //
        // });
    },
    updated() {
       console.log('something updated')
        this.makeChange();
    },

})
// app.drawonCanvas();