import {
  CommonDocuments,
  IAbstractSchemeLoader,
  IServerSchemeLoader,
  NAbstractSchemeLoader,
  ServerDocuments,
} from '@Scheme/Types';

export const throwEnvError = (domain: string, scope: string) => {
  throw new Error(
    `An attempt to add to the server environment a processor that is made for the "${scope}" environment in ${domain} domain.`
  );
};

export const loadCommonElements = (
  loader: IAbstractSchemeLoader<NAbstractSchemeLoader.PlatformScope>,
  domain: string,
  documents: CommonDocuments
): void => {
  if (documents.router) loader.setRoute(domain, documents.router);
  if (documents.emitter) loader.setEvent(domain, documents.emitter);
  if (documents.broker) loader.setSubject(domain, documents.broker);
  if (documents.dictionaries) loader.setDictionaries(domain, documents.dictionaries);
};

export const loadServerElements = (
  loader: IServerSchemeLoader,
  domain: string,
  documents: ServerDocuments
) => {
  loader.setDomain(domain);

  if (documents.typeorm) {
    const { schema, model, repository } = documents.typeorm;
    loader.setTypeormSchema(domain, model, schema);
    loader.setTypeormRepository(domain, model, repository);
  }

  if (documents.controller) {
    if (documents.controller.scope !== 'server') {
      throw throwEnvError(domain, documents.controller.scope);
    } else {
      loader.setController(domain, documents.controller.handlers);
    }
  }

  if (documents.helpers) {
    loader.setHelper(domain, documents.helpers);
  }
};
