var bufBG = Graphics.createArrayBuffer(240,210,1,{msb:true});
var bufMain = Graphics.createArrayBuffer(240,210,1,{msb:true});
var bufHeighlight = Graphics.createArrayBuffer(240,210,1,{msb:true});

var colBG = {"R": 0.3, "G": 0.3, "B": 0.3};
var colMain = {"R": 0.8, "G": 1.0, "B": 0.8};
var colHeighlight = {"R": 1.0, "G": 1.0, "B": 1.0};

exports.flip = function () {
    g.setColor(colBG.R, colBG.G, colBG.B);
    //g.drawImage({width:bufBG.getWidth(),
    //             height:bufBG.getHeight(),
    //             buffer:bufBG.buffer},0,30);
    g.setColor(colMain.R, colMain.G, colMain.B);
    g.drawImage({width:bufMain.getWidth(),
                 height:bufMain.getHeight(),
                 buffer:bufMain.buffer,
                 transparent: 0},0,30);
    g.setColor(colHeighlight.R, colHeighlight.G, colHeighlight.B);
    //g.drawImage({width:bufHeighlight.getWidth(),
    //             height:bufHeighlight.getHeight(),
    //             buffer:bufHeighlight.buffer,
    //             transparent: 0},0,30);
    g.flip();
}

exports.clear = function () {
    bufBG.clear();
    bufMain.clear();
    bufHeighlight.clear();
}

exports.bufBG = bufBG;
exports.bufMain = bufMain;
exports.bufHeighlight = bufHeighlight;
