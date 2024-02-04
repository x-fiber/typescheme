import { AnyFn, FnObject, HttpMethod, type UnknownObject } from '../utility';
import { ControllerStructure, HelpersStructure } from '../../src';
import { NAbstractSchemeLoader } from '../loaders';

export type RouteStructure<R extends string = string, H extends string = string> = {
  readonly [key in T]: {
    readonly [key in HttpMethod]?: {
      handler: H;
      params?: string[]; // default []
      isPrivateUser?: boolean; // false
      isPrivateOrganization?: boolean; // false
    };
  };
};

export type EventType =
  | 'handshake:success'
  | 'handshake:error'
  | 'send:session:to:session:success'
  | 'send:session:to:session:error'
  | 'broadcast:session:to:service:success'
  | 'broadcast:session:to:service:error'
  | 'broadcast:session:to:all:success'
  | 'broadcast:session:to:all:error';

export type EmitterStructure<
  E extends string = string,
  H extends string = string,
  B extends string = string
> = {
  readonly [key in E]: {
    type: EventType | EventType[];
    belongTo: B;
    handler: H;
    isPrivateUser?: boolean; // false
    isPrivateOrganization?: boolean; // false
  };
};

export type BrokerStructure<
  S extends string = string,
  H extends string = string,
  B extends string = string
> = {
  readonly [key in S]: {
    handler: H;
    belongTo: B;
    isPrivateUser?: boolean; // false
    isPrivateOrganization?: boolean; // false
  };
};

export type ValidateStructure<H extends string = string> = {
  readonly [key in H]: NAbstractSchemeLoader.ValidateHandler;
};

export type DictionaryStructure<
  L extends string = string,
  D extends NAbstractSchemeLoader.Dictionary = NAbstractSchemeLoader.Dictionary
> = {
  language: L;
  dictionary: D;
};

export type CommonDocuments = {
  router?: RouteStructure;
  emitter?: EmitterStructure;
  broker?: BrokerStructure;
  dictionaries?: DictionaryStructure | DictionaryStructure[];
};

export type TypeormDocuments<M> = {
  model: M;
  schema: AnyFn;
  repository: FnObject;
};

export type ServerDocuments = {
  typeorm?: TypeormDocuments;
  controller?: ControllerStructure;
  helpers?: HelpersStructure;
};

export type DocumentStructure<M extends string = string> = {
  common?: CommonDocuments;
  server?: ServerDocuments;
  webClient?: {
    controller: ControllerStructure;
  };
};
