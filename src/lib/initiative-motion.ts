export type CardPose = {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  lift: number;
  scale: number;
};

export const flatPose = (): CardPose => ({
  x: 0,
  y: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  lift: 0,
  scale: 1,
});
export const zeroVelocity = (): CardPose => ({ ...flatPose(), scale: 0 });
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** The photo layer fans around its CSS origin, independently of the drag layer. */
export function stackPose(offset: number): CardPose {
  return {
    ...flatPose(),
    rotateZ: offset * 4,
    scale: 1 - offset * 0.064,
  };
}

export function liftedPose(
  x: number,
  y: number,
  reducedMotion = false,
): CardPose {
  return {
    ...flatPose(),
    x,
    y,
    rotateX: reducedMotion ? 0 : clamp(-y * 0.6, -60, 60),
    rotateY: reducedMotion ? 0 : clamp(x * 0.6, -60, 60),
  };
}

export function shouldCycle(distance: number, velocity: number, width: number) {
  return (
    distance > clamp(width * 0.18, 48, 90) || (distance > 24 && velocity > 0.45)
  );
}

/** Analytic spring integration keeps interrupted motion continuous at any frame rate. */
export function stepSpring(
  position: CardPose,
  velocity: CardPose,
  target: CardPose,
  dt: number,
  frequency = 28,
  damping = 1,
) {
  const seconds = clamp(dt, 0, 1 / 15);
  let settled = true;
  for (const key of Object.keys(position) as (keyof CardPose)[]) {
    const responseFrequency = frequency;
    const displacement = position[key] - target[key];
    if (damping < 1) {
      const decayRate = responseFrequency * damping;
      const oscillation = responseFrequency * Math.sqrt(1 - damping * damping);
      const response = (velocity[key] + decayRate * displacement) / oscillation;
      const decay = Math.exp(-decayRate * seconds);
      const sine = Math.sin(oscillation * seconds);
      const cosine = Math.cos(oscillation * seconds);
      const displacementAtTime = displacement * cosine + response * sine;
      position[key] = target[key] + decay * displacementAtTime;
      velocity[key] =
        decay *
        (-decayRate * displacementAtTime +
          oscillation * (response * cosine - displacement * sine));
    } else if (damping > 1) {
      const root = Math.sqrt(damping * damping - 1);
      const slow = -responseFrequency * (damping - root);
      const fast = -responseFrequency * (damping + root);
      const a = (velocity[key] - fast * displacement) / (slow - fast);
      const b = displacement - a;
      const slowDecay = Math.exp(slow * seconds);
      const fastDecay = Math.exp(fast * seconds);
      position[key] = target[key] + a * slowDecay + b * fastDecay;
      velocity[key] = a * slow * slowDecay + b * fast * fastDecay;
    } else {
      const response = velocity[key] + responseFrequency * displacement;
      const decay = Math.exp(-responseFrequency * seconds);
      position[key] = target[key] + (displacement + response * seconds) * decay;
      velocity[key] =
        (velocity[key] - responseFrequency * response * seconds) * decay;
    }
    const precision = key === "scale" ? 0.0002 : 0.02;
    if (
      Math.abs(target[key] - position[key]) > precision ||
      Math.abs(velocity[key]) > precision * 10
    )
      settled = false;
  }
  if (settled) {
    Object.assign(position, target);
    Object.assign(velocity, zeroVelocity());
  }
  return settled;
}

export function poseTransform(pose: CardPose, perspective = true) {
  const depth = perspective ? "perspective(600px) " : "";
  return `${depth}translate3d(${pose.x}px, ${pose.y}px, ${pose.lift}px) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg) rotateZ(${pose.rotateZ}deg) scale(${pose.scale})`;
}
