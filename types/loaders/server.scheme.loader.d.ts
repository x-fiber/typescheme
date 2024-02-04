import { IAbstractSchemeLoader, NAbstractSchemeLoader } from './abstract.scheme.loader';
import { AnyFn, FnObject } from '../utility';

export interface IServerSchemeLoader extends IAbstractSchemeLoader<'server'> {
  readonly setController<H extends FnObject = FnObject>(domain: string, handlers: H): void;
  readonly setHelper(domain: string, handlers: FnObject): void;
  readonly setTypeormSchema<M extends string = string>(
    domain: string,
    model: M,
    getSchema: AnyFn
  ): void;
  readonly setTypeormRepository<M extends string = string, H extends FnObject = FnObject>(
    domain: string,
    model: M,
    handlers: H
  ): void;
}

export namespace NServerSchemeLoader {
  export interface ServerDomain extends NAbstractSchemeLoader.AbstractDomain {
    controllers: Map<string, AnyFn>;
    helpers: Map<string, AnyFn>;
    typeorm?: {
      model: string;
      schema?: AnyFn;
      repository: Map<string, AnyFn>;
    };
  }

  export type ServerDomains = Map<string, ServerDomain>;
  export type ServerServices = Map<string, ServerDomains>;
}
