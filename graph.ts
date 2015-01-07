module Graph {
    export class color {
        A: number;
        R: number;
        G: number;
        B: number;
        constructor(r: number, g: number, b: number, a: number = 255) {
            this.R = r;
            this.G = g;
            this.B = b;
            this.A = a;
        }


        toString() {
            return "#" + this.R.toString(16) + this.G.toString(16) + this.B.toString(16);
        }
    }

    export class graph {
        position_x: number;
        position_y: number;
        children: Array<graph>;
        constructor(x: number, y: number, child: Array<graph>) {
            this.position_x = x;
            this.position_y = y;
            this.children = child;
        }

        draw(canvas: HTMLCanvasElement) { }
        clear(canvas: HTMLCanvasElement) { }
    }


    export class circle extends graph {
        radius: number;
        c: color;
        constructor(x: number, y: number, r: number, color: color) {
            super(x, y, null);
            this.c = color;
            this.radius = r;
        }

        draw(canvas: HTMLCanvasElement) {
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
        }

        clear(canvas: HTMLCanvasElement) {
            if (this.children == null) {
                var context = canvas.getContext("2d");
                context.clearRect(this.position_x - this.radius, this.position_y - this.radius, this.radius * 2, this.radius * 2);
            }
        }

        addChildren(img: image, canvas: HTMLCanvasElement) {
            this.clear(canvas);
            var r = this.radius / 2;
            if (r < 1) {
                return;
            }
            var topLeft = [this.position_x - r, this.position_y - r];
            this.children = [new circle(topLeft[0], topLeft[1], r, img.getColor(topLeft[0], topLeft[1])),
                new circle(topLeft[0] + 2 * r, topLeft[1], r, img.getColor(topLeft[0] + 2 * r, topLeft[1])),
                new circle(topLeft[0], topLeft[1] + 2 * r, r, img.getColor(topLeft[0], topLeft[1] + 2 * r)),
                new circle(topLeft[0] + 2 * r, topLeft[1] + 2 * r, r, img.getColor(topLeft[0] + 2 * r, topLeft[1] + 2 * r)),
            ];

            this.draw(canvas);
        }

    };


    class image {
        private pixels: number[];
        width: number;
        height: number;
        constructor(canvas: HTMLCanvasElement, width: number, height: number) {
            var context = canvas.getContext("2d");
            this.pixels = context.getImageData(0, 0, width, height).data;

            this.width = width;
            this.height = height;
        }

        getColor(x: number, y: number) {
            var i = Math.floor(x);
            var j = Math.floor(y);
            var start = (j * this.width + i) * 4;
            return new color(this.pixels[start], this.pixels[start + 1], this.pixels[start + 2], this.pixels[start + 3]);
        }
    }

    export class IMG {

        static image: image;
        static root: circle;
        static width: number;
        static height: number;

        constructor(imageCanvas: HTMLCanvasElement, drawingCanvas: HTMLCanvasElement, files: FileList) {
            this.loadFromFile(imageCanvas, drawingCanvas, files);
        }

        private loadFromFile(imageCanvas: HTMLCanvasElement, drawingCanvas:HTMLCanvasElement, files: FileList) {
            var file = files[0];

            var i = 1;
            while (file.type.indexOf("image") ==-1 && i < files.length) {
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
                IMG.root = <circle>(new circle(r, r, r, IMG.image.getColor(r, r)));
                IMG.root.draw(drawingCanvas); // this part broke tons of stuff, so use static instead
            };            

            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e:any) {
                    img.src = e.target.result;
                };
            })(file);
            reader.readAsDataURL(file);
        }

        loaded(f: Function) {
            f();
        }

        getWidth() {
            return IMG.width;
        }

        getHeight() {
            return IMG.height;
        }

        // O(log)
        findCircle(x: number, y: number) {
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

                node = <circle>node.children[result];
            }
            return node;
        }

    }
}