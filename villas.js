var images = [];
var villas = [];

function preload() {
    for (let i = 1; i <= 18; i++) {
        images.push(loadImage(`img/F__${i}.png`));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (const img of images) {
        villas.push(new Villa(img));
    }
}

function draw() {
    background('rgba(255, 255, 255, 0.1)');
    for (const villa of villas) {
        villa.update();
        villa.draw();
    }
}

function Villa(image) {
    // TODO: scale images
    this.img = image;
    this.w = image.width;
    this.h = image.height;
    this.x = random(width - this.w);
    this.y = random(height - this.h);
}

Villa.prototype.update = (delta) => {

}

Villa.prototype.draw = function () {
    image(this.img, this.x, this.y);
};