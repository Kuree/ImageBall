var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Graph;
(function (Graph) {
    var color = (function () {
        function color(r, g, b, a) {
            if (a === void 0) { a = 255; }
            this.R = r;
            this.G = g;
            this.B = b;
            this.A = a;
        }
        color.prototype.toString = function () {
            return "#" + this.R.toString(16) + this.G.toString(16) + this.B.toString(16);
        };
        return color;
    })();
    Graph.color = color;
    var graph = (function () {
        function graph(x, y, child) {
            this.position_x = x;
            this.position_y = y;
            this.children = child;
        }
        graph.prototype.draw = function (canvas) {
        };
        graph.prototype.clear = function (canvas) {
        };
        return graph;
    })();
    Graph.graph = graph;
    var circle = (function (_super) {
        __extends(circle, _super);
        function circle(x, y, r, color) {
            _super.call(this, x, y, null);
            this.c = color;
            this.radius = r;
        }
        circle.prototype.draw = function (canvas) {
            var context = canvas.getContext("2d");
            if (this.children == null) {
                context.beginPath();
                context.arc(this.position_x, this.position_y, this.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fillStyle = this.c.toString();
                context.fill();
            }
            else {
                this.children.forEach(function (c) {
                    c.draw(canvas);
                });
            }
        };
        circle.prototype.clear = function (canvas) {
            if (this.children == null) {
                var context = canvas.getContext("2d");
                context.clearRect(this.position_x - this.radius, this.position_y - this.radius, this.radius * 2, this.radius * 2);
            }
        };
        circle.prototype.addChildren = function (img, canvas) {
            this.clear(canvas);
            var r = this.radius / 2;
            if (r < 1) {
                return;
            }
            var topLeft = [this.position_x - r, this.position_y - r];
            this.children = [new circle(topLeft[0], topLeft[1], r, img.getColor(topLeft[0], topLeft[1])), new circle(topLeft[0] + 2 * r, topLeft[1], r, img.getColor(topLeft[0] + 2 * r, topLeft[1])), new circle(topLeft[0], topLeft[1] + 2 * r, r, img.getColor(topLeft[0], topLeft[1] + 2 * r)), new circle(topLeft[0] + 2 * r, topLeft[1] + 2 * r, r, img.getColor(topLeft[0] + 2 * r, topLeft[1] + 2 * r)),];
            this.draw(canvas);
        };
        return circle;
    })(graph);
    Graph.circle = circle;
    ;
    var image = (function () {
        function image(canvas, width, height) {
            var context = canvas.getContext("2d");
            this.pixels = context.getImageData(0, 0, width, height).data;
            this.width = width;
            this.height = height;
        }
        image.prototype.getColor = function (x, y) {
            var i = Math.floor(x);
            var j = Math.floor(y);
            var start = (j * this.width + i) * 4;
            return new color(this.pixels[start], this.pixels[start + 1], this.pixels[start + 2], this.pixels[start + 3]);
        };
        return image;
    })();
    var IMG = (function () {
        function IMG(imageCanvas, drawingCanvas, files) {
            this.loadFromFile(imageCanvas, drawingCanvas, files);
        }
        IMG.prototype.loadFromFile = function (imageCanvas, drawingCanvas, files) {
            var file = files[0];
            var i = 1;
            while (file.type.indexOf("image") == -1 && i < files.length) {
                file = files[i];
                i++;
            }
            var img = new Image();
            var context = imageCanvas.getContext("2d");
            img.onload = function (e) {
                var d = 500;
                context.drawImage(img, 0, 0, d, d * img.height / img.width);
                IMG.image = new image(imageCanvas, d, d);
                var r = d / 2;
                IMG.root = (new circle(r, r, r, IMG.image.getColor(r, r)));
                IMG.root.draw(drawingCanvas); // this part broke tons of stuff, so use static instead
            };
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    img.src = e.target.result;
                };
            })(file);
            reader.readAsDataURL(file);
        };
        IMG.prototype.loaded = function (f) {
            f();
        };
        IMG.prototype.getWidth = function () {
            return IMG.width;
        };
        IMG.prototype.getHeight = function () {
            return IMG.height;
        };
        // O(log)
        IMG.prototype.findCircle = function (x, y) {
            var node = IMG.root;
            while (node.children != null) {
                var i = node.position_x;
                var j = node.position_y;
                var result = 0;
                if (x > i) {
                    result += 1;
                }
                if (y > j) {
                    result += 2;
                }
                node = node.children[result];
            }
            return node;
        };
        return IMG;
    })();
    Graph.IMG = IMG;
})(Graph || (Graph = {}));
//# sourceMappingURL=graph.js.map