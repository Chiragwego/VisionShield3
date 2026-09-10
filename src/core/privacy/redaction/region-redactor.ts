import type { BoundingBox } from "../../perception/types";

export interface RedactedRegion {
  readonly bounds: BoundingBox;
  readonly replacement: string;
}

export class RegionRedactor {
  redact(
    regions: readonly {
      bounds?: BoundingBox;
      replacement: string;
    }[],
  ): RedactedRegion[] {
    return regions
      .filter(
        (region): region is {
          bounds: BoundingBox;
          replacement: string;
        } => region.bounds !== undefined,
      )
      .map((region) => ({
        bounds: region.bounds,
        replacement: region.replacement,
      }));
  }
}
