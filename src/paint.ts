import { Color } from "p5";

type Point = { x: number, y: number };
type Line = { start: Point, end: Point };
type BrushStroke = { color: Color, thickness: number, lines: Array<Line> };

const brushStrokes: Array<BrushStroke> = [];
const redoStack: Array<BrushStroke> = [];
const canvasWidth = 890;
const canvasHeight = 722;
let newBrushStroke: undefined | BrushStroke = undefined;
let prevMouseDown: boolean = false;
const minLengthBetweenPoint = 2;

export const config = {
  thickness: 5,
  color: {
    r: 0,
    g: 0,
    b: 0,
  }
}

export function drawSketchpad() {
  drawPreviousStrokes();

  // If the mouse is clicked, but wasn't in the last frame
  // Then we can start a new line
  if(mouseIsPressed && !prevMouseDown && isMouseInsideSketchpad()) {
    newBrushStroke = {
      color: color(
        config.color.r,
        config.color.g,
        config.color.b,
      ),
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
    stroke(brushStroke.color);
    strokeWeight(brushStroke.thickness);
    noFill();

    // Use the name line_ as because line is reserved for the 'line' function
    for(const line_ of brushStroke.lines) {
      line(
        line_.start.x,
        line_.start.y,
        line_.end.x,
        line_.end.y
      );
    }
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
  console.log('Before: ', brushStrokes);
  
  // If there is no brushStrokes, then we can't undo
  const strokeToUndo = brushStrokes.pop();
  if(strokeToUndo) redoStack.push(strokeToUndo);

  console.log('After: ', brushStrokes);
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