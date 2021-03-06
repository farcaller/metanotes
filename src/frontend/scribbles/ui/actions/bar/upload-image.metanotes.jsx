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
 * id: 01EV1AWP44GA75H5PTZGPNZY36
 * content-type: application/vnd.metanotes.component-jsmodule
 * title: $:core/ui/actions/bar/upload-image
 * tags: ['$:core/ui/actions-bar']
 */

const { useCallback } = React;
const { useDispatch, createDraftScribble, ulid } = core;
const { Icon, IconButton, useHistory } = components;


function UploadImageAction({ id }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const onUploadImage = useCallback((evt) => {
    const file = evt.target.files[0];
    const blobURL = window.URL.createObjectURL(file);
    const scribble = {
      id: ulid(),
      binaryBodyURL: blobURL,
      attributes: {
        'content-type': file.type,
        'mn-draft-of': '',
      },
      status: 'synced',
    };

    dispatch(createDraftScribble(scribble));
    history.push(`/${scribble.id}`);
  }, [dispatch, history]);

  return <>
    <input accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" onChange={onUploadImage} />
    <label htmlFor="icon-button-file">
      <IconButton color="primary" aria-label="upload picture" component="span">
        <Icon>photo_camera</Icon>
      </IconButton>
    </label>
  </>;
}

export default React.memo(UploadImageAction);
