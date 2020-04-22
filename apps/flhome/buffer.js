// var bufBG = Graphics.createArrayBuffer(240,210,1,{msb:true});
// var bufMain = Graphics.createArrayBuffer(240,210,1,{msb:true});
// var bufHeighlight = Graphics.createArrayBuffer(240,210,1,{msb:true});

var buf = Graphics.createArrayBuffer(240,210,2,{msb:true});
// var palette = new Uint16Array([0, 0x6B6D, 0xAFFB, 0xFFFF]);
var colorSchemes = [];
colorSchemes.push(new Uint16Array([0, 0x4AE7, 0x7681, 0xFFFF]));
colorSchemes.push(new Uint16Array([0, 0x8A08, 0xE861, 0xFFFF]));
colorSchemes.push(new Uint16Array([0, 0x3169, 0x38D4, 0xFFFF]));
var palette = colorSchemes[0];

exports.setColorScheme = function(index) {
    palette = colorSchemes[index % colorSchemes.length];
}

// var colBG = {"R": 0.3, "G": 0.3, "B": 0.3};
// var colMain = {"R": 0.8, "G": 1.0, "B": 0.8};
// var colHeighlight = {"R": 1.0, "G": 1.0, "B": 1.0};

exports.flip = function () {
//     g.setColor(colBG.R, colBG.G, colBG.B);
//     g.drawImage({width:bufBG.getWidth(),
//                  height:bufBG.getHeight(),
//                  buffer:bufBG.buffer},0,30);
//     g.setColor(colMain.R, colMain.G, colMain.B);
//     g.drawImage({width:bufMain.getWidth(),
//                  height:bufMain.getHeight(),
//                  buffer:bufMain.buffer,
//                  transparent: 0},0,30);
//     g.setColor(colHeighlight.R, colHeighlight.G, colHeighlight.B);
//     g.drawImage({width:bufHeighlight.getWidth(),
//                  height:bufHeighlight.getHeight(),
//                  buffer:bufHeighlight.buffer,
//                  transparent: 0},0,30);
    g.drawImage({width:buf.getWidth(),
                 height:buf.getHeight(),
                 buffer:buf.buffer,
                 palette:palette,
                 bpp:2},0,30);
}

exports.clear = function () {
    buf.clear();
//     bufBG.clear();
//     bufMain.clear();
//     bufHeighlight.clear();
}

exports.buf = buf;

// exports.bufBG = bufBG;
// exports.bufMain = bufMain;
// exports.bufHeighlight = bufHeighlight;
