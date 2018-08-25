var images = [];
var villas = [];

function preload() {
    for (let i = 1; i <= 18; i++) {
        images.push(loadImage(`img/F__${i}.png`));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(15);

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
    this.from = this.pos;
    this.to = this.pos;
    this.pace = 'slow';
}

Villa.prototype.update = function () {
    if (this.pos.dist(this.to) < min(this.w, this.h)) {
        this.from = this.to;
        this.to = this.newDirection();
    }

    let speed = this.getSpeed();
    let direction = p5.Vector.sub(this.to, this.pos).normalize();
    let transposition = p5.Vector.mult(direction, speed);
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

Villa.prototype.getSpeed = function () {
    // let behind = this.pos.dist(this.from);
    // let ahead = this.pos.dist(this.to);
    // let progress = behind / (behind + ahead);

    // let trajectory = this.to.sub(this.from);
    // let distance = trajectory.mag();
    // let direction = this.to.sub(this.pos);
    // let speed = direction.setMag(distance / 10);
    // return speed;

    // TODO: calculate based on pace and progress
    let diagonal = sqrt(sq(width) + sq(height));
    let fr = frameRate();
    if(fr === 0) return 0;
    return diagonal / ( 10 * fr);
}