# DDD

Link til [programmet](https://htxprog.netlify.app/gui-basic/public/ "Programmet")

## DESIGN (D1)

### Flowchart af overordnet program

![DesignFlowChart](DesignFlowChart.png)

### Pseudo-kode af umiddelbare knap klasse og test implementation

```js
class knap () {
    constructor(x,y,w,h text) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
    }

    opdaterKnap() {
        rect(this.x,this.y,this.x+this.w,this.y+this.h);
        text(this.x,this.y,this.text)
    }
}

setup() {
    nyKnap = new knap(100,100,"hej");
}
draw() {
    nyKnap.opdaterKnap();
}
```

### Udviklings process
https://github.com/DenseOriginal/GUI-basic/projects/1
![Agile Scrum](agile-scrum.png)

## DOKUMENTATION (D2)

Flowchart der beskriver macro delen af hvordan vi tegner og opretter linjerne på skærmen.
![BrushStrokeFlowChart](BrushStrokeFlowChart.png)


### Funktions beskrivelse af button.isMouseOver()
button.isMouseOver tager to argumenter:
`width` og `height` som er bredden og højden af knappen
Funktionen bruger så henholdsvist musens x og y (`mouseX` og `mouseY`) til at kontrollere om musen befinder sig indenfor området med udgangspunkt i centrum.

Den returnerer resultatet af logikken som boolean
```ts
  private isMouseOver(width: number, height: number): boolean {
    return (
      mouseX > this.x - (width / 2) &&
      mouseX < this.x + (width / 2) &&
      mouseY > this.y - (height / 2) &&
      mouseY < this.y + (height / 2)
    );
  }
```
### Knap klassen
Knap klassen laver en firkant med tekst, der registrer om der holdes over den, eller klikkes på den og ændrer farve hensigtsmæssigt, samt aktualiserer funktionen af den enkelte instans

### Klasse diagram over knap klassen

```ts
class Button {
private _isClicked: boolean;
  public get isClicked(): boolean;
  private _isHovering: boolean;
  public get isHovering(): boolean;
  public onClick: Function;
  public onHover: Function;
  public onRelease: Function;
  public onPressed: Function;

  public paddingWidth: number;
  public paddingHeight: number;
  public textSize: number;
  public width: number;
  public height: number;

  constructor(
    public x: number,
    public y: number,
    public text?: string,
    public cornerRounding?: number,
    public backgroundColor?: Color,
    public hoverWeight?: number,
    public clickedColor?: Color,
    public textColor?: Color,
  ) { }

  public live(): void
  private draw(width: number, height: number, cornerRounding: number): void
  private isMouseOver(width: number, height: number): boolean
  
  private _onClick(): void
  private _onHover(): void
  private _onRelease(): void
  private _onPressed(): void
}
```

### Pseudo kode over hvordan man tegner linjer

```txt
Kør denne funktion hvert frame
    Tegn alle tidligere streger

    Hvis: Musen er trykket ned & Musen er indenfor tegne området
        Find den farve som stregen skal tegnes med
        
        Opret en midlertidigt streg, med den nuværende farve og tykkelse

    Hvis: Musen lige er blevet løftet
        Så skub den midlertidige streg til brushStrokes, så at den kan blive gemt

    Hvis: Musen er klikket & bliver trukket rundt på skærmen & Musen har    rykket sig mere end 2 pixels
        Tilføj musens punkt til den midlertige streg
```

## DELING (D3)

Link til sourcecode: [https://github.com/DenseOriginal/GUI-basic](https://github.com/DenseOriginal/GUI-basic)
![Agile Scrum](agile-scrum.png)

## Bilag

`main.ts`

```ts
/// <reference path="../node_modules/@types/p5/global.d.ts"/>

import { Element } from "p5";
import { Button } from "./GUI/button";
import { canvasWidth, config, drawSketchpad, Tool } from "./paint";

let increaseButton: Button;
let decreaseButton: Button;
let eraserButton: Button;
let penButton: Button;
let markerButton: Button;
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

	// Credits
	textAlign(RIGHT, BOTTOM);
	text('Lavet af\nAnders og Rasmus', width-5, height-5);
}
```

`paint.ts`

```ts
import { Color } from "p5";

type Point = { x: number, y: number };
type Line = { start: Point, end: Point };
type BrushStroke = { color: Color | string, thickness: number, lines: Array<Line> };

const brushStrokes: Array<BrushStroke> = [];
const redoStack: Array<BrushStroke> = [];
export const canvasWidth = 1200;
export const canvasHeight = 722;
let newBrushStroke: undefined | BrushStroke = undefined;
let prevMouseDown: boolean = false;
const minLengthBetweenPoint = 2;

export enum Tool {
  PEN,
  ERASER,
  MARKER,
}
export const config = {
  thickness: 5,
  color: '#000000',
  activeTool: Tool.PEN
}

export function drawSketchpad() {
  drawPreviousStrokes();

  // If the mouse is clicked, but wasn't in the last frame
  // Then we can start a new line
  if(mouseIsPressed && !prevMouseDown && isMouseInsideSketchpad()) {
    // If the active tool is the Eraser then only do white color
    const colorToUse = color(config.activeTool == Tool.ERASER ? '#ffffff' : config.color);

    // If the activeTool is a marker, then make it slightly transparent
    if(config.activeTool == Tool.MARKER) colorToUse.setAlpha(150);

    newBrushStroke = {
      color: colorToUse,
      thickness: config.thickness,
      // Create the new brush stroke, with a basic line
      // Because we use the endpoint from the prev line, to create a new line
      lines: [ { start: pointFromMouse(), end: pointFromMouse() } ]
    };

    // We also need to clear the redoStack, since we can't merge the two different histories
    redoStack.length = 0;
  }

  // If the mouse isn't clicked, but it was in the last from
  // The the mouse has been released, and we can end the line
  if(!mouseIsPressed && prevMouseDown) {
    // Push the new brushStroke to the brushStrokes array
    // But only if newBrushStrokes isn't undefined
    if(newBrushStroke) brushStrokes.push(newBrushStroke);

    // And then set newBrushStroke to undefined
    newBrushStroke = undefined;
  }

  // If the mouse is pressed, and it was in the last frame, we can create line segments
  // In the brushStroke
  // Only do stuff if we have initiated a newBrushStroke
  if(mouseIsPressed && prevMouseDown && newBrushStroke) {
    // Use the last point in the brushStroke as the start of this new line
    const lastPoint = newBrushStroke.lines[newBrushStroke?.lines.length - 1].end;
    const newLine: Line = {
      start: lastPoint,
      end: pointFromMouse(),
    };

    // Only add the new Line if distance to the last line, is grater than to pixels
    const deltaX = lastPoint.x - newLine.end.x;
    const deltaY = lastPoint.y - newLine.end.y;
    const distanceSqr = deltaX**2 + deltaY**2;
    if(distanceSqr > minLengthBetweenPoint ** 2) newBrushStroke?.lines.push(newLine);
  }

  // Update the prevMouseDown variable
  prevMouseDown = mouseIsPressed;
}

function drawPreviousStrokes() {
  // Draw all the brush strokes
  // Including the newBrushStroke if it exist
  const strokesToDraw = newBrushStroke ? [...brushStrokes, newBrushStroke] : brushStrokes;
  for(const brushStroke of strokesToDraw) {
    push();
    stroke(brushStroke.color as string); // IDFK whats going on here, stroke accepts both Color and string, but typescript is being a bitch when it sees a type of Color
    strokeWeight(brushStroke.thickness);
    noFill();

    // Use the name line_ as because line is reserved for the 'line' function
    beginShape();
    for(const line_ of brushStroke.lines) {

      vertex(
        line_.start.x,
        line_.start.y,
      );
    }

    // Remmeber to draw the end point of the last line
    const { x: endX, y: endY } = brushStroke.lines[brushStroke.lines.length - 1].end;
    vertex(
      endX,
      endY
    );
    
    endShape();
    pop();
  }
}

// Check to see if the user pressed CTRL + Z
// If they did, then we can undo the last stroke
document.addEventListener('keydown', (e) => {
  if(e.key === 'z' && e.ctrlKey) undo();
  if(e.key === 'y' && e.ctrlKey) redo();
});

function undo() {
  // If there is no brushStrokes, then we can't undo
  const strokeToUndo = brushStrokes.pop();
  if(strokeToUndo) redoStack.push(strokeToUndo);
}

function redo() {
  // If there is no redoStack, then we can't redo
  const strokeToRedo = redoStack.pop();
  if(strokeToRedo) brushStrokes.push(strokeToRedo);
}

// Helper to make sure mouse is inside sketchpad
function isMouseInsideSketchpad() {
  return mouseX >= 0 && mouseX <= canvasWidth &&
    mouseY >= 0 && mouseY <= canvasHeight;
}

// Helper, to write DRY code
function pointFromMouse(): Point {
  return {
    x: min(mouseX, canvasWidth),
    y: min(mouseY, canvasHeight),
  }
}
```

`GUI/button.ts`

```ts
import { Color } from "p5";

export class Button {
  private _isClicked: boolean = false;
  public get isClicked(): boolean { return this._isClicked };
  private _isHovering: boolean = false;
  public get isHovering(): boolean { return this._isHovering };
  public onClick: Function = () => {};
  public onHover: Function = () => {};
  public onRelease: Function = () => {};
  public onPressed: Function = () => {};

  public paddingWidth = 8;
  public paddingHeight = 4;
  public textSize = 12;
  public width: number = 0;
  public height: number = 0;

  constructor(
    public x: number,
    public y: number,
    public text: string = "",
    public cornerRounding: number = 0,
    public backgroundColor: Color = color(175),
    public hoverWeight: number = 0.1,
    public clickedColor: Color = color(200),
    public textColor: Color = color(0),
  ) { }

  public live(): void {
    push();
    textSize(this.textSize);
    const width = this.width || textWidth(this.text) + this.paddingWidth * 2;
    const height = this.height || (max(textAscent(), textDescent()) * 0.5 + this.paddingHeight) * 2;
    pop();

    const tempIsMouseHovering = this.isMouseOver(width, height);
    const tempIsClicked = tempIsMouseHovering && mouseIsPressed;
    
    // Button has just been clicked
    if(!this.isClicked && tempIsClicked) {
      this._onClick();
    }

    // Button has just been released
    if(this.isClicked && !tempIsClicked) {
      this._onRelease();
    }

    // Mouse hover and not clicked
    if(tempIsMouseHovering && !mouseIsPressed) {
      this._onHover();
    }

    // Mouse is pressed
    if(tempIsClicked) {
      this._onPressed();
    }

    this._isClicked = tempIsClicked;
    this._isHovering = tempIsMouseHovering;
    this.draw(width, height, this.cornerRounding);
  }

  private draw(width: number, height: number, cornerRounding: number): void {
    push();

    translate(this.x, this.y);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(this.textSize);

    noStroke();

    fill(this.isClicked ? lerpColor(this.backgroundColor,this.clickedColor, 0.4) : (this.isHovering ? lerpColor(this.backgroundColor,color(0), this.hoverWeight) : this.backgroundColor));

    rect(0, 0, width, height,this.cornerRounding);

    fill(this.textColor);
    text(this.text, 0, 0);

    pop();
  }

  private isMouseOver(width: number, height: number): boolean {
    return (
      mouseX > this.x - (width / 2) &&
      mouseX < this.x + (width / 2) &&
      mouseY > this.y - (height / 2) &&
      mouseY < this.y + (height / 2)
    );
  }

  private _onClick() {
    this.onClick();
  }

  private _onHover() {
    this.onHover();
  }

  private _onRelease() {
    this.onRelease();
  }

  private _onPressed() {
    this.onPressed();
  }
}
```

`public/index.html`

```HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.min.js"
      integrity="sha256-Pg1di+fBF53Rbh9oZR/FeD1xsFzTLC963lcac1D0ias="
      crossorigin="anonymous"
    ></script>
    <link rel="stylesheet" href="./style.css">
    <title>Paint5.js</title>
  </head>
  <body>
    <!-- We need this container so that we can position the color picker, relative to the canvas -->
    <div id="container"></div>
    <script src="./dist/main.js"></script>
  </body>
</html>
```

`public/style.css`

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    background-color: #282C34;
}

#container {
    /* Both the container and the colorPicker needs to have position relative */
    position: relative;
}

input[type="color"] {
    -webkit-appearance: none;
    border: none;
    position: relative;
}
input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}
input[type="color"]::-webkit-color-swatch {
    border: none;
}
```