# default

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

###  此目录的代码说明

此项目与pc其余项目无关  只做存储作用  
此目录是一个纯粹的vue工程
开发商城相关的在此文件夹下开发  
 
###   发布打包 
1,npm run build 生成的dist目录
2,更改dist目录下的index.html中的代码         =/css  --->  =/static/shop/css    (整个index.html文件中替换)  
				                          =/js  --->  =/static/shop/js    (整个index.html文件中替换)
3，把dist下的文件复制到pc的shop文件下
css ，js  文件夹      替换到           pc\public\static\shop    下   
index.html           替换到           pc\application\h5\view\shop   下  
