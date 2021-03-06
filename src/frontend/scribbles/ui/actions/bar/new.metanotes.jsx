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
 * id: 01EV1AR2SGRNXDYW734DY00XK6
 * content-type: application/vnd.metanotes.component-jsmodule
 * title: $:core/ui/actions/bar/new
 * tags: ['$:core/ui/actions-bar']
 */

const { useCallback } = React;
const { useDispatch, createDraftScribble, ulid } = core;
const { Icon, IconButton, useHistory } = components;


function NewAction({ id }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const onCreateNew = useCallback(() => {
    const scribble = {
      id: ulid(),
      body: '',
      attributes: {
        'content-type': 'text/markdown',
        'mn-draft-of': '',
      },
      status: 'synced',
    };

    dispatch(createDraftScribble(scribble));
    history.push(`/${scribble.id}`);
  }, [dispatch, history]);

  return (
    <IconButton color="primary" aria-label="create scribble" onClick={onCreateNew}>
      <Icon>note_add</Icon>
    </IconButton>
  )
}

export default React.memo(NewAction);
