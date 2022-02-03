import { Color } from "p5";

type Point = { x: number, y: number };
type Line = { start: Point, end: Point };
type BrushStroke = { color: Color, thickness: number, lines: Array<Line> };

const brushStrokes: Array<BrushStroke> = []
const canvasWidth = 890;
const canvasHeight = 722;
let newBrushStroke: undefined | BrushStroke = undefined;
let prevMouseDown: boolean = false;
const minLengthBetweenPoint = 2;

export function drawSketchpad() {
  drawPreviousStrokes();

  // If the mouse is clicked, but wasn't in the last frame
  // Then we can start a new line
  if(mouseIsPressed && !prevMouseDown) {
    newBrushStroke = {
      color: color(
        random(150, 255),
        random(150, 255),
        random(150, 255),
      ),
      thickness: random(3, 10),
      // Create the new brush stroke, with a basic line
      // Because we use the endpoint from the prev line, to create a new line
      lines: [ { start: pointFromMouse(), end: pointFromMouse() } ]
    }
  }

  // If the mouse isn't clicked, but it was in the last from
  // The the mouse has been released, and we can end the line
  if(!mouseIsPressed && prevMouseDown) {
    // Push the new brushStroke to the brushStrokes array
    // But only if newBrushStrokes isn't undefined
    if(newBrushStroke) brushStrokes.push(newBrushStroke);
  }

  // If the mouse is pressed, and it was in the last frame, we can create line segments
  // In the brushStroke
  if(mouseIsPressed && prevMouseDown) {
    // Use the last point in the brushStroke as the start of this new line,
    // If it doesn't exist, just use the mouse position
    const lastPoint = newBrushStroke?.lines[newBrushStroke?.lines.length - 1].end || pointFromMouse();
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

// Helper, to write DRY code
function pointFromMouse(): Point {
  return {
    x: min(mouseX, canvasWidth),
    y: min(mouseY, canvasHeight),
  }
}