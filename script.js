$(function(){
    // Get a reference to the firebase database service
    let database = firebase.database();

    // define color variables
    let r = 255,g = 255,b = 255;

    // Get current colors from database and set preview and controls
    let colorRef = database.ref('colors');
    colorRef.on('value', function(snapshot) {
        colors = snapshot.val();
            r = colors.red;
            g = colors.green;
            b = colors.blue;
        setPreview(r, g, b);
        setControls(r, g, b);

    });
    //get HTML elements
    const picker = document.getElementById('picker');
    const preview = document.getElementById('preview');
    const controlR  = document.getElementById('rVal');
    const controlG = document.getElementById('gVal');
    const controlB =  document.getElementById('bVal');
    const numberR  = document.getElementById('rNum');
    const numberG = document.getElementById('gNum');
    const numberB =  document.getElementById('bNum');

    //get the value from the controls
    getControls();

    // create canvas and context objects
    const canvas = document.getElementById('picker');
    const ctx = canvas.getContext('2d');

    // drawing active image
    const image = new Image();
    let moving = true;
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height);
    }
    image.src = 'images/colorwheel1.png';

    //change color variables to the color of the pixel where the mouse currently hovers over
    picker.addEventListener('mousemove',function(e){

        //check if we're allowed to move
        if(moving){

            //get canvas offset
            let canvasOffset = $(canvas).offset();

            //get X Y position of current pixel
            let canvasX = Math.floor(e.pageX - canvasOffset.left);
            let canvasY = Math.floor(e.pageY - canvasOffset.top);

            // get RGB values of current pixel and put them in their variables
            let imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            let pixel = imageData.data;
            r = pixel[0], g = pixel[1], b = pixel[2];

            //update preview, controls and database
            makeChange();

            //don't allow the color to change for 2 seconds when the color picker is clicked
            this.onclick = function () {
                moving = false;
                setTimeout(function() { moving = true; }, 2000);
            }

            //don't allow the color to change for 2 seconds when the mouse leaves the color picker
            this.addEventListener('mouseleave', function (e) {
                moving = false;
                setTimeout(function() { moving = true; }, 1000);
            })
        }

    });
    function setPreview(red, green, blue){

        //get an rgb color from variable values and set background color of the preview
        let pixelColor = "rgb("+red+", "+green+", "+blue+")";
        preview.style.backgroundColor = pixelColor;
    }
    function setControls(red, green, blue){

        //set value of the controls to variable values
        controlR.value = red;
        controlG.value = green;
        controlB.value = blue;

        numberR.value = red;
        numberG.value = green;
        numberB.value = blue;
    }
    function getControls (){

        //change variable values when controls are changed
        controlR.addEventListener('input', function (evt) {
            r = parseInt(this.value);
            makeChange();
        });
        controlG.addEventListener('input', function (evt) {
            g = parseInt(this.value);
            makeChange();
        });
        controlB.addEventListener('input', function (evt) {
            b = parseInt(this.value);
            makeChange();
        });
        numberR.addEventListener('input', function (evt) {
            r = parseInt(this.value);
            makeChange();
        });
        numberG.addEventListener('input', function (evt) {
            g = parseInt(this.value);
            makeChange();
        });
        numberB.addEventListener('input', function (evt) {
            b = parseInt(this.value);
            makeChange();
        });
    }
    function makeChange() {

        //set senseHat, preview and controls when a change is made
        setSenseHatColorDisplay(r,g,b);
        setPreview(r,g,b);
        setControls(r,g,b);
    }
    function setSenseHatColorDisplay(red, green, blue){

        //write colors to the database
            database.ref('colors').set({
                red: red,
                green: green,
                blue : blue
            });

    }


});