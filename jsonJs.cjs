let fs = require('fs');
//读取配置文件，变量config的类型是Object类型
let routes = require('./public/cdn/common/routes.json');
let menu = routes.menu;

function doMenu(menu){
    if(!menu || menu.length == 0){
        return;
    }
    var page = [];
    menu.map((item) => {
        let oRoute = {};
        oRoute.name = item.name;
        oRoute.path = item.path;
        oRoute.component = item.component;
        oRoute.redirect = item.redirect;
        oRoute.children = doMenu(item.children);
        page.push(oRoute);
    })
    return page;
}

let curMenu = doMenu(menu);
// console.log(curMenu);
let jsonstr = JSON.stringify(curMenu, null, "\t");
// //将修改后的配置写入文件前需要先转成json字符串格式
// config["value"]=name
// var jsonstr = JSON.stringify(config,null,"\t");
// console.log(jsonstr);
// var test=cipher(jsonstr);
// console.log(test);
// var test1=decipher(test);
// console.log(test1);
// //将修改后的内容写入文件
// fs.writeFile('./config.json', jsonstr, function(err) {
//    if (err) {
//       console.error(err);
//    }else{
//        console.log('----------修改成功-------------');
//    }
// });

let result = jsonstr.replace(/"/g, '\'').replace(/'\\'/g, '').replace(/\\''/g, '');
result='export default ' + result
fs.writeFile('./src/router/sub-page/config.js', result, 'utf8', function (err) {
    if (err){
        console.log(err)
    }
});
