import { AbstractSchemeLoader } from './abstract.scheme.loader';

import type {
  AnyFn,
  FnObject,
  IServerSchemeLoader,
  NAbstractSchemeLoader,
  NServerSchemeLoader,
} from '@Scheme/Types';

export class ServerSchemeLoader
  extends AbstractSchemeLoader<'server'>
  implements IServerSchemeLoader
{
  protected _DOMAINS: NServerSchemeLoader.ServerDomains | undefined;
  protected _SERVICES: NServerSchemeLoader.ServerServices | undefined;

  public setDomain(name: string): void {
    const domain = this._domains.get(name);
    if (!domain) {
      this._domains.set(name, {
        routes: new Map<string, NAbstractSchemeLoader.Route>(),
        events: new Map<string, NAbstractSchemeLoader.Event>(),
        subjects: new Map<string, NAbstractSchemeLoader.Subject>(),
        dictionaries: new Map<string, NAbstractSchemeLoader.Dictionary>(),
        validators: new Map<string, NAbstractSchemeLoader.ValidateHandler>(),
        controllers: new Map<string, AnyFn>(),
        helpers: new Map<string, AnyFn>(),
      });
    }
  }

  public setController(domain: string, handlers: FnObject): void {
    const storage = this._domains.get(domain);
    if (!storage) {
      this.setDomain(domain);
      this.setController(domain, handlers);
      return;
    }

    for (const controller in handlers) {
      storage.controllers.set(controller, handlers[controller]);
    }
  }

  public setHelper(domain: string, handlers: FnObject): void {
    const storage = this._domains.get(domain);
    if (!storage) {
      this.setDomain(domain);
      this.setHelper(domain, handlers);
      return;
    }

    for (const controller in handlers) {
      storage.helpers.set(controller, handlers[controller]);
    }
  }

  public setTypeormSchema<M extends string = string>(
    domain: string,
    model: M,
    getSchema: AnyFn
  ): void {
    const storage = this._domains.get(domain);
    if (!storage) {
      this.setDomain(domain);
      this.setTypeormSchema<M>(domain, model, getSchema);
      return;
    }

    if (!storage.typeorm) {
      storage.typeorm = {
        schema: getSchema,
        model: model,
        repository: new Map<string, AnyFn>(),
      };
    } else {
      throw new Error(
        `Typeorm schema in domain ${domain} already exists with name: "${storage.typeorm.model}"`
      );
    }
  }

  public setTypeormRepository<M extends string = string, H extends FnObject = FnObject>(
    domain: string,
    model: M,
    handlers: H
  ): void {
    const storage = this._domains.get(domain);
    if (!storage) {
      this.setDomain(domain);
      this.setTypeormRepository<M>(domain, model, handlers);
      return;
    }
    if (!storage.typeorm || !storage.typeorm.repository) {
      storage.typeorm = {
        model: model,
        repository: new Map<string, AnyFn>(),
      };
    }

    for (const name in handlers) {
      const handler = handlers[name];

      storage.typeorm.repository.set(name, handler);
    }
  }
}
