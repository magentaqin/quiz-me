import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1666843940599_6178';

  // add your egg config in here
  config.middleware = [ 'log' ];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };


  config.security = {};
  config.security.csrf = false;

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
