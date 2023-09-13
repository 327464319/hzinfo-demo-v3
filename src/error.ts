

import type { App } from 'vue';

export function setupError(app: App<Element>) {
  app.config.errorHandler = (err, vm, info) => {
    store.commit('ADD_LOGS', {
      type: 'error',
      message: err.message,
      stack: err.stack,
      info,
    });
    if (import.meta.env.MODE === 'development') {
      console.group('>>>>>> 错误信息 >>>>>>');
      console.error(info);
      console.groupEnd();
      console.group('>>>>>> Vue 实例 >>>>>>');
      console.log(vm);
      console.groupEnd();
      console.group('>>>>>> Error >>>>>>');
      console.log(err);
      console.groupEnd();
    }
  };
}
