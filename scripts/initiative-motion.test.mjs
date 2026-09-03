import assert from "node:assert/strict";
import { test } from "node:test";
import {
  flatPose,
  zeroVelocity,
  liftedPose,
  stepSpring,
  shouldCycle,
  stackPose,
} from "../src/lib/initiative-motion.ts";

test("drag tilt tracks distance immediately without changing photo size", () => {
  const pose = liftedPose(180, -100);
  assert.equal(pose.lift, 0);
  assert.equal(pose.scale, 1);
  assert.ok(pose.rotateX > 0 && pose.rotateY > 0);
  assert.equal(pose.rotateZ, 0);
  assert.deepEqual([pose.x, pose.y], [180, -100]);
});

test("extreme flicks keep 3D rotation bounded", () => {
  const pose = liftedPose(5000, -5000);
  assert.ok(Math.abs(pose.rotateX) <= 60);
  assert.ok(Math.abs(pose.rotateY) <= 60);
  assert.ok(Math.abs(pose.rotateZ) <= 28);
});

test("reduced motion keeps direct drag without spin or lift", () => {
  assert.deepEqual(liftedPose(35, 50, true), {
    ...flatPose(),
    x: 35,
    y: 50,
  });
});

test("a small slow drag returns; a deliberate drag or flick cycles", () => {
  assert.equal(shouldCycle(18, 0.1, 400), false);
  assert.equal(shouldCycle(35, 0.1, 400), false);
  assert.equal(shouldCycle(100, 0.1, 400), true);
  assert.equal(shouldCycle(30, 0.8, 400), true);
  assert.equal(shouldCycle(8, 4, 400), false);
});

test("spring converges to the resting stack without losing a card", () => {
  const position = liftedPose(-240, 150);
  const velocity = zeroVelocity();
  const target = { ...flatPose(), x: 44, y: 26, rotateZ: 5.2 };
  let settled = false;
  for (let i = 0; i < 240 && !settled; i++)
    settled = stepSpring(position, velocity, target, 1 / 60);
  assert.ok(settled);
  assert.deepEqual(position, target);
});

test("a long frame does not destabilize the spring", () => {
  const position = flatPose();
  const velocity = zeroVelocity();
  stepSpring(position, velocity, { ...flatPose(), x: 200 }, 20);
  assert.ok(position.x > 0 && position.x < 200);
});

test("drag tracking feels the same at 30, 60 and 120 fps", () => {
  const target = { ...flatPose(), x: 200, rotateY: 40 };
  const positions = [30, 60, 120].map((fps) => {
    const position = flatPose();
    const velocity = zeroVelocity();
    for (let frame = 0; frame < fps / 5; frame++)
      stepSpring(position, velocity, target, 1 / fps);
    return position;
  });
  for (const position of positions) {
    assert.ok(Math.abs(position.x - positions[0].x) < 1e-8);
    assert.ok(Math.abs(position.rotateY - positions[0].rotateY) < 1e-8);
    assert.ok(position.x > 190 && position.x <= 200);
  }
});

test("an interrupted return converges to the latest destination", () => {
  const position = liftedPose(-180, 70);
  const velocity = zeroVelocity();
  for (let frame = 0; frame < 8; frame++)
    stepSpring(position, velocity, stackPose(2), 1 / 60, 10);
  const target = stackPose(0);
  let settled = false;
  for (let frame = 0; frame < 60 && !settled; frame++)
    settled = stepSpring(position, velocity, target, 1 / 60, 32);
  assert.ok(settled);
  assert.deepEqual(position, target);
});

test("the stack spring has one small overshoot and settles without a scale snap", () => {
  const position = stackPose(1);
  const velocity = zeroVelocity();
  const target = stackPose(0);
  let maxScale = position.scale;
  let settled = false;
  for (let frame = 0; frame < 42 && !settled; frame++) {
    settled = stepSpring(position, velocity, target, 1 / 60, 20, 0.64);
    maxScale = Math.max(maxScale, position.scale);
  }
  assert.ok(maxScale > 1.002 && maxScale < 1.008);
  assert.ok(settled);
  assert.deepEqual(position, target);
  assert.deepEqual(velocity, zeroVelocity());
});

test("repeated switches retarget the spring continuously and converge at every frame rate", () => {
  for (const damping of [0.64, 2]) {
    const results = [30, 60, 120].map((fps) => {
      const position = { ...stackPose(2), x: -240 };
      const velocity = zeroVelocity();
      let target;
      for (let switchIndex = 0; switchIndex < 12; switchIndex++) {
        target = stackPose(switchIndex % 3);
        for (let frame = 0; frame < fps / 10; frame++)
          stepSpring(position, velocity, target, 1 / fps, 20, damping);
      }
      const interrupted = { ...position };
      for (let frame = 0; frame < fps * 2; frame++)
        stepSpring(position, velocity, target, 1 / fps, 20, damping);
      assert.deepEqual(position, target);
      return interrupted;
    });
    for (const result of results)
      for (const axis of Object.keys(result))
        assert.ok(Math.abs(result[axis] - results[0][axis]) < 1e-8);
  }
});

