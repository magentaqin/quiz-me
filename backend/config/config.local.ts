import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.logger = {
    dir: `${process.cwd()}/logs/dev`,
  };
  return config;
};
