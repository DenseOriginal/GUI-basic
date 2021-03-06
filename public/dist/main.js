/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Button = void 0;
var Button = /** @class */ (function () {
    function Button(x, y, text, cornerRounding, backgroundColor, hoverWeight, clickedColor, textColor) {
        if (text === void 0) { text = ""; }
        if (cornerRounding === void 0) { cornerRounding = 0; }
        if (backgroundColor === void 0) { backgroundColor = color(175); }
        if (hoverWeight === void 0) { hoverWeight = 0.1; }
        if (clickedColor === void 0) { clickedColor = color(200); }
        if (textColor === void 0) { textColor = color(0); }
        this.x = x;
        this.y = y;
        this.text = text;
        this.cornerRounding = cornerRounding;
        this.backgroundColor = backgroundColor;
        this.hoverWeight = hoverWeight;
        this.clickedColor = clickedColor;
        this.textColor = textColor;
        this._isClicked = false;
        this._isHovering = false;
        this.onClick = function () { };
        this.onHover = function () { };
        this.onRelease = function () { };
        this.onPressed = function () { };
        this.paddingWidth = 8;
        this.paddingHeight = 4;
        this.textSize = 12;
        this.width = 0;
        this.height = 0;
    }
    Object.defineProperty(Button.prototype, "isClicked", {
        get: function () { return this._isClicked; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Button.prototype, "isHovering", {
        get: function () { return this._isHovering; },
        enumerable: false,
        configurable: true
    });
    ;
    Button.prototype.live = function () {
        push();
        textSize(this.textSize);
        var width = this.width || textWidth(this.text) + this.paddingWidth * 2;
        var height = this.height || (max(textAscent(), textDescent()) * 0.5 + this.paddingHeight) * 2;
        pop();
        var tempIsMouseHovering = this.isMouseOver(width, height);
        var tempIsClicked = tempIsMouseHovering && mouseIsPressed;
        // Button has just been clicked
        if (!this.isClicked && tempIsClicked) {
            this._onClick();
        }
        // Button has just been released
        if (this.isClicked && !tempIsClicked) {
            this._onRelease();
        }
        // Mouse hover and not clicked
        if (tempIsMouseHovering && !mouseIsPressed) {
            this._onHover();
        }
        // Mouse is pressed
        if (tempIsClicked) {
            this._onPressed();
        }
        this._isClicked = tempIsClicked;
        this._isHovering = tempIsMouseHovering;
        this.draw(width, height, this.cornerRounding);
    };
    Button.prototype.draw = function (width, height, cornerRounding) {
        push();
        translate(this.x, this.y);
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        textSize(this.textSize);
        noStroke();
        fill(this.isClicked ? lerpColor(this.backgroundColor, this.clickedColor, 0.4) : (this.isHovering ? lerpColor(this.backgroundColor, color(0), this.hoverWeight) : this.backgroundColor));
        rect(0, 0, width, height, this.cornerRounding);
        fill(this.textColor);
        text(this.text, 0, 0);
        pop();
    };
    Button.prototype.isMouseOver = function (width, height) {
        return (mouseX > this.x - (width / 2) &&
            mouseX < this.x + (width / 2) &&
            mouseY > this.y - (height / 2) &&
            mouseY < this.y + (height / 2));
    };
    Button.prototype._onClick = function () {
        this.onClick();
    };
    Button.prototype._onHover = function () {
        this.onHover();
    };
    Button.prototype._onRelease = function () {
        this.onRelease();
    };
    Button.prototype._onPressed = function () {
        this.onPressed();
    };
    return Button;
}());
exports.Button = Button;


/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports) {


var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.takeScreenshot = exports.drawSketchpad = exports.config = exports.Tool = exports.canvasHeight = exports.canvasWidth = void 0;
var brushStrokes = [];
var redoStack = [];
exports.canvasWidth = 1200;
exports.canvasHeight = 722;
var newBrushStroke = undefined;
var prevMouseDown = false;
var minLengthBetweenPoint = 2;
var audioElement = document.getElementById('sketch_sound');
var targetAudioVolume = 1;
var Tool;
(function (Tool) {
    Tool[Tool["PEN"] = 0] = "PEN";
    Tool[Tool["ERASER"] = 1] = "ERASER";
    Tool[Tool["MARKER"] = 2] = "MARKER";
})(Tool = exports.Tool || (exports.Tool = {}));
exports.config = {
    thickness: 5,
    color: '#000000',
    activeTool: Tool.PEN
};
function drawSketchpad() {
    // drawPreviousStrokes();
    // If the mouse is clicked, but wasn't in the last frame
    // Then we can start a new line
    if (mouseIsPressed && !prevMouseDown && isMouseInsideSketchpad()) {
        // Reset the sketching sound back to the beggining, and play it
        audioElement.currentTime = 0;
        audioElement.play();
        // If the active tool is the Eraser then only do white color
        var colorToUse = color(exports.config.activeTool == Tool.ERASER ? '#ffffff' : exports.config.color);
        // If the activeTool is a marker, then make it slightly transparent
        if (exports.config.activeTool == Tool.MARKER)
            colorToUse.setAlpha(150);
        newBrushStroke = {
            color: colorToUse,
            thickness: exports.config.thickness,
            // Create the new brush stroke, with a basic line
            // Because we use the endpoint from the prev line, to create a new line
            lines: [{ start: pointFromMouse(), end: pointFromMouse() }]
        };
        // We also need to clear the redoStack, since we can't merge the two different histories
        redoStack.length = 0;
    }
    // If the mouse isn't clicked, but it was in the last from
    // The the mouse has been released, and we can end the line
    if (!mouseIsPressed && prevMouseDown) {
        // Stop playing the sketching sound when not drawing
        audioElement.pause();
        // Push the new brushStroke to the brushStrokes array
        // But only if newBrushStrokes isn't undefined
        if (newBrushStroke)
            brushStrokes.push(newBrushStroke);
        // And then set newBrushStroke to undefined
        newBrushStroke = undefined;
    }
    // If the mouse is pressed, and it was in the last frame, we can create line segments
    // In the brushStroke
    // Only do stuff if we have initiated a newBrushStroke
    if (mouseIsPressed && prevMouseDown && newBrushStroke) {
        // Use the last point in the brushStroke as the start of this new line
        var lastPoint = newBrushStroke.lines[(newBrushStroke === null || newBrushStroke === void 0 ? void 0 : newBrushStroke.lines.length) - 1].end;
        var newLine = {
            start: lastPoint,
            end: pointFromMouse(),
        };
        // Only add the new Line if distance to the last line, is grater than to pixels
        var deltaX = lastPoint.x - newLine.end.x;
        var deltaY = lastPoint.y - newLine.end.y;
        var distanceSqr = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
        if (distanceSqr > Math.pow(minLengthBetweenPoint, 2))
            newBrushStroke === null || newBrushStroke === void 0 ? void 0 : newBrushStroke.lines.push(newLine);
        // Then draw the temporary stroke
        drawPreviousStrokes(newBrushStroke);
        var audioVolume = map(Math.pow(distanceSqr, 0.5), 0, 170, 0, 1, true);
        targetAudioVolume = audioVolume;
        audioElement.volume += (targetAudioVolume - audioElement.volume) / 5;
    }
    // Update the prevMouseDown variable
    prevMouseDown = mouseIsPressed;
}
exports.drawSketchpad = drawSketchpad;
function drawPreviousStrokes(strokeToDraw) {
    // Draw a sudo background
    // But only if we're drawing all the line
    push();
    fill(255);
    if (!strokeToDraw)
        rect(0, 0, exports.canvasWidth, exports.canvasHeight);
    pop();
    // Draw the strokeToDraw
    // If it isn't provided then
    // Draw all the brush strokes
    // Including the newBrushStroke if it exist
    var strokesToDraw = strokeToDraw ? [strokeToDraw] :
        newBrushStroke ? __spreadArrays(brushStrokes, [newBrushStroke]) : brushStrokes;
    for (var _i = 0, strokesToDraw_1 = strokesToDraw; _i < strokesToDraw_1.length; _i++) {
        var brushStroke = strokesToDraw_1[_i];
        push();
        stroke(brushStroke.color); // IDFK whats going on here, stroke accepts both Color and string, but typescript is being a bitch when it sees a type of Color
        strokeWeight(brushStroke.thickness);
        noFill();
        // Use the name line_ as because line is reserved for the 'line' function
        beginShape();
        for (var _a = 0, _b = brushStroke.lines; _a < _b.length; _a++) {
            var line_ = _b[_a];
            vertex(line_.start.x, line_.start.y);
        }
        // Remmeber to draw the end point of the last line
        var _c = brushStroke.lines[brushStroke.lines.length - 1].end, endX = _c.x, endY = _c.y;
        vertex(endX, endY);
        endShape();
        pop();
    }
}
// Check to see if the user pressed CTRL + Z
// If they did, then we can undo the last stroke
document.addEventListener('keydown', function (e) {
    if (e.key === 'z' && e.ctrlKey)
        undo();
    if (e.key === 'y' && e.ctrlKey)
        redo();
});
function undo() {
    // If there is no brushStrokes, then we can't undo
    var strokeToUndo = brushStrokes.pop();
    if (strokeToUndo)
        redoStack.push(strokeToUndo);
    // Redraw the strokes
    drawPreviousStrokes();
}
function redo() {
    // If there is no redoStack, then we can't redo
    var strokeToRedo = redoStack.pop();
    if (strokeToRedo)
        brushStrokes.push(strokeToRedo);
    // Redraw the strokes
    drawPreviousStrokes();
}
function takeScreenshot() {
    var graphics = createGraphics(exports.canvasWidth, exports.canvasHeight);
    graphics.background(255);
    // Draw all the strokes to the off screen graphic
    for (var _i = 0, brushStrokes_1 = brushStrokes; _i < brushStrokes_1.length; _i++) {
        var brushStroke = brushStrokes_1[_i];
        graphics.stroke(brushStroke.color); // IDFK whats going on here, stroke accepts both Color and string, but typescript is being a bitch when it sees a type of Color
        graphics.strokeWeight(brushStroke.thickness);
        graphics.noFill();
        // Use the name line_ as because line is reserved for the 'line' function
        graphics.beginShape();
        for (var _a = 0, _b = brushStroke.lines; _a < _b.length; _a++) {
            var line_ = _b[_a];
            graphics.vertex(line_.start.x, line_.start.y);
        }
        // Remmeber to draw the end point of the last line
        var _c = brushStroke.lines[brushStroke.lines.length - 1].end, endX = _c.x, endY = _c.y;
        graphics.vertex(endX, endY);
        graphics.endShape();
    }
    graphics.save('VeryCoolSketch.jpg');
}
exports.takeScreenshot = takeScreenshot;
// Helper to make sure mouse is inside sketchpad
function isMouseInsideSketchpad() {
    return mouseX >= 0 && mouseX <= exports.canvasWidth &&
        mouseY >= 0 && mouseY <= exports.canvasHeight;
}
// Helper, to write DRY code
function pointFromMouse() {
    return {
        x: min(mouseX, exports.canvasWidth),
        y: min(mouseY, exports.canvasHeight),
    };
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/// <reference path="../node_modules/@types/p5/global.d.ts"/>
Object.defineProperty(exports, "__esModule", ({ value: true }));
var button_1 = __webpack_require__(1);
var paint_1 = __webpack_require__(2);
var increaseButton;
var decreaseButton;
var eraserButton;
var penButton;
var markerButton;
var exportButton;
var colorButton;
window.setup = function () {
    var canvas = createCanvas(1368, 722);
    canvas.parent('container');
    increaseButton = new button_1.Button(width - 70, 35, '+', 5);
    increaseButton.textSize = 24;
    increaseButton.onClick = function () { return paint_1.config.thickness++; };
    decreaseButton = new button_1.Button(width - 35, 35, '-', 5);
    decreaseButton.textSize = 24;
    decreaseButton.onClick = function () { return paint_1.config.thickness = max(1, paint_1.config.thickness - 1); }; // thickness kan ikke v??re mindre end 1
    eraserButton = new button_1.Button(width - 45, 85, "Eraser");
    eraserButton.width = 80;
    eraserButton.backgroundColor = color(255);
    eraserButton.textSize = 18;
    eraserButton.onClick = function () { return paint_1.config.activeTool = paint_1.Tool.ERASER; };
    penButton = new button_1.Button(width - 45, 115, "Pen");
    penButton.width = 80;
    penButton.backgroundColor = color(255);
    penButton.textSize = 18;
    penButton.onClick = function () { return paint_1.config.activeTool = paint_1.Tool.PEN; };
    markerButton = new button_1.Button(width - 45, 145, "Marker");
    markerButton.width = 80;
    markerButton.backgroundColor = color(255);
    markerButton.textSize = 18;
    markerButton.onClick = function () { return paint_1.config.activeTool = paint_1.Tool.MARKER; };
    colorButton = createColorPicker()
        .size(29.5, 29.5)
        .parent('container') // We need to parent this to the container, so that we can position it relative to the canvas
        .position(width - 85, 162)
        .style('width', '80px');
    colorButton.elt.addEventListener('change', function () {
        // P5 is dumb, because they made a generic element type for all inputs, and just set the return type
        // Of the value function to ()string | number) but a colorPicker only returns a string
        paint_1.config.color = colorButton.value();
    });
    exportButton = new button_1.Button(width - 45, 270, "Export");
    exportButton.width = 90;
    exportButton.backgroundColor = color(255);
    exportButton.textSize = 18;
    exportButton.onClick = function () { return paint_1.takeScreenshot(); };
    background(255);
};
window.draw = function () {
    paint_1.drawSketchpad();
    push();
    fill(200);
    noStroke();
    rect(paint_1.canvasWidth, 0, width, height);
    pop();
    push();
    fill(210);
    noStroke();
    rect(width - 90, 65, width, 170);
    pop();
    // Draw the current thickness to the left of the thickness buttons
    textSize(16);
    textAlign(CENTER, CENTER);
    text(paint_1.config.thickness, width - 110, 35);
    // Draw the active tool
    var tool = paint_1.config.activeTool == paint_1.Tool.PEN ? 'Pen' :
        paint_1.config.activeTool == paint_1.Tool.ERASER ? 'Eraser' :
            paint_1.config.activeTool == paint_1.Tool.MARKER ? 'Marker' : '';
    text(tool, width - 45, 215);
    decreaseButton.live();
    increaseButton.live();
    eraserButton.live();
    penButton.live();
    markerButton.live();
    exportButton.live();
    // Credits
    textAlign(RIGHT, BOTTOM);
    text('Lavet af\nAnders og Rasmus', width - 5, height - 5);
};

})();

/******/ })()
;