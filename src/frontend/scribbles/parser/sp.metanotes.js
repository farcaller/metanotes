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
 * id: 01ER0ARXA9VC7X8VGST77TJDSB
 * content-type: application/vnd.metanotes.component-jsmodule
 * title: $:core/parser/Sp
 * tags: ['$:core/parser']
 * parser: Sp
 */

function Sp(r) {
  return r.SpaceChar.many().tie();
}

export default Sp;
