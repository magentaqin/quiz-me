import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.logger = {
    dir: `${config.root}/logs/dev/${config.name}`,
  };
  return config;
};
