import type {
  PerceptionProvider,
  PerceptionSnapshot,
} from "../types";

export class PerceptionFusionEngine {
  constructor(
    private readonly providers: readonly PerceptionProvider[],
  ) {}

  async perceive(): Promise<PerceptionSnapshot> {
    const snapshots = await Promise.all(
      this.providers.map((provider) => provider.perceive()),
    );

    return {
      timestamp: Date.now(),
      viewport: snapshots[0]?.viewport ?? {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      elements: snapshots.flatMap(
        (snapshot) => snapshot.elements,
      ),
      texts: snapshots.flatMap(
        (snapshot) => snapshot.texts,
      ),
      objects: snapshots.flatMap(
        (snapshot) => snapshot.objects,
      ),
    };
  }
}
