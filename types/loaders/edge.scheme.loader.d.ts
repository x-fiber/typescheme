import { IAbstractSchemeLoader, NAbstractSchemeLoader } from './abstract.scheme.loader';

export interface EdgeSchemeLoader extends IAbstractSchemeLoader<'edge'> {}

export namespace NEdgeSchemeLoader {
  export interface EdgeDomain extends NAbstractSchemeLoader.AbstractDomain {}

  export type EdgeDomains = Map<string, EdgeDomain>;
  export type EdgeServices = Map<string, EdgeDomains>;
}
