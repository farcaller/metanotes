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

import React, { PropsWithChildren, ReactElement } from 'react';

import { useTypedSelector } from '../../../../../store';
import { selectAllScribbles } from '../../../../../store/features/scribbles';
// eslint-disable-next-line import/no-cycle
import PipelineStep from '../PipelineStep';
// eslint-disable-next-line import/no-cycle
import { CmdletProps } from '../cmdlets';

function GetScribbles({
  flags,
  pipeline,
  as,
  children,
}: PropsWithChildren<CmdletProps>): JSX.Element {
  const output = useTypedSelector((state) => {
    let sc = selectAllScribbles(state);

    if (flags.Core !== 'true') {
      sc = sc.filter((s) => s.status !== 'core');
    }

    return sc;
  });

  return <PipelineStep input={output} pipeline={pipeline} as={as}>{children as ReactElement}</PipelineStep>;
}

export default GetScribbles;
