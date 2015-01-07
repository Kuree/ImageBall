var img;
window.onload = function () {
    var dropZone = document.getElementById('drop-zone');
    dropZone.ondrop = function (e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';
        loadFile(e.dataTransfer.files);
    };
    dropZone.ondragover = function () {
        this.className = 'upload-drop-zone drop';
        return false;
    };
    dropZone.ondragleave = function () {
        this.className = 'upload-drop-zone';
        return false;
    };
    var imageCanvas = document.getElementById("hiddenImage");
    var drawingCanvas = document.getElementById("image");
    function loadFile(files) {
        img = new Graph.IMG(imageCanvas, drawingCanvas, files);
    }
    drawingCanvas.onmousemove = function (e) {
        var x = e.pageX - drawingCanvas.offsetLeft;
        var y = e.pageY - drawingCanvas.offsetTop;
        if (x > 0 && y > 0 && x < drawingCanvas.width && y < drawingCanvas.height) {
            var node = img.findCircle(x, y);
            node.addChildren(Graph.IMG.image, drawingCanvas);
        }
    };
};
//# sourceMappingURL=app.js.map