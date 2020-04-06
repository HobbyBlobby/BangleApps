(function () { 'use strict';
    function draw() {
        GlobalBuffer.bufMain.drawString("Hello Analog", 10, GlobalBuffer.bufMain.height / 2);
        GlobalBuffer.bufHeighlight.drawString("Second Text", 20, GlobalBuffer.bufHeighlight.height/2+ 50);
    }
}());
