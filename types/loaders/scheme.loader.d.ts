import { HttpMethod, KeyStringLiteralBuilder } from '../utility';
import {
  BrokerStructure,
  type DictionaryStructure,
  EmitterStructure,
  EventType,
  RouteStructure,
  ValidateStructure,
} from '../vendor';
import { validator } from '../packages';

export interface ISchemeLoader {
  readonly isDefine: boolean;
  readonly services: NAbstractSchemeLoader.Services;

  readonly init(): void;
  readonly destroy(): void;
  readonly applyDomainToService(service: string, domain: string): void;

  readonly setDomain(name: string): void;
  readonly setRoute(domain: string, structure: RouteStructure): void;
  readonly getRoute<
    S extends string = string,
    D extends string = string,
    M extends HttpMethod = HttpMethod,
    R extends string = string
  >(
    service: S,
    domain: D,
    method: M,
    route: R
  ): NAbstractSchemeLoader.Route;

  readonly setEvent(domain: string, structure: EmitterStructure): void;
  readonly getEvents<S extends string = string, D extends string = string>(
    service: S,
    domain: D
  ): NAbstractSchemeLoader.Events;
  readonly getEvent<
    S extends string = string,
    D extends string = string,
    E extends string = string,
    B extends string = string
  >(
    service: S,
    domain: D,
    event: E,
    belongTo: B
  ): NAbstractSchemeLoader.Event;

  readonly setSubject(domain: string, structure: BrokerStructure): void;
  readonly getSubject<
    SER extends string = string,
    D extends string = string,
    B extends string = string,
    SUB extends string = string
  >(
    service: SER,
    domain: D,
    belongTo: B,
    subject: SUB
  ): NAbstractSchemeLoader.Subject;

  readonly setDictionaries(
    domain: string,
    dictionaries: DictionaryStructure | DictionaryStructure[]
  ): void;
  readonly getDictionary<
    S extends string = string,
    D extends string = string,
    L extends string = string
  >(
    service: S,
    domain: D,
    language: L
  ): NAbstractSchemeLoader.Dictionary;
  readonly getResource<
    S extends string = string,
    D extends string = string,
    L extends string = string,
    DICT extends NAbstractSchemeLoader.Dictionary = NAbstractSchemeLoader.Dictionary
  >(
    service: S,
    domain: D,
    language: L,
    resource: KeyStringLiteralBuilder<DICT>,
    substitutions?: Record<string, string>
  ): string;

  readonly setValidator<H extends string = string>(
    domain: string,
    structure: ValidateStructure<H>
  ): void;

  readonly getValidator<
    S extends string = string,
    D extends string = string,
    V extends string = string,
    R = any,
    A = any
  >(
    service: S,
    domains: D,
    name: V,
    agents: A
  ): R;
}

export namespace NAbstractSchemeLoader {
  export type Route<R extends string = string, H extends string = string> = {
    path: R;
    method?: HttpMethod; // default 'GET'
    handler: H;
    isPrivateUser?: boolean; // default false
    isPrivateOrganization?: boolean; // default false
    params?: string[]; // default []
  };

  export type Routes = Map<string, Route>;

  export type Event<E extends string = string, H extends string = string> = {
    event: E;
    type: EventType | EventType[];
    handler: H;
    isPrivateUser?: boolean; // default false
    isPrivateOrganization?: boolean; // default false
  };

  export type Events = Map<string, Event>;

  export type Subject<E extends string = string, H extends string = string> = {
    subject: E;
    handler: H;
    isPrivateUser?: boolean; // default false
    isPrivateOrganization?: boolean; // default false
  };

  export type Subjects = Map<string, Subject>;

  export type Dictionary = {
    [key: string]: string | Dictionary;
  };
  export type Dictionaries<L extends string = string> = Map<L, Dictionary>;

  export type ValidateHandler<A = any, T = any> = (validate: validator, agents: A) => T;
  export type Validators = Map<string, ValidateHandler>;

  export interface AbstractDomain {
    routes: Routes;
    events: Events;
    subjects: Subjects;
    dictionaries: Dictionaries;
    validators: Validators;
  }

  export type Domains = Map<string, AbstractDomain>;
  export type Services = Map<string, Domains>;
}
