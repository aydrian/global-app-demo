import type { ModuleType, Services } from "i18next";

import { PrismaClient } from "@prisma/client";

export interface PrismaBackendOptions {
  client: PrismaClient;
}

class Backend {
  static type: ModuleType;

  backendOptions!: PrismaBackendOptions;
  client!: PrismaClient;
  i18nextOptions!: {};
  services!: Services;

  constructor(
    services: Services,
    backendOptions: PrismaBackendOptions,
    i18nextOptions = {}
  ) {
    this.init(services, backendOptions, i18nextOptions);
  }

  init(
    services: Services,
    backendOptions: PrismaBackendOptions,
    i18nextOptions = {}
  ) {
    // console.log({
    //   backendOptions: backendOptions ? Object.keys(backendOptions) : {},
    //   blah: "init",
    //   i18nextOptions
    // });
    this.services = services;
    this.backendOptions = backendOptions;
    this.i18nextOptions = i18nextOptions;

    if (backendOptions?.client) {
      this.client = backendOptions.client;
    } else {
      this.client = new PrismaClient();
    }
  }

  read(language: string, namespace: string, callback: Function) {
    this.readTranslations(language)
      .then((resources) => callback(null, resources))
      .catch((err) => {
        return callback(true, null);
      });
  }

  async readTranslations(lang: string) {
    const result = await this.client.i18n.findMany({
      select: { translation: true, word: true },
      where: { lang }
    });
    const resources = result.reduce((obj, { translation, word }) => {
      return {
        ...obj,
        [word]: translation
      };
    }, {});
    return resources;
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
