/// <reference path="../node_modules/@types/p5/global.d.ts"/>

import { Element } from "p5";
import { Button } from "./GUI/button";
import { canvasWidth, config, drawSketchpad, takeScreenshot, Tool } from "./paint";

let increaseButton: Button;
let decreaseButton: Button;
let eraserButton: Button;
let penButton: Button;
let markerButton: Button;
let exportButton: Button;
let colorButton: Element;

(window as any).setup = () => {
	const canvas = createCanvas(1368, 722);
	canvas.parent('container');

	increaseButton = new Button(width-70, 35, '+', 5);
	increaseButton.textSize = 24;
	increaseButton.onClick = () => config.thickness++;

	decreaseButton = new Button(width-35, 35, '-', 5)
	decreaseButton.textSize = 24;
	decreaseButton.onClick = () => config.thickness = max(1, config.thickness - 1); // thickness kan ikke være mindre end 1

	eraserButton = new Button(width-45, 85, "Eraser")
	eraserButton.width = 80;
	eraserButton.backgroundColor = color(255);
	eraserButton.textSize = 18;
	eraserButton.onClick = () => config.activeTool = Tool.ERASER;

	penButton = new Button(width-45, 115, "Pen")
	penButton.width = 80;
	penButton.backgroundColor = color(255);
	penButton.textSize = 18;
	penButton.onClick = () => config.activeTool = Tool.PEN;

	markerButton = new Button(width-45, 145, "Marker")
	markerButton.width = 80;
	markerButton.backgroundColor = color(255);
	markerButton.textSize = 18;
	markerButton.onClick = () => config.activeTool = Tool.MARKER;

	colorButton = createColorPicker()
		.size(29.5, 29.5)
		.parent('container') // We need to parent this to the container, so that we can position it relative to the canvas
		.position(width-85, 162)
		.style('width', '80px');
	(colorButton.elt as HTMLInputElement).addEventListener('change', () => {
		// P5 is dumb, because they made a generic element type for all inputs, and just set the return type
		// Of the value function to ()string | number) but a colorPicker only returns a string
		config.color = colorButton.value() as string;
	});

	exportButton = new Button(width-45, 270, "Export")
	exportButton.width = 90;
	exportButton.backgroundColor = color(255);
	exportButton.textSize = 18;
	exportButton.onClick = () => takeScreenshot();
}

(window as any).draw = () => {
	// We need to clear the background
	// Otherwise CTRL+Z will not work
	background(255);
	drawSketchpad();

	
	
	push();
	fill(200);
	noStroke();
	rect(canvasWidth,0,width, height);
	pop();

	push();
	fill(210);
	noStroke();
	rect(width-90, 65, width, 170)
	pop();

	// Draw the current thickness to the left of the thickness buttons
	textSize(16);
	textAlign(CENTER, CENTER);
	text(config.thickness, width-110, 35);

	// Draw the active tool
	const tool = config.activeTool == Tool.PEN ? 'Pen' :
							 config.activeTool == Tool.ERASER ? 'Eraser' :
							 config.activeTool == Tool.MARKER ? 'Marker' : ''
	text(tool, width-45, 215);

	decreaseButton.live();
	increaseButton.live();
	
	eraserButton.live();
	penButton.live();
	markerButton.live();

	exportButton.live();

	// Credits
	textAlign(RIGHT, BOTTOM);
	text('Lavet af\nAnders og Rasmus', width-5, height-5);
}
