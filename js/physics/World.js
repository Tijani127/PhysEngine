import { Vector } from './Vector.js';
import { Body } from './Body.js';

export class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.bodies = [];
        this.gravity = new Vector(0, 500);
    }

    addBody(body) {
        this.bodies.push(body);
    }

    clear() {
        this.bodies = [];
        this.gravity = new Vector(0, 500);
    }

    update(dt) {
        const subSteps = 8;
        const subDt = dt / subSteps;

        for (let i = 0; i < subSteps; i++) {
            this.step(subDt);
        }
    }

    step(dt) {
        for (const body of this.bodies) {
            // Apply Gravity
            if (body.inverseMass > 0) {
                body.acc = body.acc.add(this.gravity);
            }

            body.update(dt);
            this.checkBoundaries(body);
        }

        this.checkCollisions();
    }

    checkBoundaries(body) {
        const restitution = 0.5;

        if (body.type === 'circle') {
            if (body.pos.y + body.radius > this.height) {
                body.pos.y = this.height - body.radius;
                body.vel.y *= -restitution;
            }
            if (body.pos.x + body.radius > this.width) {
                body.pos.x = this.width - body.radius;
                body.vel.x *= -restitution;
            }
            if (body.pos.x - body.radius < 0) {
                body.pos.x = body.radius;
                body.vel.x *= -restitution;
            }
        } else if (body.type === 'rect') {
            if (body.pos.y + body.height > this.height) {
                body.pos.y = this.height - body.height;
                body.vel.y *= -restitution;
            }
            if (body.pos.x + body.width > this.width) {
                body.pos.x = this.width - body.width;
                body.vel.x *= -restitution;
            }
            if (body.pos.x < 0) {
                body.pos.x = 0;
                body.vel.x *= -restitution;
            }
        }
    }

    checkCollisions() {
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                this.resolveCollision(this.bodies[i], this.bodies[j]);
            }
        }
    }

    resolveCollision(a, b) {
        if (a.type === 'circle' && b.type === 'circle') {
            this.resolveCircleToCircle(a, b);
        } else if (a.type === 'rect' && b.type === 'rect') {
            this.resolveRectToRect(a, b);
        } else if (a.type === 'circle' && b.type === 'rect') {
            this.resolveCircleToRect(a, b);
        } else if (a.type === 'rect' && b.type === 'circle') {
            this.resolveCircleToRect(b, a);
        }
    }

    resolveCircleToCircle(a, b) {
        const dist = a.pos.dist(b.pos);
        const minDist = a.radius + b.radius;

        if (dist < minDist) {
            const normal = a.pos.sub(b.pos).normalize();
            const penetration = minDist - dist;
            this.applyResolution(a, b, normal, penetration);
        }
    }

    resolveRectToRect(a, b) {
        // AABB Collision
        const aHalfW = a.width / 2;
        const aHalfH = a.height / 2;
        const bHalfW = b.width / 2;
        const bHalfH = b.height / 2;

        const aCenter = new Vector(a.pos.x + aHalfW, a.pos.y + aHalfH);
        const bCenter = new Vector(b.pos.x + bHalfW, b.pos.y + bHalfH);

        const d = aCenter.sub(bCenter);
        const overlapX = aHalfW + bHalfW - Math.abs(d.x);
        const overlapY = aHalfH + bHalfH - Math.abs(d.y);

        if (overlapX > 0 && overlapY > 0) {
            let normal;
            let penetration;

            if (overlapX < overlapY) {
                penetration = overlapX;
                normal = new Vector(d.x > 0 ? 1 : -1, 0);
            } else {
                penetration = overlapY;
                normal = new Vector(0, d.y > 0 ? 1 : -1);
            }

            this.applyResolution(a, b, normal, penetration);
        }
    }

    resolveCircleToRect(circle, rect) {
        const rectHalfW = rect.width / 2;
        const rectHalfH = rect.height / 2;
        const rectCenter = new Vector(rect.pos.x + rectHalfW, rect.pos.y + rectHalfH);

        const dist = circle.pos.sub(rectCenter);

        const clampedX = Math.max(-rectHalfW, Math.min(rectHalfW, dist.x));
        const clampedY = Math.max(-rectHalfH, Math.min(rectHalfH, dist.y));

        const closest = rectCenter.add(new Vector(clampedX, clampedY));
        const diff = circle.pos.sub(closest);

        const distanceVal = diff.mag();

        if (distanceVal < circle.radius) {
            let normal = diff.normalize();
            let penetration = circle.radius - distanceVal;

            if (distanceVal === 0) {
                if (Math.abs(dist.x) > Math.abs(dist.y)) {
                    normal = new Vector(dist.x > 0 ? 1 : -1, 0);
                    penetration = rectHalfW - Math.abs(dist.x) + circle.radius;
                } else {
                    normal = new Vector(0, dist.y > 0 ? 1 : -1);
                    penetration = rectHalfH - Math.abs(dist.y) + circle.radius;
                }
            }

            this.applyResolution(circle, rect, normal, penetration);
        }
    }

    applyResolution(a, b, normal, penetration) {
        const totalInverseMass = a.inverseMass + b.inverseMass;
        if (totalInverseMass === 0) return;

        // Position Correction
        const percent = 0.2;
        const slop = 0.01;
        const correctionMag = Math.max(penetration - slop, 0) / totalInverseMass * percent;
        const correction = normal.mult(correctionMag);

        a.pos = a.pos.add(correction.mult(a.inverseMass));
        b.pos = b.pos.sub(correction.mult(b.inverseMass));

        // Velocity Resolution
        const relativeVel = a.vel.sub(b.vel);
        const velAlongNormal = relativeVel.x * normal.x + relativeVel.y * normal.y;

        if (velAlongNormal > 0) return;

        const e = Math.min(a.restitution, b.restitution);
        let j = -(1 + e) * velAlongNormal;
        j /= totalInverseMass;

        const impulse = normal.mult(j);

        a.vel = a.vel.add(impulse.mult(a.inverseMass));
        b.vel = b.vel.sub(impulse.mult(b.inverseMass));
    }

    draw(ctx) {
        for (const body of this.bodies) {
            body.draw(ctx);
        }
    }
}
