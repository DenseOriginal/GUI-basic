/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Button = void 0;
var Button = /** @class */ (function () {
    function Button(x, y, text, backgroundColor, clickedColor, textColor) {
        if (text === void 0) { text = ""; }
        if (backgroundColor === void 0) { backgroundColor = color(175); }
        if (clickedColor === void 0) { clickedColor = color(130); }
        if (textColor === void 0) { textColor = color(0); }
        this.x = x;
        this.y = y;
        this.text = text;
        this.backgroundColor = backgroundColor;
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
        this.draw(width, height);
    };
    Button.prototype.draw = function (width, height) {
        push();
        translate(this.x, this.y);
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        textSize(this.textSize);
        noStroke();
        fill(this.isClicked ? this.clickedColor : this.backgroundColor);
        rect(0, 0, width, height);
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
var button;
window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    button = new button_1.Button(100, 100, 'Hello');
    button.textSize = 24;
    button.onClick = function () { return console.log('onClick'); };
    button.onHover = function () { return console.log('onHover'); };
    button.onRelease = function () { return console.log('onRelease'); };
    button.onPressed = function () { return console.log('onPressed'); };
};
window.draw = function () {
    background(255);
    button.live();
};

})();

/******/ })()
;