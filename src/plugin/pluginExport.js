'use strict';

function makePluginExport({startServer, config}) {
  return function pluginExport(pluginModule) {
    let closeEyesServer;
    const pluginModuleExports = pluginModule.exports;
    pluginModule.exports = async (...args) => {
      const {eyesPort, closeServer} = await startServer();

      closeEyesServer = closeServer;
      const moduleExportsResult = await pluginModuleExports(...args);
      const eyesConfig = {
        eyesIsDisabled: !!config.isDisabled,
        eyesFailCypressOnDiff:
          config.failCypressOnDiff === undefined ? true : !!config.failCypressOnDiff,
      };
      return Object.assign(eyesConfig, {eyesPort}, moduleExportsResult);
    };
    return function getCloseServer() {
      return closeEyesServer;
    };
  };
}

module.exports = makePluginExport;
