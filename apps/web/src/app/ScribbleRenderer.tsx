import { Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { FC, memo } from 'react';
import { Scribble } from '@metanotes/scribbles-store';
import { resolveScribble } from '@metanotes/scribble-resolver';

export interface ScribbleWidgetProps {
  scribble?: Scribble;
  [key: string]: unknown;
}

function RenderWidgetImpl({
  scribble,
  props,
}: {
  scribble: Scribble;
  props: { [key: string]: unknown };
}) {
  const WidgetImpl = resolveScribble<FC>(scribble);
  const Widget = observer(WidgetImpl);

  return <Widget {...props} />;
}

const RenderWidget = memo(RenderWidgetImpl);
RenderWidget.displayName = 'RenderWidget';

function ScribbleRendererImpl({ scribble, ...other }: ScribbleWidgetProps) {
  if (scribble === undefined) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  const latestStableVersion = scribble.latestStableVersion;
  const contentType = latestStableVersion?.meta.contentType ?? '__no_version__';

  switch (contentType) {
    case 'application/vnd.metanotes.widget':
      return <RenderWidget scribble={scribble} props={other} />;
    case 'text/markdown':
      // render as js
      return <Text>markdown</Text>;
    default:
      // render as text
      return <Text>default</Text>;
  }
}

export const ScribbleRenderer = observer(ScribbleRendererImpl);
ScribbleRenderer.displayName = 'ScribbleRenderer';
