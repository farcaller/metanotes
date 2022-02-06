import { makeAutoObservable } from 'mobx';
import { ulid, decodeTime } from 'ulid';

import { Scribble, ScribbleID, CoreScribble } from './scribble';
import ComputedMetadata from './metadata';

export type VersionID = string;

function coreVersionForScribbleID(scribbleID: ScribbleID): VersionID {
  return `0000000000${scribbleID.substring(10, scribbleID.length - 4)}CORE`;
}

export default class Version {
  readonly scribble: Scribble;
  readonly versionID: VersionID;
  private $body: string | null;
  private readonly $meta: Map<string, string>;
  private $computedMeta: ComputedMetadata;

  constructor(
    scribble: Scribble,
    versionID: VersionID = ulid(),
    meta: Map<string, string>,
    body?: string,
  ) {
    makeAutoObservable<Version, 'toString'|'scribble'>(this, {
      versionID: false,
      toString: false as never,
      scribble: false,
    });
    this.versionID = versionID;
    this.$meta = meta;
    this.$computedMeta = new ComputedMetadata(meta);
    this.$body = body ?? null;
    this.scribble = scribble;
  }

  get creationDate(): Date {
    return new Date(decodeTime(this.versionID));
  }

  toString(): string {
    let desc = `${this.versionID}`;
    if (this.meta.title !== '') {
      desc += ` "${this.meta.title}"`;
    }
    return desc;
  }

  static fromCoreScribble(scribble: Scribble, coreScribble: CoreScribble): Version {
    const m = new Map();
    for (const k of Object.keys(coreScribble.attributes)) {
      m.set(k, coreScribble.attributes[k]);
    }
    const v = new Version(scribble, coreVersionForScribbleID(coreScribble.id), m, coreScribble.body);

    return v;
  }

  toJSON(): unknown {
    return {
      versionID: this.versionID,
    };
  }

  get body(): string | null {
    return this.$body;
  }

  get meta(): ComputedMetadata {
    return this.$computedMeta;
  }
}
