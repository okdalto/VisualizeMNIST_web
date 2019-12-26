var visualizationBuffer;
var canvasBuffer;
var w = window.innerWidth;
var h = window.innerHeight;

var w1;
var b1;
var w2;
var b2;
var w3;
var b3;

var inputMat = new Array(1);
for (let i = 0; i < inputMat.length; i++) {
    inputMat[i] = new Array(784).fill(0);
}

function setup() {
    w = window.innerWidth;
    h = window.innerHeight;
    createCanvas(w, h);
    visualizationBuffer = createGraphics(w / 2, h, WEBGL);
    canvasBuffer = createGraphics(128, 128, WEBGL);

    w1 = loadMat("asset/weight1.txt");
    w2 = loadMat("asset/weight2.txt");
    w3 = loadMat("asset/weight3.txt");
    b1 = loadMat("asset/biases1.txt");
    b2 = loadMat("asset/biases2.txt");
    b3 = loadMat("asset/biases3.txt");
}

function draw() {

    //network
    var mat1 = multMat(inputMat, w1);
    mat1 = addMat(mat1, b1);
    relu(mat1);

    var mat2 = multMat(mat1, w2);
    mat2 = addMat(mat2, b2);
    relu(mat2);

    var mat3 = multMat(mat2, w3);
    mat3 = addMat(mat3, b3);

    //reshape to visualize
    var reshapedMat1 = reshape(inputMat, 28);
    var reshapedMat2 = reshape(mat1, 8);
    var reshapedMat3 = reshape(mat2, 4);

    //visualization
    visualizationBuffer.background(0);
    var inputPos = drawMat(reshapedMat1, 0, visualizationBuffer);
    var varw1Pos = drawMat(reshapedMat2, -100, visualizationBuffer);
    var w2Pos = drawMat(reshapedMat3, -150, visualizationBuffer);
    var resultPos = drawMat(softmax(mat3), -200, visualizationBuffer);


    drawbuffer(visualizationBuffer);
    drawbuffer(canvasBuffer);
    image(leftBuffer, 0, 0);
    image(canvasBuffer, w / 2, 0, width / 2, height);

    var a = [
      [1, 3]
    ];
    var b = [
      [1, 3],
      [2, 4]
    ];
}

function drawbuffer(buffer) {
    buffer.push();
    buffer.rotateX(frameCount * 0.01);
    buffer.rotateY(frameCount * 0.01);
    buffer.box(3);
    buffer.pop();
}


function windowResized() {
    console.log("test!");
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
}


function loadMat(fileName) {
    var row = 0,
      col = 0;

    var lines = loadStrings(fileName);
    col = lines.length;
    console.log("there are " + lines.length + " lines");

    if (lines.length > 0) {
        row = lines[0].split(",").length;
    } else {
        console.log("error!");
        return null;
    }

    var result = new Array(rowA);
    for (let i = 0; i < result.length; i++) {
        result[i] = new Array(colB).fill(0);
    }


    for (let i = 0; i < col; i++) {
        //println(lines[i]);
        let linesInner = lines[i].split(",");
        for (let j = 0; j < row; j++) {
            result[i][j] = float(linesInner[j]);
        }
    }
    return result;
}


function multMat(matA, matB) {
    var rowA = matA.length;
    var colA = matA[0].length;
    var rowB = matB.length;
    var colB = matB[0].length;

    if (colA != rowB) {
        console.log("row col unmatch error!");
        return null;
    }

    var result = new Array(rowA);
    for (let i = 0; i < result.length; i++) {
        result[i] = new Array(colB).fill(0);
    }

    for (let i = 0; i < rowA; i++) {
        for (let j = 0; j < colB; j++) {
            for (let k = 0; k < colA; k++) {
                result[i][j] += matA[i][k] * matB[k][j];
            }
        }
    }
    return result;
}


function drawMat(mat, yPosition, pg) {
    var row = mat.length;
    var col = mat[0].length;
    var scale = 50;
    var boxSize = 20;
    var result = new Array(row);
    for (let i = 0; i < result.length; i++) {
        result[i] = new Array(col).fill(0);
    }

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            pg.push();
            result[i][j] = createVector(
              yPosition,
              i * scale - (row * scale) * 0.5 + ((row - 1) * scale) * 0.5,
              j * scale - (col * scale) * 0.5 + ((col - 1) * scale) * 0.5
            );
            pg.translate(result[i][j].x, result[i][j].y, result[i][j].z);
            pg.stroke(255);
            pg.fill(mat[i][j] * 255);
            pg.box(boxSize);
            pg.pop();
        }
    }
    return result;
}

function softmax(x) {
    var result = new Array(1);
    for (let i = 0; i < result.length; i++) {
        result[i] = new Array(x[0].length).fill(0);
    }

    var div = 0;
    for (let i = 0; i < x[0].length; i++) {
        let tempX = x[0][i];
        result[0][i] = exp(tempX);
        div += Math.exp(tempX);
    }
    console.log("");
    for (let i = 0; i < x[0].length; i++) {
        result[0][i] /= div;
        console.log("number", i, "=", Math.round(result[0][i] * 100), "%");
    }
    return result;
}

function addMat(matA, matB) {
    var rowA = matA.length;
    var colA = matA[0].length;
    var rowB = matB.length;
    var colB = matB[0].length;

    if (rowA != rowB || colA != colB) {
        print("shape unmatch error!");
        return null;
    }

    var result = new Array(rowA);
    for (let i = 0; i < result.length; i++) {
        result[i] = new Array(colB).fill(0);
    }

    for (let i = 0; i < rowA; i++) {
        for (let j = 0; j < colA; j++) {
            result[i][j] = matA[i][j] + matB[i][j];
        }
    }
    return result;
}

function reshape(mat, desiredColNum) {
    var col = mat.length;
    var row = mat[0].length;
    col = desiredColNum;
    row = row / col;
    var result = new Array(desiredColNum);
    for (let i = 0; i < result.length; i++) {
        result[i] = new Array(row).fill(0);
    }

    var idx = 0;
    if (row * col != mat[0].length) {
        println("reshape error");
        return null;
    }
    for (let i = 0; i < col; i++) {
        for (let j = 0; j < row; j++) {
            result[i][j] = mat[0][idx];
            idx++;
        }
    }
    return result;
}

function printMat(mat) {
    var row = mat[0].length;
    var col = mat.length;

    var printString = "";
    for (let i = 0; i < mat.length; i++) {
        printString += "|";
        for (let j = 0; j < mat[0].length; j++) {
            //print("i:" + i + " j:" + j + " ");
            printString += mat[i][j] + "|"
        }
        printString += "\n"
    }
    console.log(printString);
    // console.log("row = " + row + " col = " + col);
}


function relu(mat) {
    var col = mat.length;
    var row = mat[0].length;

    for (let i = 0; i < col; i++) {
        for (let j = 0; j < row; j++) {
            mat[i][j] = max(0, mat[i][j]);
        }
    }
}