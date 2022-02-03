/// <reference path="../node_modules/@types/p5/global.d.ts"/>

import { Button } from "./GUI/button";
import { config, drawSketchpad } from "./paint";

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
	increaseButton.onClick = () => config.thickness++;

	decreaseButton = new Button(width-35, 35, '-', 5)
	decreaseButton.textSize = 24;
	decreaseButton.onClick = () => config.thickness = max(1, config.thickness - 1); // thickness kan ikke være mindre end 1

	eraserButton = new Button(width-25, 85, "  ")
	eraserButton.backgroundColor = color(255);
	eraserButton.textSize = 24;
	eraserButton.onClick = () => console.log('change colour white');

	redButton = new Button(width-25, 125, "  ")
	redButton.backgroundColor = color(255,0,0)
	redButton.textSize = 24;
	redButton.onClick = () => console.log('change colour red');

	greenButton = new Button(width-25, 165, "  ")
	greenButton.backgroundColor = color(0,255,0)
	greenButton.textSize = 24;
	greenButton.onClick = () => console.log('change colour green');

	blueButton = new Button(width-25, 205, "  ")
	blueButton.backgroundColor = color(0,0,255)
	blueButton.textSize = 24;
	blueButton.onClick = () => console.log('change colour blue');
}

(window as any).draw = () => {

	push();
	fill(200);
	noStroke();
	rect(width-478,0,width, height);
	pop();

	drawSketchpad();

	// Draw the current thickness to the left of the thickness buttons
	textSize(16);
	textAlign(CENTER, CENTER);
	text(config.thickness, width-110, 35);

	decreaseButton.live();
	increaseButton.live();

	push();
	fill(210);
	noStroke();
	rect(width-50, 60, width, 170)
	pop();
	eraserButton.live();
	redButton.live();
	greenButton.live();
	blueButton.live();
}
