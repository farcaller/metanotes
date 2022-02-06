import { Story, Meta } from '@storybook/react';
import { ReactNode } from 'react';

import { resolveScribble } from '@metanotes/scribble-resolver';
import { Scribble } from '@metanotes/scribbles-store';

import HelloWorldScribble from '@scribbles//core/test/hello-world';

const HelloWorld = resolveScribble<React.FC>(
  Scribble.fromCoreScribble(null, HelloWorldScribble)
);

export default {
  component: HelloWorld,
  title: 'HelloWorld',
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div style={{ height: '100vh' }}>{children}</div>
);

const Template: Story<any> = (args) => (
  <Wrapper>
    <HelloWorld {...args} />
  </Wrapper>
);

export const Primary = Template.bind({});
Primary.args = {
  initialText: '# hello world\n\nthis is a **bold** part and this is *italic*.',
};
