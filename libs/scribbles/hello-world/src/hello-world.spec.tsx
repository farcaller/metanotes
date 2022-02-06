import { render } from '@testing-library/react';

import { resolveScribble } from '@metanotes/scribble-resolver';
import { Scribble } from '@metanotes/scribbles-store';

import HelloWorldScribble from '@scribbles//core/test/hello-world';

const HelloWorld = resolveScribble<React.FC>(
  Scribble.fromCoreScribble(null, HelloWorldScribble)
);

describe('HelloWorld', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HelloWorld />);
    expect(baseElement).toBeTruthy();
  });
});
