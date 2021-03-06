// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* attributes *
 * id: 01ENXNQD82ASJ0V5CJYAKRYHEW
 * content-type: application/vnd.metanotes.component-jsmodule
 * title: $:core/ui/scribble-container
 */

const { useMemo, useEffect, useState } = React;
const { useSelector, selectScribbleById, useScribble, useDispatch, fetchScribble, equals, removeScribble } = core;
const { ErrorBoundary, LinearProgress, Alert, Card, CardContent, useHistory, useCoreEvents } = components;

function ScribbleContainer({ id }) {
  const scribble = useSelector(state => {
    const sc = selectScribbleById(state, id);
    return {
      id: sc.id,
      status: sc.status,
      error: sc.error,
      attributes: {
        'content-type': sc.attributes['content-type'],
        'mn-draft-of': sc.attributes['mn-draft-of'],
        title: sc.attributes.title,
      }
    };
  }, equals);

  const dispatch = useDispatch();
  const Renderer = useScribble(`$:core/renderer/${scribble.attributes['content-type']}`);
  const Editor = useScribble(`$:core/editor/${scribble.attributes['content-type']}`);
  const Header = useScribble(`$:core/ui/scribble-card-header`);
  const ContentTypeEditor = useScribble(`$:core/ui/scribble-content-type-editor`);
  const AttributesEditor = useScribble(`$:core/ui/scribble-attributes-editor`);

  const isEditing = useMemo(() => scribble.attributes['mn-draft-of'] !== undefined, [scribble]);

  const contentEl = useMemo(() => {
    switch (scribble.status) {
      case 'core':
      case 'synced':
        if (isEditing) {
          return <>
            <Editor id={id} />
            <div style={{ marginTop: 14 }}>
              <ContentTypeEditor id={id} />
            </div>
            <div style={{ marginTop: 14 }}>
              <AttributesEditor id={id} />
            </div>
          </>;
        } else {
          return (<Renderer id={id} />);
        }
      case 'syncedMetadataOnly':
        return <LinearProgress />;
      case 'pullingBody':
        return <LinearProgress/>;
      case 'failed':
        {
          const title = scribble.attributes.title ? '(' + scribble.attributes.title + ')' : '';
          return <Alert severity="error">failed to fetch the scribble {id}{title}: <code>{scribble.error}</code></Alert>;
        }
    }
  }, [id, isEditing, scribble]);

  // TODO: I don't quite understand the mechanics but having this outside useEffect causes a render loop
  useEffect(() => {
    if (scribble.status === 'syncedMetadataOnly') {
      dispatch(fetchScribble(scribble));
    }
  }, [id, scribble]);

  return (
    <Card>
      <Header id={id} />
      <CardContent>
        <ErrorBoundary>
          {contentEl}
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

export default React.memo(ScribbleContainer);
