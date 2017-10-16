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

            //get 2D context from canvas
            self.ctx = this.picker.getContext('2d');

            // draw image from source
            let image = new Image();
            image.src = 'images/colorwheel1.png';
            image.onload = function () {
                self.ctx.drawImage(image,0, 0, image.width,    image.height,
                    0, 0, self.picker.width, self.picker.height);
            }
        },
        mouseOverCanvas: function (e) {
            //if moving is allowed change the color values to the color of the current pixel
            if(this.moving) {
                let canvasX = e.pageX - this.picker.offsetLeft;
                let canvasY = e.pageY - this.picker.offsetTop;

                // get current pixel
                let imageData = this.ctx.getImageData(canvasX, canvasY, 1, 1);
                let pixel = imageData.data;

                //set RGB colors
                this.red = pixel[0];
                this.green = pixel[1];
                this.blue = pixel[2];
                //make change to the database/preview
                this.makeChange();
            }

        },
        makeChange: function () {
            self = this;
            //make change to the preview
            this.setPreview();
            //update database with the new RGB values
            self.database.ref('colors').set({
                red: parseInt(self.red),
                green: parseInt(self.green),
                blue : parseInt(self.blue)
            });


        },
        setPreview: function () {
            //get rgb color from data and change the body background (replacement of preview)
            let pixelColor = "rgb("+this.red+", "+this.green+", "+this.blue+")";
            document.getElementsByTagName('body')[0].style.backgroundColor = pixelColor;
        },
        freezeColor: function () {
            //don't allow moving for 2 seconds
            self = this;
            self.moving = false;
            setTimeout(function() { self.moving = true; }, 2000);
        }
        
    },

    mounted() {
        //draw the color picker on the canvas
        this.drawonCanvas();
    },
    beforeMount() {
        //get the current RGB values from the database and set the preview
        self = this;
        let colorRef = self.database.ref('colors');
        colorRef.on('value', function(snapshot) {
            colors = snapshot.val();
            self.red = colors.red;
            self.green = colors.green;
            self.blue = colors.blue;
            self.setPreview(self.red, self.green, self.blue);

        });
    },
    updated() {
        //if an update happens change the preview and database
        this.makeChange();
    },

})
