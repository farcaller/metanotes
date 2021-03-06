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

/* eslint-disable no-console */

import process, { exit } from 'process';

import runServer from './server';
import Store from './store';

const args = process.argv.slice(2);

console.log(`running on ${args[1]} serving from ${args[0]}`);

const store = new Store(args[0]);

store.init().then(() => runServer(args[1], store)).catch((e) => {
  console.log(e);
  exit(1);
});
