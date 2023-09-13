// 配置编译环境和线上环境之间的切换
import {name} from "../../package.json";

let baseUrl = '';

let iconfontVersionCom = ['567566_pwc3oottzol', '1066523_6bvkeuqao36', '2165552_szvrr9usa1'];
let iconfontVersionOnly = [];
let byQiankun = window.__POWERED_BY_QIANKUN__;
let iconfontVersion = byQiankun ? iconfontVersionOnly : [...iconfontVersionCom, ...iconfontVersionOnly];

let __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
let staticBaseUrl = '';
// import.meta.env.MODE == 'development'
const env = import.meta.env;
if (env.MODE === 'development') {
    baseUrl = ``; // 开发环境地址
    staticBaseUrl = `/`;
} else if (env.MODE === 'production') {
    baseUrl =  !byQiankun ? `/${name}` : ``; //生产环境地址
    staticBaseUrl =  byQiankun ? `${__webpack_public_path__}` : `/${name}/`;
} else if (env.MODE === 'test') {
    baseUrl = !byQiankun ? `/${name}` : ``; //测试环境地址
    staticBaseUrl =  byQiankun ? `${__webpack_public_path__}` : `/${name}/`;
}

staticBaseUrl = staticBaseUrl.substring(0, staticBaseUrl.length - 1);

let iconfontUrl = `${baseUrl}/cdn/iconfont/1.0.0/font_$key.css`;
let codeUrl = `${baseUrl}/code`
export {
    baseUrl,
    staticBaseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl,
    env
}
