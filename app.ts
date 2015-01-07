var img: Graph.IMG;
window.onload = () => {

     
            var dropZone = document.getElementById('drop-zone');

            dropZone.ondrop = function(e) {
                e.preventDefault();
                this.className = 'upload-drop-zone';

                loadFile(e.dataTransfer.files)
            }

            dropZone.ondragover = function() {
                this.className = 'upload-drop-zone drop';
                return false;
            }

            dropZone.ondragleave = function () {
                this.className = 'upload-drop-zone';
                return false;
            }
          

    var imageCanvas = <HTMLCanvasElement>document.getElementById("hiddenImage");
    var drawingCanvas = <HTMLCanvasElement>document.getElementById("image");
    
    function loadFile(files: FileList) {
        img = new Graph.IMG(imageCanvas, drawingCanvas, files);
    }

    drawingCanvas.onmousemove = function (e: MouseEvent) {
        
        var x = e.pageX - drawingCanvas.offsetLeft;
        var y = e.pageY - drawingCanvas.offsetTop;
        if (x > 0 && y > 0 && x < drawingCanvas.width && y < drawingCanvas.height && img != null) {
            var node = img.findCircle(x, y);
            node.addChildren(Graph.IMG.image, drawingCanvas);
        }
    }
};


