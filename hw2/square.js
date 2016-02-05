var gl = undefined;

var square = {
    count : 4,
    positions : {
        values : new Float32Array([
            0.0, 0.0, // Vertex 0
            1.0, 0.0, // Vertex 1
            0.0, 1.0, // Vertex 2
            1.0, 1.0  // Vertex 3
        ]),
        numComponents : 2
    },
    colors : {
        values: new Float32Array([  
            1.0, 0.0, 0.0,
            0.0, 1.0, 1.0,
            1.0, 0.0, 1.0,
            0.0, 0.0, 1.0
            
         ]),
        numComponents : 3
    }
};

function init() {
	var canvas = document.getElementById("webgl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl) {return;}
	gl.clearColor(0.0, 1.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT)
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program)
    
    square.positions.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, square.positions.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, square.positions.values, gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, square.positions.numComponents, gl.FLOAT, 0, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    square.colors.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, square.colors.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, square.colors.values, gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, square.colors.numComponents, gl.FLOAT, 0, 0, 0);
    gl.enableVertexAttribArray(vColor);
    render();
}

function render() {
    var start = 0;
    var count = square.count;
    gl.drawArrays(gl.TRIANGLE_STRIP, start, count);
}
window.onload = init;
