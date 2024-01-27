import {yup} from '../packages'
import type {
    BrokerStructure,
    EmitterStructure,
    HttpMethod,
    ISchemeLoader,
    KeyStringLiteralBuilder,
    NAbstractSchemeLoader,
    RouteStructure,
    ValidateStructure,
} from '@Scheme/Types';


export class AbstractSchemeLoader implements ISchemeLoader {
    private _SERVICES: NAbstractSchemeLoader.Services | undefined
    private _DOMAINS: NAbstractSchemeLoader.Domains | undefined


    public init(): void {
        this._SERVICES = new Map<string, NAbstractSchemeLoader.Domains>()
        this._DOMAINS = new Map<string, NAbstractSchemeLoader.AbstractDomain>()
    }


    public destroy(): void {
        this._SERVICES = undefined
        this._DOMAINS = undefined
    }

    public get isDefine(): boolean {
        return typeof this._SERVICES !== 'undefined' && typeof this._DOMAINS !== 'undefined'
    }

    public get services(): NAbstractSchemeLoader.Services {
        if (!this._SERVICES) {
            throw new Error('Services collection not initialize.')
        }
        return this._SERVICES
    }

    private get _domains(): NAbstractSchemeLoader.Domains {
        if (!this._DOMAINS) {
            throw new Error('Domains collection not initialize.')
        }

        return this._DOMAINS
    }

    public applyDomainToService(service: string, domain: string): void {
        const sStorage = this.services.get(service);
        if (!sStorage) {
            this.services.set(service, new Map<string, NAbstractSchemeLoader.AbstractDomain>());
            this.applyDomainToService(service, domain);
            return;
        }

        const dStorage = this._domains.get(domain);
        if (!dStorage) {
            throw new Error(`Domain ${domain} not found`);
        }

        sStorage.set(domain, dStorage);
    }

    public setDomain(name: string): void {
        const domain = this._domains.get(name)
        if (!domain) {
            this._domains.set(name, {
                routes: new Map<string, NAbstractSchemeLoader.Route>(),
                events: new Map<string, NAbstractSchemeLoader.Event>(),
                subjects: new Map<string, NAbstractSchemeLoader.Subject>(),
                dictionaries: new Map<string, NAbstractSchemeLoader.Dictionary>(),
                validators: new Map<string, NAbstractSchemeLoader.ValidateHandler>(),
            })
        }
    }

    public setRoute(domain: string, structure: RouteStructure): void {
        const storage = this._domains.get(domain)
        if (!storage) {
            this.setDomain(domain)
            this.setRoute(domain, structure)
            return
        }

        for (const str in structure) {
            const routes = structure[str];
            for (const method in routes) {
                const httpMethod = method as HttpMethod

                const details = routes[httpMethod];
                if (details) {
                    const name = str + '{{' + method.toUpperCase() + '}}';
                    const route = storage.routes.get(name);
                    if (route) {
                        throw new Error(`Route path "${str}" with method "${method.toUpperCase()}" has already exist`);
                    } else {
                        storage.routes.set(name, {
                            path: str,
                            method: httpMethod,
                            params: details.params,
                            handler: details.handler,
                            isPrivateUser: details.isPrivateUser,
                            isPrivateOrganization: details.isPrivateOrganization,
                        });
                    }
                }
            }
        }
    }

    public getRoutes(service: string, domain: string): NAbstractSchemeLoader.Routes {
        return this._getDomain(service, domain).routes
    }

    public getRoute<
        S extends string = string,
        D extends string = string,
        M extends HttpMethod = HttpMethod,
        R extends string = string
    >(service: S, domain: D, method: M, route: R): NAbstractSchemeLoader.Route {
        const routes = this.getRoutes(service, domain)

        const path = route + '{{' + method.toUpperCase() + '}}';
        const rStorage = routes.get(path)
        if (!rStorage) {
            throw new Error(`Handler for route "${route}" or method "${method}" in domain "${domain}" from service "${service}" not exist.`)
        }

        return rStorage
    }

    public setEvent(domain: string, structure: EmitterStructure): void {
        const dStorage = this._domains.get(domain)
        if (!dStorage) {
            this.setDomain(domain)
            this.setEvent(domain, structure)
            return
        }

        for (const name in structure) {
            const {belongTo, ...details} = structure[name]
            const internalKey = `${belongTo}:${domain}:${name}`
            const handler = dStorage.events.get(internalKey)
            if (!handler) {
                dStorage.events.set(internalKey, {
                    event: name,
                    type: details.type,
                    handler: details.handler,
                    isPrivateUser: details.isPrivateUser,
                    isPrivateOrganization: details.isPrivateOrganization,
                })
            } else {
                throw new Error(`Event "${name}" from domain "${domain}" belong to alias "${belongTo}" has already exist.`)
            }
        }
    }

    public getEvents<S extends string = string, D extends string = string>(
        service: S,
        domain: D
    ): NAbstractSchemeLoader.Events {
        return this._getDomain(service, domain).events
    }

    public getEvent<
        S extends string = string,
        D extends string = string,
        B extends string = string,
        E extends string = string,
    >(
        service: S, domain: D, belongTo: B, event: E,
    ): NAbstractSchemeLoader.Event {
        const events = this._getDomain(service, domain).events
        const internalKey = `${belongTo}:${domain}:${event}`

        const handler = events.get(internalKey)
        if (!handler) {
            throw new Error(`Handler for event "${event}" from domain "${domain}" belong to alias "${belongTo}" in service "${service}" not found.`)
        }

        return handler
    }

    public setSubject(domain: string, structure: BrokerStructure): void {
        const dStorage = this._domains.get(domain)
        if (!dStorage) {
            this.setDomain(domain)
            this.setSubject(domain, structure)
            return
        }

        for (const name in structure) {
            const {belongTo, ...details} = structure[name]
            const internalKey = `${belongTo}:${domain}:${name}`
            const handler = dStorage.subjects.get(internalKey)
            if (!handler) {
                dStorage.subjects.set(internalKey, {
                    subject: name,
                    isPrivateUser: details.isPrivateUser,
                    isPrivateOrganization: details.isPrivateOrganization,
                    handler: details.handler,
                })
            } else {
                throw new Error(`Subject "${name}" from domain "${domain}" belong to alias "${belongTo}" has already exist.`)
            }
        }
    }

    public getSubjects<
        S extends string = string,
        D extends string = string
    >(service: S, domain: D): NAbstractSchemeLoader.Subjects {
        return this._getDomain(service, domain).subjects
    }

    public getSubject<
        SER extends string = string,
        D extends string = string,
        B extends string = string,
        SUB extends string = string
    >(service: SER, domain: D, belongTo: B, subject: SUB): NAbstractSchemeLoader.Subject {
        const subjects = this.getSubjects(service, domain)
        const internalKey = `${belongTo}:${domain}:${subject}`

        const handler = subjects.get(internalKey)

        if (!handler) {
            throw new Error(`Subject "${subject}" from domain "${domain}" belong to alias "${belongTo}" not exist.`)
        }

        return handler
    }

    public setDictionary(domain: string, language: string, dictionary: NAbstractSchemeLoader.Dictionary): void {
        const dStorage = this._domains.get(domain)
        if (!dStorage) {
            this.setDomain(domain)
            this.setDictionary(domain, language, dictionary)
            return
        }

        const dict = dStorage.dictionaries.get(language)
        if (!dict) {
            dStorage.dictionaries.set(language, dictionary)
        } else {
            throw new Error(`Dictionary with language "${language}" in domain "${domain}" has already exist.`)
        }
    }

    public getDictionary<
        S extends string = string,
        D extends string = string,
        L extends string = string,
    >(service: S, domain: D, language: L): NAbstractSchemeLoader.Dictionary {
        const dStorage = this._getDomain(service, domain)

        const dictionary = dStorage.dictionaries.get(language)
        if (!dictionary) {
            throw new Error(`Dictionary with language "${language}" in domain "${domain}" from service "${service}" not exist.`)
        }

        return dictionary
    }

    public getResource<
        S extends string = string,
        D extends string = string,
        L extends string = string,
        DICT extends NAbstractSchemeLoader.Dictionary = NAbstractSchemeLoader.Dictionary,
    >(service: S, domain: D, language: L, resource: KeyStringLiteralBuilder<DICT>, substitutions?: Record<string, string>): string {
        const dictionary = this.getDictionary(service, domain, language)

        const keys = resource.split(':')
        let record: NAbstractSchemeLoader.Dictionary | string = dictionary
        if (keys.length >= 1) {
            for (const key of keys) {
                if (typeof record !== 'string') {
                    record = record[key]
                    if (typeof record === 'undefined') {
                        throw new Error(`value from extended key "${key}" is undefined.`)
                    }
                } else {
                    if (!substitutions) return record

                    for (const substitution in substitutions) {
                        record = record.replace('{{' + substitution + '}}', substitutions[substitution]);
                    }
                    return record
                }
            }
        } else {
            throw new Error('Resource key is empty string.')
        }

        if (typeof record !== 'string') {
            throw new Error('Unsupported record string type.')
        }

        return record
    }

    public setValidator<H extends string = string>(domain: string, structure: ValidateStructure<H>): void {
        const dStorage = this._domains.get(domain)
        if (!dStorage) {
            this.setDomain(domain)
            this.setValidator(domain, structure)
            return
        }

        for (const name in structure) {
            const handler = structure[name]

            const routine = dStorage.validators.get(name)
            if (!routine) {
                dStorage.validators.set(name, handler)
            } else {
                throw new Error(`Validator "${name}" in domain ${domain} has already exist.`)
            }
        }
    }

    public getValidator<
        S extends string = string,
        D extends string = string,
        V extends string = string,
        R = any,
        A = any
    >(service: S, domains: D, name: V, agents: A): R {
        const dStorage = this._getDomain(service, domains)

        const validator = dStorage.validators.get(name)
        if (!validator) {
            throw new Error(`Validator "${name}" in domain ${domains} from service "${service}" not exist.`)
        }

        return validator(yup, agents)
    }

    private _getDomain(service: string, domain: string): NAbstractSchemeLoader.AbstractDomain {
        const sStorage = this.services.get(service)
        if (!sStorage) {
            throw new Error(`Service "${service}" not exist.`)
        }

        const dStorage = sStorage.get(domain)
        if (!dStorage) {
            throw new Error(`Domain "${domain}" not exist.`)
        }

        return dStorage
    }
}