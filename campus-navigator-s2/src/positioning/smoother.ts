import { CalculatedPosition } from '../services/positionEngine';

const MAX_HISTORY = 10;

// ... rest of your smoothing logic

export class PositionSmoother {
  private history: CalculatedPosition[] = [];

  /**
   * Adds a new raw position and returns a smoothed average.
   */
  smooth(newPos: CalculatedPosition): CalculatedPosition {
    // 1. Add new position to history
    this.history.push(newPos);

    // 2. Keep only the most recent N samples
    if (this.history.length > MAX_HISTORY) {
      this.history.shift();
    }

    // 3. If it's the first sample, return it directly
    if (this.history.length === 1) return newPos;

    // 4. Calculate the average X, Y, and confidence
    const sum = this.history.reduce(
      (acc, pos) => ({
        x: acc.x + pos.x,
        y: acc.y + pos.y,
        confidence: acc.confidence + pos.confidence,
      }),
      { x: 0, y: 0, confidence: 0 }
    );

    const count = this.history.length;

    return {
      x: sum.x / count,
      y: sum.y / count,
      floor: newPos.floor, // Floor changes are discrete; don't average them
      confidence: sum.confidence / count,
    };
  }
}

export const positionSmoother = new PositionSmoother();