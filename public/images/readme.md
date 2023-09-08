## 备注

#### 关于各项目静态资源图片处理方案
- 1.在此文件夹(./public/images)新增资源 
- 2.在此文件(./src/config/env.js)新增配置，已配置的请忽略。 示例/代码如下

```bash
...

let __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
let staticBaseUrl = '';

...
if (env.NODE_ENV === 'development') {
    ...
    staticBaseUrl = `/`;  
} else if (env.NODE_ENV === 'production') {
    ...
    staticBaseUrl =  byQiankun ? `${__webpack_public_path__}` : `/${name}/`;
} else if (env.NODE_ENV === 'test') {
    ...
    staticBaseUrl =  byQiankun ? `${__webpack_public_path__}` : `/${name}/`;
}

...
export {
    ...
    staticBaseUrl,
    ...
}
```

- 3.用法如下，请留意: imges前不用斜杠
```bash
<template>
  <img :src="staticBaseUrl + 'images/xxx.jpg'">
</template>

<script>
  import {staticBaseUrl} from "@/config/env";
</script>
```


