import { observer } from 'mobx-react-lite';

import { useStore } from '@metanotes/scribbles-store';
import { ScribbleRenderer } from './ScribbleRenderer';

function AppChrome() {
  const store = useStore();

  const helloWorldScribble = store.scribbleBySlug('core/test/hello-world');

  return (
      <ScribbleRenderer scribble={helloWorldScribble}/>
  );
}

export default observer(AppChrome);
