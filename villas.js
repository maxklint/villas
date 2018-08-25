var images = [];
var villas = [];
var drawDebug = false;
var framerate = 15;

function preload() {
    for (let i = 1; i <= 18; i++) {
        images.push(loadImage(`img/F__${i}.png`));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(framerate);

    for (const img of images) {
        villas.push(new Villa(img));
    }
}

function draw() {
    background('rgba(255, 255, 255, 0.5)');
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
    this.pos = createVector(round(random(width - this.w)), round(random(height - this.h)));
    this.curve = {
        from: this.pos.copy(),
        cp1: createVector(round(random(width - this.w)), round(random(height - this.h))),
        cp2: createVector(round(random(width - this.w)), round(random(height - this.h))),
        to: createVector(round(random(width - this.w)), round(random(height - this.h)))
    }
    this.from = this.pos.copy();
    this.to = this.pos.copy();
    this.step = 0;
    this.steps = 30;
    this.pace = 'slow';
    this.wait = round(random(1, framerate * 2));
}

Villa.prototype.update = function () {
    if (this.step === this.steps) {
        this.step = 0;
        this.curve = this.newCurve();
        this.from = this.pos.copy();
        this.to = this.pos.copy();
        this.wait = round(random(frameRate() * 5));
    }

    if (this.wait > 0) {
        this.wait--;
        return;
    }

    if (this.pos.dist(this.to) < min(this.w, this.h)) {
        this.from = this.to.copy();
        this.to = createVector(
            bezierPoint(this.curve.from.x, this.curve.cp1.x,
                this.curve.cp2.x, this.curve.to.x, (this.step + 1) / this.steps),
            bezierPoint(this.curve.from.y, this.curve.cp1.y,
                this.curve.cp2.y, this.curve.to.y, (this.step + 1) / this.steps));
        this.step++;
    }

    let v = this.velocity();
    let direction = p5.Vector.sub(this.to, this.pos).normalize();
    let transposition = p5.Vector.mult(direction, v);
    this.pos.add(transposition);
};

Villa.prototype.draw = function () {
    image(this.img, this.pos.x, this.pos.y);

    if (drawDebug) {
        push();
        noFill();
        bezier(this.curve.from.x, this.curve.from.y,
            this.curve.cp1.x, this.curve.cp1.y,
            this.curve.cp2.x, this.curve.cp2.y,
            this.curve.to.x, this.curve.to.y);
        for (var i = 0; i <= this.steps; i++) {
            if (i === this.step) {
                fill(0);
            } else {
                fill(255);
            }
            var t = i / this.steps;
            var x = bezierPoint(this.curve.from.x, this.curve.cp1.x, this.curve.cp2.x, this.curve.to.x, t);
            var y = bezierPoint(this.curve.from.y, this.curve.cp1.y, this.curve.cp2.y, this.curve.to.y, t);
            ellipse(x, y, 5, 5);
        }
        line(this.from.x, this.from.y, this.to.x, this.to.y);
        pop();
    }
};

Villa.prototype.newCurve = function () {
    return {
        from: this.pos.copy(),
        cp1: createVector(round(random(width - this.w)), round(random(height - this.h))),
        cp2: createVector(round(random(width - this.w)), round(random(height - this.h))),
        to: createVector(round(random(width - this.w)), round(random(height - this.h)))
    };
}

Villa.prototype.velocity = function () {
    let diagonal = sqrt(sq(width) + sq(height));
    let fr = frameRate();
    if (fr === 0) return 0;
    let maxVelocity = diagonal / (15 * fr);
    let minVelocity = maxVelocity / 10;

    let progress = this.step / this.steps;
    // point on quadratic curve
    let velocity = (-4 * (maxVelocity - minVelocity) * sq(progress))
        + 4 * (maxVelocity - minVelocity) * progress
        + minVelocity;

    return velocity;
}