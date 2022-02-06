import { makeAutoObservable } from 'mobx';
import { ulid } from 'ulid';

import { ScribblesStore } from './scribbles-store';
import Version, { VersionID } from './version';

export type ScribbleID = string;
export type ScribbleSlug = string;

export type CoreScribble = {
  id: string;
  attributes: { [key: string]: unknown };
  body: string;
};

export class Scribble {
  private readonly store: ScribblesStore;

  readonly scribbleID: ScribbleID;

  private $versionsByID: Map<VersionID, Version> = new Map();

  constructor(store: ScribblesStore, scribbleID: ScribbleID = ulid()) {
    makeAutoObservable<Scribble, 'toString' | 'store'>(this, {
      scribbleID: false,
      toString: false as never,
      store: false,
    });
    this.scribbleID = scribbleID;
    this.store = store;
  }

  static fromCoreScribble(
    store: ScribblesStore,
    coreScribble: CoreScribble
  ): Scribble {
    const s = new Scribble(store, coreScribble.id);
    const v = Version.fromCoreScribble(s, coreScribble);
    s.$versionsByID.set(v.versionID, v);

    return s;
  }

  get latestStableVersion(): Version | undefined {
    const allVersions = Array.from(this.$versionsByID.keys()).sort().reverse();
    for (const versionID of allVersions) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const version = this.$versionsByID.get(versionID)!;
      if (!version.meta.isDraft) {
        return version;
      }
    }
    return undefined;
  }

  toJSON(): unknown {
    return {
      scribbleID: this.scribbleID,
    };
  }
}
