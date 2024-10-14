// Defining the default variables
const DEFAULT_SIZE = 3;
const DEFAULT_COLOR = "#37c9f9";
const DEFAULT_MODE = "color";

let current_size = DEFAULT_SIZE;
let previous_color = DEFAULT_COLOR;
let current_color = DEFAULT_COLOR;
let current_mode = DEFAULT_MODE;

function setCurrentSize(new_size) {
    current_size = new_size;
}

function setCurrentColor(new_color) {
    current_color = new_color;
}

function setCurrentMode(new_mode) {
    activateButton(new_mode);
    current_mode = new_mode;
}

let color_wheel = document.querySelector("#color-choose");
let color_label = document.querySelector('label[for="color-choose"]');
let color_btn = document.querySelector(".color");
let eraser_btn = document.querySelector(".eraser");
let rainbow_btn = document.querySelector(".rainbow");
let sketch_area = document.querySelector(".sketch-area");
let slider_label = document.querySelector("#size-info");
let slider_bar = document.querySelector("#size-slider");
let clear_all_btn = document.querySelector("#clear_all");
let random_btn = document.querySelector("#random");
let save_btn = document.querySelector("#save");
let primary_mouse_btn_down = false;

document.addEventListener("DOMContentLoaded", () => initialSetup());
color_wheel.addEventListener("input", (e) => {
    setCurrentColor(e.target.value);
    color_label.innerHTML = e.target.value.toString();
});
color_btn.addEventListener("click", () => setCurrentMode("color"));
eraser_btn.addEventListener("click", () => setCurrentMode("eraser"));
rainbow_btn.addEventListener("click", () => setCurrentMode("rainbow"));
slider_bar.addEventListener("change", (e) => changeSize(e.target.value));
slider_bar.addEventListener("mousemove", (e) => updateSliderLabel(e.target.value));
clear_all_btn.addEventListener("click", () => loadGrid());
random_btn.addEventListener("click", () => fillRandomColors());
save_btn.addEventListener("click", () => saveSketch());
document.body.addEventListener("mousedown", () => primary_mouse_btn_down = true);
document.body.addEventListener("mouseup", () => primary_mouse_btn_down = false);

function initialSetup() {
    setCurrentSize(DEFAULT_SIZE);
    setCurrentMode(DEFAULT_MODE);
    setCurrentColor(DEFAULT_COLOR);
    changeSize(DEFAULT_SIZE);
    activateButton(DEFAULT_MODE);
    initializeLabels();
}

function initializeLabels() {
    color_label.innerHTML = DEFAULT_COLOR;
    slider_label.innerHTML = `${DEFAULT_SIZE} x ${DEFAULT_SIZE}`
}

function changeSize(new_size) {
    setCurrentSize(new_size);
    loadGrid();
}

function updateSliderLabel(new_size) {
    slider_label.innerHTML = `${new_size} x ${new_size}`;
}

function loadGrid() {
    clearGrid();

    for (i = 1; i <= current_size; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        for(j = 1; j <= current_size; j++) {
            let cell = document.createElement("div");
            cell.classList.add('cell');
            cell.addEventListener("mouseover", changeCellColor);
            cell.addEventListener("mousedown", (e) => {
                e.preventDefault();
                changeCellColor(e);
            });
            cell.addEventListener("mouseup", () => primary_mouse_btn_down = false);
            row.appendChild(cell);
        }
        sketch_area.appendChild(row);
    }
}

function clearGrid() {
    sketch_area.innerHTML = '';
}

function changeCellColor(e) {
    if (e.type === "mouseover" && !primary_mouse_btn_down)
        return;
    
    if (current_mode === 'rainbow') {
        const randomR = Math.floor(Math.random() * 256);
        const randomG = Math.floor(Math.random() * 256);
        const randomB = Math.floor(Math.random() * 256);
        e.target.style.backgroundColor = `rgb(${randomR}, ${randomG}, ${randomB})`;
    } else if (current_mode === 'color') {
        e.target.style.backgroundColor = current_color;
    } else if (current_mode === 'eraser') {
        e.target.style.backgroundColor = 'white';
    }
}

function activateButton(new_mode) {
    if (current_mode === 'rainbow') {
        rainbow_btn.classList.remove('active')
    } else if (current_mode === 'color') {
        color_btn.classList.remove('active')
    } else if (current_mode === 'eraser') {
        eraser_btn.classList.remove('active')
    }

    if (new_mode === 'rainbow') {
        rainbow_btn.classList.add('active')
    } else if (new_mode === 'color') {
        color_btn.classList.add('active')
    } else if (new_mode === 'eraser') {
        eraser_btn.classList.add('active')
    }
}


function fillRandomColors() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        let red = Math.floor(Math.random() * 256);
        let green = Math.floor(Math.random() * 256);
        let blue = Math.floor(Math.random() * 256);
        cell.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    });    
}

function saveSketch() {
    // Get the grid and its cells
    const cells = document.querySelectorAll('.cell');
    const gridSize = Math.sqrt(cells.length); // Assuming a square grid
    const cellSize = cells[0].offsetWidth; // Assuming all cells are squares and same size

    // Create a canvas with the same size as the grid
    const canvas = document.createElement('canvas');
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    const ctx = canvas.getContext('2d');

    // Iterate over the cells and draw each one onto the canvas
    cells.forEach((cell, index) => {
        let color = window.getComputedStyle(cell).backgroundColor;
        // change cell color from black and transparent(seen as white on div but not on canvas), to white and opaque, seen as white on canvas
        if (color === "rgba(0, 0, 0, 0)") color = "rgba(255, 255, 255, 100)"; 
        
        // Calculate the x and y position of each cell on the canvas
        const x = (index % gridSize) * cellSize;
        const y = Math.floor(index / gridSize) * cellSize;

        // Set the fill style to the cell's background color and fill the rectangle
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize, cellSize);
    });

    // Convert the canvas content to an image file (Base64 data URL)
    const dataURL = canvas.toDataURL('image/png');
    
    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'grid-image.png';
    downloadLink.click();
}


