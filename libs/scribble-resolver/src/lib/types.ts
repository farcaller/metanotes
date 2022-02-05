export interface Version {
  readonly versionID: string;
  readonly body: string | null;
}

export interface Scribble {
  readonly scribbleID: string;
  readonly latestStableVersion?: Version;
}
