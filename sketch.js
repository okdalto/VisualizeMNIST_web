function setup() {
    w = window.innerWidth;
    h = window.innerHeight;
    createCanvas(640, 480);
}

function draw() {
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
