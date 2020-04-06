(function () {
    function draw() {
        GlobalBuffer.bufMain.drawString("Hello Analog", bufMain.height / 2, 10);
        GlobalBuffer.bufHeighlight.drawString("Second Text", bufMain.height/2+ 10, 10);
    }
}());
