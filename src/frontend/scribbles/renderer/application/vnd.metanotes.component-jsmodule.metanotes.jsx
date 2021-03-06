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
 * id: 01EP4N4J73R8GE5BEXDS9QG9GH
 * content-type: application/vnd.metanotes.component-jsmodule
 * title: $:core/renderer/application/vnd.metanotes.component-jsmodule
 */

const { useSelector, selectScribbleById } = core;
const { SyntaxHighlighter } = components;

function SyntaxHighlighterRenderer({ id }) {
  const body = useSelector(state => selectScribbleById(state, id).body);

  return (
    <SyntaxHighlighter
      lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
      wrapLines={true}
      language="javascript"
      showLineNumbers={false}
    >
      {body}
    </SyntaxHighlighter>
  );
}

export default React.memo(SyntaxHighlighterRenderer);
