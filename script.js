function addCells(n) {
    let sketcharea = document.querySelector('.sketch-area');

    while (sketcharea.firstChild) {
        sketcharea.removeChild(sketcharea.firstChild);
    }

    for (i = 1; i <= n; i++){
        let row = document.createElement("div");
        row.classList.add("row");

        for (j = 1; j <= n; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            row.appendChild(cell);
        }

        sketcharea.appendChild(row);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    let color_picker = document.querySelector("#color-choose");
    let color_picker_value = document.querySelector('label[for="color-choose"]');

    color_picker.addEventListener("input", function() {
        color_picker_value.innerHTML = color_picker.value;
    });

    color_picker_value.innerHTML = color_picker.value;
});

let slider = document.querySelector("#size-slider");
let sizeinfo = document.querySelector("#size-info");
sizeinfo.innerHTML = `${slider.value} x ${slider.value}`;
addCells(slider.value);
slider.oninput = function() {
    sizeinfo.innerHTML = `${this.value} x ${this.value}`;
    addCells(this.value);
}
