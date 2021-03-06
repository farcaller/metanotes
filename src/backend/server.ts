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

import { exit } from 'process';

import * as grpc from '@grpc/grpc-js';
import * as emptyPb from 'google-protobuf/google/protobuf/empty_pb';

import * as pb from '../common/api/api_pb';
import * as grpcPb from '../common/api/api_grpc_pb';
import Store from './store';

function getScribble(store: Store): grpc.handleUnaryCall<pb.GetScribbleRequest, pb.GetScribbleReply> {
  return async (call, callback) => {
    try {
      const s = await store.getScribble(call.request.getId());
      const rep = new pb.GetScribbleReply();
      rep.setScribble(s);
      callback(null, rep);
    } catch (e) {
      callback(e, null);
    }
  };
}

function getAllMetadata(store: Store): grpc.handleUnaryCall<emptyPb.Empty, pb.GetAllMetadataReply> {
  return async (_, callback) => {
    try {
      const scribbles = await store.getAllMetadata();
      const rep = new pb.GetAllMetadataReply();
      rep.setScribbleList(scribbles);
      callback(null, rep);
    } catch (e) {
      callback(e, null);
    }
  };
}

function setScribble(store: Store): grpc.handleUnaryCall<pb.SetScribbleRequest, emptyPb.Empty> {
  return async (call, callback) => {
    try {
      // eslint-rationale: will fail the try{} block
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await store.setScribble(call.request.getScribble()!);
      callback(null, new emptyPb.Empty());
    } catch (e) {
      callback(e, null);
    }
  };
}

function removeScribble(store: Store): grpc.handleUnaryCall<pb.RemoveScribbleRequest, emptyPb.Empty> {
  return async (call, callback) => {
    try {
      await store.removeScribble(call.request.getId());
      callback(null, new emptyPb.Empty());
    } catch (e) {
      callback(e, null);
    }
  };
}

function getScribblesByTextSearch(store: Store):
    grpc.handleUnaryCall<pb.GetScribblesByTextSearchRequest, pb.GetScribblesByTextSearchReply> {
  return async (call, callback) => {
    try {
      const result = await store.getScribblesByTextSearch(call.request.getQuery());
      const rep = new pb.GetScribblesByTextSearchReply();
      rep.setResultList(result);
      callback(null, rep);
    } catch (e) {
      callback(e, null);
    }
  };
}

export default function runServer(bind: string, store: Store): void {
  const server = new grpc.Server({
    'grpc.max_send_message_length': -1,
    'grpc.max_receive_message_length': -1,
    'grpc.initial_reconnect_backoff_ms': 5000,
  });
  server.addService(grpcPb.MetanotesService as never, {
    getScribble: getScribble(store),
    getAllMetadata: getAllMetadata(store),
    setScribble: setScribble(store),
    removeScribble: removeScribble(store),
    getScribblesByTextSearch: getScribblesByTextSearch(store),
  });
  try {
    server.bindAsync(bind, grpc.ServerCredentials.createInsecure(), (e) => {
      if (e) {
        console.log('failed to bind:', e);
        exit(1);
      }
      server.start();
    });
  } catch (e) {
    console.log('failed to bind:', e);
    exit(1);
  }
}
