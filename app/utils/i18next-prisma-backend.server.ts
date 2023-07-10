import type { PrismaClient } from "@prisma/client";
import type { Module, ModuleType, Services } from "i18next";

export interface PrismaBackendOptions {
  client: PrismaClient;
}

class Backend implements Module {
  static type: ModuleType;

  backendOptions: PrismaBackendOptions;
  client: PrismaClient;
  i18nextOptions: {};
  services: Services;
  type: ModuleType;

  constructor(
    services: Services,
    backendOptions: PrismaBackendOptions,
    i18nextOptions = {}
  ) {
    this.services = services;
    this.backendOptions = backendOptions;
    this.i18nextOptions = i18nextOptions;
    this.client = backendOptions.client;
    this.type = "backend";
    this.init(services, backendOptions, i18nextOptions);
  }

  init(
    services: Services,
    backendOptions: PrismaBackendOptions,
    i18nextOptions = {}
  ) {
    this.client = backendOptions.client;
    this.services = services;
    this.backendOptions = backendOptions;
    this.i18nextOptions = i18nextOptions;
  }

  async read(language: string, namespace: string) {
    const result = await this.client.i18n.findUnique({
      select: { translation: true },
      where: {
        word_lang: { lang: language, word: namespace }
      }
    });
    return { [namespace]: result?.translation };
  }

  // async create(
  //   languages: readonly string[],
  //   namespace: string,
  //   key: string,
  //   fallbackValue: string
  // ) {
  // }
}

Backend.type = "backend";

export default Backend;
