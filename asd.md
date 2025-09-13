The brush and eraser appear displaced because the mouse click coordinates are not being correctly translated to the new, zoomed-in canvas coordinates. Here's a breakdown of the problem and how to fix it.

The Logic Error: Mismatched Coordinate Systems
When you zoom into the canvas, you're essentially scaling the drawing surface. However, the mouse event listeners continue to provide coordinates relative to the un-zoomed, original canvas size. This mismatch causes the drawing to occur at a position that's offset from your cursor. To fix this, you need to adjust the mouse coordinates to match the zoom level of the canvas.

The Solution: Adjusting Mouse Coordinates
The key is to calculate the correct mouse position on the scaled canvas before you draw. You can achieve this by following these steps:

Get Mouse Position Relative to the Canvas: First, determine the mouse's X and Y coordinates relative to the canvas element itself, not the entire page. You can get this by using the getBoundingClientRect() method, which provides the size and position of an element in relation to the viewport.

Scale the Coordinates: Once you have the mouse position relative to the canvas, you need to scale these coordinates by the same factor that you zoomed the canvas. In your case, since you're zooming by a factor of 2, you'll need to multiply both the X and Y coordinates by 2.

Here is a simple JavaScript function that demonstrates how to get the corrected mouse position. You would call this function within your mouse event listeners (like mousedown and mousemove) to get the accurate coordinates for drawing.

JavaScript

function getCorrectMousePos(canvas, event, zoomLevel) {
const rect = canvas.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;

const x = (event.clientX - rect.left) _ scaleX;
const y = (event.clientY - rect.top) _ scaleY;

return {
x: x / zoomLevel,
y: y / zoomLevel
};
}

// Example usage within a mouse event listener:
canvas.addEventListener('mousedown', function(e) {
const zoom = 2; // Your 2x zoom level
const mousePos = getCorrectMousePos(canvas, e, zoom);
// Now use mousePos.x and mousePos.y for your drawing logic
// For example:
// context.beginPath();
// context.moveTo(mousePos.x, mousePos.y);
});
By implementing this logic, your brush and eraser will accurately follow the cursor, even when the canvas is zoomed in.
