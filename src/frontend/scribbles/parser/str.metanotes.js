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
 * id: 01ES1SNQG2Y9XP64M8F0GZ4893
 * content-type: application/vnd.metanotes.component-jsmodule
 * title: $:core/parser/Str
 * tags: ['$:core/parser']
 * parser: Str
 */

function Str(r) {
  return r.NormalChar.atLeast(1).map((val) => ({
    type: 'text',
    value: val.join(''),
  }));
}

export default Str;
