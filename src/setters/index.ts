import 'reflect-metadata';
import { MetadataKeys } from '../common';

import type {
  BrokerStructure,
  DocumentStructure,
  EmitterStructure,
  ISchemeLoader,
  RouteStructure,
} from '@Scheme/Types';

export const setService = (service: string, domains: string[], root: {}): string => {
  const loader = Reflect.getMetadata(MetadataKeys.SCHEMA_LOADER, Reflect) as ISchemeLoader;
  if (loader.isDefine) {
    domains.forEach((domain: string) => loader.applyDomainToService(service, domain));
  }

  return service;
};

export const setPioneer = (domain: string, documents: DocumentStructure): string => {
  const loader = Reflect.getMetadata(MetadataKeys.SCHEMA_LOADER, Reflect) as ISchemeLoader;

  if (loader.isDefine) {
    loader.setDomain(domain);

    if (documents.server) {
      if (documents.server.router) {
        loader.setRoute(domain, documents.server.router);
      }

      if (documents.server.emitter) {
        loader.setEvent(domain, documents.server.emitter);
      }

      if (documents.server.broker) {
        loader.setSubject(domain, documents.server.broker);
      }

      if (documents.server.dictionaries) {
        loader.setDictionaries(domain, documents.server.dictionaries);
      }
    }

    if (documents.webClient) {
      if (documents.webClient.router) {
        loader.setRoute(domain, documents.webClient.router);
      }

      if (documents.webClient.emitter) {
        loader.setEvent(domain, documents.webClient.emitter);
      }

      if (documents.webClient.broker) {
        loader.setSubject(domain, documents.webClient.broker);
      }

      if (documents.webClient.dictionaries) {
        loader.setDictionaries(domain, documents.webClient.dictionaries);
      }

      if (documents.common) {
        if (documents.common.router) {
          if (!documents.server?.router || !documents.webClient.router) {
            loader.setRoute(domain, documents.common.router);
          }
        }

        if (documents.common.emitter) {
          if (!documents.server?.emitter || !documents.webClient.emitter) {
            loader.setEvent(domain, documents.common.emitter);
          }
        }

        if (documents.common.broker) {
          if (!documents.server?.broker || !documents.webClient.broker) {
            loader.setSubject(domain, documents.common.broker);
          }
        }

        if (documents.common.dictionaries) {
          if (!documents.server?.dictionaries || !documents.webClient.dictionaries) {
            loader.setDictionaries(domain, documents.common.dictionaries);
          }
        }
      }
    }
  }

  return domain;
};

export const setRouter = (structure: RouteStructure): RouteStructure => {
  return structure;
};

export const setEmitter = (structure: EmitterStructure): EmitterStructure => {
  return structure;
};

export const setBroker = (structure: BrokerStructure): BrokerStructure => {
  return structure;
};
