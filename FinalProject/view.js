var canvas = undefined;
var gl = undefined;
var position = undefined;
var color = undefined;
var program = undefined;
var randArray = [];
var colorArray = [];
var speedInput;
function init() {
    // Initialize webgl environment
    canvas = document.getElementById("webgl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL initialization failed");
        return;
    }
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    // Get attributes and uniforms from shaders
    position = gl.getAttribLocation(program, "a_position");
    var resolution = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolution, canvas.width, canvas.height);
    color = gl.getUniformLocation(program, "u_color");
    
    // Bind buffer and generate rectangles for each randArray index
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    randomizeArray();
    speedInput = document.getElementById("speed");
}

function randomizeArray() {
    let SIZE = 50;
    randArray = [];
    colorArray = [];
    randArray.push(Math.floor(Math.random() * SIZE + 1));
    colorArray.push(0);
    while (randArray.length < SIZE) {
        var num = Math.floor(Math.random() * SIZE) + 1;
        if (randArray.indexOf(num) === -1) {
            randArray.push(num);
            colorArray.push(0);
        }
    }
    renderArray(gl, randArray, position);
}

function renderArray() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    var spaceBuffer = 0
    for (var i = 1; i <= randArray.length; i++) {
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array([
                i*10+spaceBuffer, 20,
                i*10+10+spaceBuffer, 20,
                i*10+spaceBuffer, 20+(randArray[i-1]*10),
                i*10+spaceBuffer, 20+(randArray[i-1]*10),
                i*10+10+spaceBuffer, 20,
                i*10+10+spaceBuffer, 20+(randArray[i-1]*10)
            ]), gl.STATIC_DRAW
        );
        generateColor(colorArray[i-1]);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        spaceBuffer += 5;
    }
}

function generateColor(value) {
    var r, g, b;
    if (value % 1530 <= 255) {
        r = 255;
        g = value % 255;
        b = 0;
    }
    else if (value % 1530 > 255 && value % 1530 <= 510) {
        r = 255 - value % 255;
        g = 255;
        b = 0;
    }
    else if (value % 1530 > 510 && value % 1530 <= 765) {
        r = 0;
        g = 255;
        b = value % 255;
    }
    else if (value % 1530 > 765 && value % 1530 <= 1020) {
        r = 0;
        g = 255 - value % 255;
        b = 255;
    }
    else if (value % 1530 > 1020 && value % 1530 <= 1275) {
        r = value % 255;
        g = 0;
        b = 255;
    }
    else if (value % 1530 > 1275 && value % 1530 <= 1530) {
        r = 255;
        g = 0;
        b = 255 - value % 255;
    }
    gl.uniform4f(color, r/255, g/255, b/255, 1.0);
    //console.log(r + " " + g + " " + b);
}

/*
 * INSERTION SORT
 */
function insertionSort(delay) {
    if (isSorted()) {
        return;
    }
    var i = 0;
    var j = i - 1;
    var temp, colorTemp;
    var intervalVar = window.setInterval(function(){
        if (randArray[j+1] < randArray[j])
        {
            temp = randArray[j+1];
            randArray[j+1] = randArray[j];
            randArray[j] = temp;
            colorTemp = colorArray[j+1];
            colorArray[j+1] = colorArray[j];
            colorArray[j] = colorTemp;
            colorArray[j] += 20;
            colorArray[j+1] += 20;
            j--;
        }
        else if (i >= randArray.length)
        {
            window.clearInterval(intervalVar);
        }
        else {
            i++;
            j = i - 1;
        }
        renderArray();
        /* OUTER LOOP ONLY
        if (i < randArray.length) {
            insertionSortStep(gl, randArray, position, i);
            i++;
        }
        else {
            window.clearInterval(intervalVar);
        }*/
    }, delay);
    /* OLD LOOP
    for (i = 0; i < randArray.length; i++) {
        sortStep(gl, randArray, position);
        window.setTimeout(function() {
            renderArray(gl, randArray, position);
        }, 1000)
    }
    */
}

/* NOT NEEDED ANYMORE
function insertionSortStep(gl, randArray, position, i) {
    // WORKING SO FAR
    var tempVal = randArray[i];
    var temp;
    var j = i - 1;
     /*
    for(var j = i-1; j > -1 && randArray[j] > tempVal; j--) {
        temp = randArray[j+1];
        randArray[j+1] = randArray[j];
        randArray[j] = temp;
    }* /
    //randArray[j+1] = tempVal;
    // THIS PART MAKES STUFF ACT WEIRD
    var innerStep = window.setInterval(function(){
        if (j > -1 && randArray[j] > tempVal) {
            temp = randArray[j+1];
            randArray[j+1] = randArray[j];
            randArray[j] = temp;
            j--;
            renderArray(gl, randArray, position);
        }
        else {
            window.clearInterval(innerStep);
        }
    }, 100);
    renderArray(gl, randArray, position);
}
*/

/*
 * BUBBLE SORT
 */
function bubbleSort(delay) {
    if (isSorted()) {
        return;
    }
    var temp;
    var i = 0;
    var j = 0;
    var interval = window.setInterval(function() {
        if (i < randArray.length) {
            if (j < randArray.length - 1 - i) {
                if (randArray[j] > randArray[j+1]) {
                    temp = randArray[j];
                    randArray[j] = randArray[j+1];
                    randArray[j+1] = temp;
                    colorTemp = colorArray[j];
                    colorArray[j] = colorArray[j+1];
                    colorArray[j+1] = colorTemp;
                    colorArray[j] += 20;
                    colorArray[j+1] += 20;
                }
                j++;
            }
            else {
                i++;
                j = 0;
            }
        }
        else {
            window.clearInterval(interval);
        }
        renderArray();
    }, delay);
    /* OUTER LOOP VISUALIZED
    var interval = window.setInterval(function() {
        if (i < randArray.length) {
            for (var j = 0; j < randArray.length - 1; j++) {
                if (randArray[j] > randArray[j+1]) {
                    temp = randArray[j];
                    randArray[j] = randArray[j+1];
                    randArray[j+1] = temp;
                }
            }
            renderArray(gl, randArray, position);
        }
        else {
            window.clearInterval(interval);
        }
    }, 50);
    */
    /* PURE BUBBLE SORT
    for (var i = 0; i < randArray.length; i++) {
        for (var j = 0; j < randArray.length - 1; j++) {
            if (randArray[j] > randArray[j+1]) {
                temp = randArray[j];
                randArray[j] = randArray[j+1];
                randArray[j+1] = temp;
            }
        }
    }
    */
}

/*
 * QUICKSORT
 */
// COULD NOT GET THIS SORT TO WORK WITH RENDERING BECAUSE OF RECURSION
/*
function quickSort(left, right, delay) {
    if (randArray.length > 1) {
        index = partition(left, right, delay);
        
        if (left < index - 1) {
            quickSort(left, index - 1, delay);
        }
        if (index < right) {
            quickSort(index, right, delay);
        }
    }
}

function partition(left, right) {
    var pivot = randArray[Math.floor((right + left) / 2)];
    var i = left;
    var j = right;
    var temp;
    while (i <= j) {
    //var interval = window.setInterval(function() {
        if (i <= j) {
            while (randArray[i] < pivot) {
                i++;
            }
            while (randArray[j] > pivot) {
                j--;
            }
            if (i <= j) {
                temp = randArray[i];
                randArray[i] = randArray[j];
                randArray[j] = temp;
                i++;
                j--;
            }
            console.log(randArray);
            //renderArray();
        }
        else {
            window.clearInterval(interval);
        }
    //}, delay);
    }
    renderArray();
    return i;
}
*/

/*
 * RADIX SORT
 */
function radixSort(delay) {
    if (isSorted()) {
        return;
    }
    let BASE = 2;
    var max = findMax();
    var bucket = [];
    var colorBucket = [];
    for (var i = 0; i < BASE; i++) {
        bucket.push([]);
        colorBucket.push([]);
    }
    var n = 1;
    var i, j, k;
    var fillBucket = true;
    var interval = window.setInterval(function() {
        if (n > max) {
            window.clearInteval(interval);
        }
        else if (fillBucket) {
            for (var i = 0; i < randArray.length; i++) {
                bucket[Math.floor(randArray[i] / n) % BASE].push(randArray[i]);
                colorBucket[Math.floor(randArray[i] / n) % BASE].push(colorArray[i]);
            }
            fillBucket = false;
            k = 0;
            j = 0;
        }
        else if (j < BASE) {
            if (bucket[j].length > 0) {
                randArray[k] = bucket[j].shift();
                colorArray[k] = colorBucket[j].shift();
                colorArray[k] += 100;
                k++;
            }
            else {
                j++;
            }
        }
        else {
            fillBucket = true;
            n *= BASE;
        }
        renderArray();
    }, delay);
    /* PURE RADIX SORT
    for (var n = 1; n < max; n *= 10) {
        for (var i = 0; i < randArray.length; i++) {
            bucket[Math.floor(randArray[i] / n) % 10].push(randArray[i]);
        }
        var k = 0;
        for (var j = 0; j < 10; j++) {
            while (bucket[j].length > 0) {
                randArray[k++] = bucket[j].shift();
            }
        }
    }
    */
}

function findMax() {
    var max = randArray[0];
    for (var i = 1; i < randArray.length; i++) {
        if (randArray[i] > max) {
            max = randArray[i];
        }
    }
    return max;
}

/*
 * BOGO SORT
 */
function bogoSort(delay) {
    var interval = window.setInterval(function() {
        if (!isSorted()) {
            shuffle();
        }
        else {
            window.clearInterval(interval);
        }
        renderArray();
    }, delay);
}

function shuffle() {
    var j, temp;
    for (var i = 0; i < randArray.length; i++) {
        j = Math.floor(Math.random() * randArray.length);
        if (i != j) {
            temp = randArray[i];
            randArray[i] = randArray[j];
            randArray[j] = temp;
            colorTemp = colorArray[i];
            colorArray[i] = colorArray[j];
            colorArray[j] = colorTemp;
            colorArray[i] += 20;
            colorArray[j] += 20;
        }
    }
}

function isSorted() {
    for (var i = 0; i < randArray.length - 1; i++) {
        if (randArray[i] > randArray[i+1]) {
            return false;
        }
    }
    return true;
}

// BUTTON FUNCTIONS
function insertionButton() {
    if (speedInput.value == "") {
        insertionSort(50);
    }
    else {
        insertionSort(speedInput.value);
    }
}

function bubbleButton() {
    if (speedInput.value == "") {
        bubbleSort(50);
    }
    else {
        bubbleSort(speedInput.value);
    }
}

function radixButton() {
    if (speedInput.value == "") {
        radixSort(50);
    }
    else {
        radixSort(speedInput.value);
    }
}

function bogoButton() {
    if (speedInput.value == "") {
        bogoSort(50);
    }
    else {
        bogoSort(speedInput.value);
    }
}

// WINDOW ONLOAD
window.onload = init;