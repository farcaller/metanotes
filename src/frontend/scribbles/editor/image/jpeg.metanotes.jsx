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
 * id: 01EQ448BAYWZPVMPGF9JJY0ZYR
 * content-type: application/vnd.metanotes.component-jsmodule
 * title: $:core/editor/image/jpeg
 */

const { useSelector, selectScribbleById } = core;
const { PropTypes } = components;

function ImageEditor({ id }) {
  const binaryBodyURL = useSelector((state) => selectScribbleById(state, id).binaryBodyURL);

  return <img src={binaryBodyURL} alt="" />;
}

ImageEditor.propTypes = {
  id: PropTypes.string.isRequired,
};

export default React.memo(ImageEditor);
