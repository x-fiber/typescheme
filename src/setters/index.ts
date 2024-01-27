import 'reflect-metadata'
import {MetadataKeys} from "../common";

import type {ISchemeLoader} from "@Scheme/Types";

export const setService = (service: string, domains: string[], root: {}): string => {
    const loader = Reflect.getMetadata(MetadataKeys.SCHEMA_LOADER, Reflect) as ISchemeLoader;
    if (loader.isDefine) {
        domains.forEach((domain: string) => loader.applyDomainToService(service, domain));
    }

    return service;
}

export const setPioneer = (domain: string, documents: {}): string => {
    return domain
}

