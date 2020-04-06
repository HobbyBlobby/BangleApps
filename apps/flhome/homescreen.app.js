var GlobalBuffer = require("buffer.js");

var HomeScreen = {
    "mode": "single", // can also be cycle
    "currentScreen": 0, // start with screen 0
    "screenList":  [
        require("analogclock.js"),
        require("digitalclock.js")
    ],
    "timerID": null,
    "cycleTimer": null
};

function nextScreen(dir) {
    if(HomeScreen.timerID) {
        clearInterval(HomeScreen.timerID);
        HomeScreen.timerID = null;
    }
    if(dir == 1) {
        HomeScreen.currentScreen++;
        if(HomeScreen.currentScreen >= HomeScreen.screenList.length) {
            HomeScreen.currentScreen = 0;
        }
    } else {
        HomeScreen.currentScreen--;
        if(HomeScreen.currentScreen < 0) {
            HomeScreen.currentScreen = HomeScreen.screenList.length - 1;
        }
    }
    HomeScreen.timerID = setInterval(draw(), 1000);    
}

function draw() {
    GloablBuffer.clear();
    if(HomeScreen.screenList[HomeScreen.currentScreen]) {
        HomeScreen.screenList[HomeScreen.currentScreen].draw();
    }
    // TODO draw screen status (dots 1 of 3)
    GlobalBuffer.flip();
}

function switchCycle() {
    if(HomeScreen.cycleTimer) {
        clearInterval(HomeScreen.cycleTimer);
        HomeScreen.cycleTimer = null;
    } else {
        HomeScreen.cycleTimer = setInterval(nextScreen(1), 3000);
    }
}

function init() {
    g.clear();
    Bangle.loadWidgets();
    Bangle.drawWidgets();

    HomeScreen.timerID = setInterval(HomeScreen.screenList[0].draw, 1000);
    HomeScreen.screenList[0].draw();
}

Bangle.on('lcdPower',function(on) {
  if (on)
    drawFunction();
});

//dir left = -1, right = 1
Bangle.on('swipe', function(dir) {
  nextScreen(dir);
});

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});
// switch to cycle mode when long pressing btn1
settWatch(function(e){
    var isLong = (e.time-e.lastTime) > 2.0;
    if(isLone) {
        switchCycle();
    }
}, BTN1, {repeat:true, debounce:50, edge:"falling"});

// init the app
init();
