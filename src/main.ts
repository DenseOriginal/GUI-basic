/// <reference path="../node_modules/@types/p5/global.d.ts"/>

import { Button } from "./GUI/button";
import { drawSketchpad } from "./paint";

let increaseButton: Button;
let decreaseButton: Button;
let eraserButton: Button;
let redButton: Button;
let greenButton: Button;
let blueButton: Button;

(window as any).setup = () => {
	createCanvas(1368, 722);

	background(255);

	increaseButton = new Button(width-70, 35, '+', 5);
	increaseButton.textSize = 24;
	increaseButton.onClick = () => console.log('increase brush size');

	decreaseButton = new Button(width-35, 35, '-', 5)
	decreaseButton.textSize = 24;
	decreaseButton.onClick = () => console.log('decrease brush size');

	eraserButton = new Button(width-145, 85, "  ")
	eraserButton.backgroundColor = color(255);
	eraserButton.textSize = 24;

	redButton = new Button(width-105, 85, "  ")
	redButton.backgroundColor = color(255,0,0)
	redButton.textSize = 24;

	greenButton = new Button(width-65, 85, "  ")
	greenButton.backgroundColor = color(0,255,0)
	greenButton.textSize = 24;

	blueButton = new Button(width-25, 85, "  ")
	blueButton.backgroundColor = color(0,0,255)
	blueButton.textSize = 24;
}

(window as any).draw = () => {

	push();
	fill(200);
	noStroke();
	rect(width-478,0,width, height);
	pop();

	drawSketchpad();

	decreaseButton.live();
	increaseButton.live();

	eraserButton.live();
	redButton.live();
	greenButton.live();
	blueButton.live();
}
