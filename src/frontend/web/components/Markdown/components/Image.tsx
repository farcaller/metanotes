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

import React from 'react';
import { makeStyles } from '@material-ui/core';

import { ImageProps } from '../../../../metamarkdown/ast/components';

const useStyles = makeStyles({
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
});

function Image({ url, title, alt }: React.PropsWithChildren<ImageProps>): JSX.Element {
  const classes = useStyles();
  return <img className={classes.image} src={url} title={title} alt={alt} />;
}

export default React.memo(Image);
