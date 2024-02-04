import { IAbstractSchemeLoader, NAbstractSchemeLoader } from './abstract.scheme.loader';

export interface VisualizerSchemeLoader extends IAbstractSchemeLoader<'visualizer'> {}

export namespace NVisualizerSchemeLoader {
  export interface VisualizerDomain extends NAbstractSchemeLoader.AbstractDomain {}

  export type VisualizerDomains = Map<string, VisualizerDomain>;
  export type VisualizerServices = Map<string, VisualizerDomains>;
}
