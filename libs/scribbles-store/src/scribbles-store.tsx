import { makeAutoObservable } from 'mobx';

import { CoreScribble, Scribble, ScribbleID, ScribbleSlug } from './scribble';

export class ScribblesStore {
  protected $scribblesByID: Map<ScribbleID, Scribble> = new Map();
  protected $scribblesBySlug: Map<ScribbleSlug, Scribble> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  scribbleBySlug(slug: string): Scribble | undefined {
    return this.$scribblesBySlug.get(slug);
  }

  loadCoreScribbles(scribbles: CoreScribble[]) {
    for (const scribble of scribbles) {
      this.loadCoreScribble(scribble);
    }
  }

  private loadCoreScribble(coreScribble: CoreScribble) {
    const scribble = Scribble.fromCoreScribble(this, coreScribble);
    this.$scribblesByID.set(scribble.scribbleID, scribble);
    const slug = scribble.latestStableVersion?.meta.slug ?? '';
    if (slug !== '') {
      this.$scribblesBySlug.set(slug, scribble);
    }
  }
}
