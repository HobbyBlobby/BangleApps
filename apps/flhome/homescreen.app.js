GlobalBuffer = require("buffer.js");
//GlobalBuffer = require("https://github.com/HobbyBlobby/BangleApps/blob/master/apps/flhome/buffer.js");

var HomeScreen = {
    "mode": "single", // can also be cycle
    "currentScreen": 0, // start with screen 0
    "screen": null, // contains the module code
    "screenList":  [
      "analogclock.js",
      "digitalclock.js"
    ],
    "timerID": null,
    "cycleTimer": null
};

function unloadScreen(sModule) {
  //Modules.removeCached(sModule);
  delete HomeScreen.screen; 
  HomeScreen.screen = null;
}

function loadScreen(sModule) {
//  if(sModule == "analogclock.js") {
//      HomeScreen.screen = //require("https://raw.githubusercontent.com/HobbyBlobby/BangleApps/master/apps/flhome/analogclock.js");
//  } else {
//    HomeScreen.screen = //require("https://raw.githubusercontent.com/HobbyBlobby/BangleApps/master/apps/flhome/digitalclock.js");
//  }
  //Modules.addCached(sModule, sModule) ;
  HomeScreen.screen = require(sModule);
}

function nextScreen(dir) {
    if(HomeScreen.timerID) {
        clearInterval(HomeScreen.timerID);
        HomeScreen.timerID = null;
    }
    var oldScreen = HomeScreen.screenList[HomeScreen.currentScreen];
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
    if (!Bangle.isLCDOn()) return;
    unloadScreen(HomeScreen.screenList[HomeScreen.currentScreen]);
    loadScreen(HomeScreen.screenList[HomeScreen.currentScreen]);
    HomeScreen.timerID = setInterval(draw, 1000);    
}

function draw() {
    if (!Bangle.isLCDOn()) return;
//     print(process.memory());
    GlobalBuffer.clear();
    if(HomeScreen.screen) {
        HomeScreen.screen.draw();
    }
    // TODO draw screen status (dots 1 of 3)
    GlobalBuffer.buf.setColor(3);
    GlobalBuffer.buf.drawString(process.memory().free.toString(), 10,10);
    GlobalBuffer.flip();
}

function switchCycle() {
    print("Switch");
    if(HomeScreen.cycleTimer) {
        clearInterval(HomeScreen.cycleTimer);
        HomeScreen.cycleTimer = null;
    } else {
        HomeScreen.cycleTimer = setInterval(nextScreen, 8000, 1);
    }
}

function init() {
    g.clear();
    Bangle.loadWidgets();
    Bangle.drawWidgets();

    loadScreen(HomeScreen.screenList[0]);
    HomeScreen.timerID = setInterval(draw, 1000);
    draw();
}

function showLauncher() {
    clearInterval(HomeScreen.timerID);
    delete GlobalBuffer.buf;
    Modules.removeAllCached();
    g.clear();
    g.drawString(process.memory().free.toString(), 10,10);
    
//     Bangle.showLauncher();
}

// Bangle.on('lcdPower',function(on) {
//   if (on)
//     draw();
// });

//dir left = -1, right = 1
Bangle.on('swipe', function(dir) {
  nextScreen(dir);
});

// switch to cycle mode when long pressing btn1
// setWatch(function(e){
//     var isLong = (e.time-e.lastTime) > 2.0;
//     if(isLong) {
//         switchCycle();
//     }
// }, BTN1, {repeat:true, debounce:50, edge:"falling"});

// init the app
init();

// Show launcher when middle button pressed
setWatch(showLauncher, BTN2, {repeat:false,edge:"falling"});
