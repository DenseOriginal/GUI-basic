/// <reference path="../node_modules/@types/p5/global.d.ts"/>

import { Element } from "p5";
import { Button } from "./GUI/button";
import { config, drawSketchpad, Tool } from "./paint";

let increaseButton: Button;
let decreaseButton: Button;
let eraserButton: Button;
let penButton: Button;
let colorButton: Element;
// let redButton: Button;
// let greenButton: Button;
// let blueButton: Button;

(window as any).setup = () => {
	const canvas = createCanvas(1368, 722);
	canvas.parent('container');

	increaseButton = new Button(width-70, 35, '+', 5);
	increaseButton.textSize = 24;
	increaseButton.onClick = () => config.thickness++;

	decreaseButton = new Button(width-35, 35, '-', 5)
	decreaseButton.textSize = 24;
	decreaseButton.onClick = () => config.thickness = max(1, config.thickness - 1); // thickness kan ikke være mindre end 1

	eraserButton = new Button(width-25, 85, "Eraser")
	eraserButton.backgroundColor = color(255);
	eraserButton.textSize = 18;
	eraserButton.onClick = () => config.activeTool = Tool.ERASER;

	penButton = new Button(width-25, 115, "Pen")
	penButton.backgroundColor = color(255);
	penButton.textSize = 18;
	penButton.onClick = () => config.activeTool = Tool.PEN;

	colorButton = createColorPicker()
		.size(29.5, 29.5)
		.parent('container') // We need to parent this to the container, so that we can position it relative to the canvas
		.position(width-39.5, 135);
	(colorButton.elt as HTMLInputElement).addEventListener('change', () => {
		// P5 is dumb, because they made a generic element type for all inputs, and just set the return type
		// Of the value function to ()string | number) but a colorPicker only returns a string
		config.color = colorButton.value() as string;
	});

	// redButton = new Button(width-25, 125, "  ")
	// redButton.backgroundColor = color(255,0,0)
	// redButton.textSize = 24;
	// redButton.onClick = () => console.log('change colour red');

	// greenButton = new Button(width-25, 165, "  ")
	// greenButton.backgroundColor = color(0,255,0)
	// greenButton.textSize = 24;
	// greenButton.onClick = () => console.log('change colour green');

	// blueButton = new Button(width-25, 205, "  ")
	// blueButton.backgroundColor = color(0,0,255)
	// blueButton.textSize = 24;
	// blueButton.onClick = () => console.log('change colour blue');
}

(window as any).draw = () => {
	// We need to clear the background
	// Otherwise CTRL+Z will not work
	background(255);

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

	// Draw the active tool
	textAlign(RIGHT, CENTER);
	const tool = config.activeTool == Tool.PEN ? 'Pen' :
							 config.activeTool == Tool.ERASER ? 'Eraser' : ''
	text(tool, width-5, 250);

	decreaseButton.live();
	increaseButton.live();

	push();
	fill(210);
	noStroke();
	rect(width-50, 60, width, 170)
	pop();

	eraserButton.live();
	penButton.live();
	// redButton.live();
	// greenButton.live();
	// blueButton.live();
}
