import { resolveScribble } from './index';

describe('resolveScribble', () => {
  it('resolves scribbles', () => {
    const result = resolveScribble({
      scribbleID: '',
      latestStableVersion: {
        versionID: '',
        body: 'export default 42;',
      },
    });
    expect(result).toEqual(42);
  });

  it('fails to eval a scribble with no resolved body', () => {
    expect(() =>
      resolveScribble({
        scribbleID: '123',
        latestStableVersion: {
          versionID: '456',
          body: null,
        },
      })
    ).toThrowError(
      'failed to transpile the body of scribble 123 version 456: no body available'
    );
  });

  it('fails to eval a scribble with no stable versions', () => {
    expect(() =>
      resolveScribble({
        scribbleID: '123',
      })
    ).toThrowError(
      'failed to transpile the body of scribble 123: no stable version available'
    );
  });
});
