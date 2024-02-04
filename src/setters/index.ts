import 'reflect-metadata';
import { MetadataKeys } from '../common';
import { loadCommonElements, loadServerElements } from './helpers';

import {
  BrokerStructure,
  DictionaryStructure,
  DocumentStructure,
  EmitterStructure,
  FnObject,
  IServerSchemeLoader,
  NAbstractSchemeLoader,
  RouteStructure,
} from '@Scheme/Types';

export const setService = <S extends string = string, D extends string = string>(
  service: S,
  domains: D[],
  root: DocumentStructure
): string => {
  const serverLoader = Reflect.getMetadata(
    MetadataKeys.SERVER_LOADER,
    Reflect
  ) as IServerSchemeLoader;
  if (serverLoader.isDefine) {
    domains.forEach((domain: string) => serverLoader.applyDomainToService(service, domain));
  }

  return service;
};

export const setEntryPoint = (domain: string, documents: DocumentStructure): string => {
  const serverLoader = Reflect.getMetadata(
    MetadataKeys.SERVER_LOADER,
    Reflect
  ) as IServerSchemeLoader;

  if (serverLoader.isDefine) {
    if (documents.common) loadCommonElements(serverLoader, domain, documents.common);
    if (documents.server) loadServerElements(serverLoader, domain, documents.server);
  }

  return domain;
};

export const setRouter = <R extends string = string, H extends string = string>(
  structure: RouteStructure<R, H>
): RouteStructure<R, H> => {
  return structure;
};

export const setEmitter = <
  E extends string = string,
  H extends string = string,
  B extends string = string
>(
  structure: EmitterStructure<E, H, B>
): EmitterStructure<E, H, B> => {
  return structure;
};

export const setBroker = <
  S extends string = string,
  H extends string = string,
  B extends string = string
>(
  structure: BrokerStructure<S, H, B>
): BrokerStructure<S, H, B> => {
  return structure;
};

export const setDictionary = <
  L extends string = string,
  D extends NAbstractSchemeLoader.Dictionary = NAbstractSchemeLoader.Dictionary
>(
  structure: DictionaryStructure<L, D>
): DictionaryStructure<L, D> => {
  return structure;
};

export type ScopeResolver<S extends NAbstractSchemeLoader.PlatformScope> = S extends 'server'
  ? any
  : S extends 'edge'
  ? any
  : S extends 'visualizer'
  ? any
  : never;

export type ControllerStructure<
  H extends FnObject = FnObject,
  S extends NAbstractSchemeLoader.PlatformScope = NAbstractSchemeLoader.PlatformScope
> = {
  scope: S;
  handlers: H;
};

export type HelpersStructure<H extends FnObject = FnObject> = H;

export const setController = <
  H extends FnObject = FnObject,
  S extends NAbstractSchemeLoader.PlatformScope = NAbstractSchemeLoader.PlatformScope
>(
  scope: S,
  handlers: ScopeResolver<S>
): ControllerStructure<H, S> => {
  return { scope, handlers };
};
