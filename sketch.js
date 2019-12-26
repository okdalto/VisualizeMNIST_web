
let result;
function preload() {
    result = loadStrings('assets/biases3.txt');
}

function setup() {
    w = window.innerWidth;
    h = window.innerHeight;
    createCanvas(w, h);
}

function draw() {
    text(random(result), 10, 10, 80, 80);
    if (mouseIsPressed) {
        fill(0);
    } else {
        fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
}

function windowResized() {
    console.log("test!");
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
}
