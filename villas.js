var images = [];
var villas = [];

function preload() {
    for (let i = 1; i <= 18; i++) {
        images.push(loadImage(`img/F__${i}.png`));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(10);

    for (const img of images) {
        villas.push(new Villa(img));
    }
}

function draw() {
    background('rgba(255, 255, 255, 0.6)');
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
    this.pos = createVector(
        round(random(width - this.w)),
        round(random(height - this.h)));
    this.from = this.pos.copy();
    this.to = this.pos.copy();
    this.pace = 'slow';
}

Villa.prototype.update = function () {
    if (this.pos.dist(this.to) < min(this.w, this.h)) {
        this.from = this.to.copy();
        this.to = this.newDirection();
    }

    let v = this.velocity();
    let direction = p5.Vector.sub(this.to, this.pos).normalize();
    let transposition = p5.Vector.mult(direction, v);
    this.pos.add(transposition);
};

Villa.prototype.draw = function () {
    image(this.img, this.pos.x, this.pos.y);
};

Villa.prototype.newDirection = function () {
    return createVector(
        round(random(width - this.w)),
        round(random(height - this.h)));
}

Villa.prototype.velocity = function () {
    let diagonal = sqrt(sq(width) + sq(height));
    let fr = frameRate();
    if (fr === 0) return 0;
    let maxVelocity = diagonal / (10 * fr);
    let minVelocity = maxVelocity / 10;

    let behind = this.pos.dist(this.from);
    let ahead = this.pos.dist(this.to);
    let progress = behind / (behind + ahead);
    // point on quadratic curve
    let velocity = (-4 * (maxVelocity - minVelocity)  * sq(progress))
        + 4 * (maxVelocity - minVelocity)  * progress 
        + minVelocity;

    return velocity;
}