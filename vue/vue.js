var app = new Vue({
    el: '#app',
    data: {
        database: firebase.database(),
        red: 255,
        green: 255,
        blue: 255,
        picker: document.getElementById('picker'),
        preview: document.getElementById('preview'),
        moving: true,
    },
    methods: {
        drawonCanvas: function () {
            const ctx = this.picker.getContext('2d');
            // drawing active image
            const image = new Image();
            image.onload = function () {
                ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
            }
            image.src = 'images/colorwheel1.png';
        }
    },
    mounted: {
        this.drawonCanvas();
    }
})