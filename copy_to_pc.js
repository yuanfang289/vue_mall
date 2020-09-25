var fs = require( 'fs' ),

    stat = fs.stat;

/*


 * 复制目录中的所有文件包括子目录


 * @param{ String } 需要复制的目录


 * @param{ String } 复制到指定的目录


 */

var copy = function( src, dst ){
    var stat_src = fs.lstatSync(src);
    var stat_dst = fs.lstatSync(dst);
    if(stat_dst.isDirectory()){
        if(stat_src.isDirectory()){ //是文件夹 读取文件对应写入
            // 读取目录中的所有文件/目录
            fs.readdir( src, function( err, paths ){
                if( err ){
                    throw err;
                }
                paths.forEach(function( path ){
                    var _src = src + '/' + path,
                        _dst = dst + '/' + path,
                        readable, writable;      
                    stat( _src, function( err, st ){
                        if( err ){
                            throw err;
                        }
                        // 判断是否为文件
                        if( st.isFile() ){
                            // 创建读取流
                            readable = fs.createReadStream( _src );
                            // 创建写入流
                            writable = fs.createWriteStream( _dst ); 
                            // 通过管道来传输流
                            readable.pipe( writable );
                        }
                        // 如果是目录则递归调用自身
                        else if( st.isDirectory() ){
                            exists( _src, _dst, copy );
                        }
                    });
                });
            });
        }else if(stat_src.isFile()){ //是单个文件 直接读写
            var path = src.split('/').pop();
            var _src = src,
                _dst = dst+'/'+path,
                readable, writable; 
            readable = fs.createReadStream( _src );
            // 创建写入流
            writable = fs.createWriteStream( _dst ); 
            // 通过管道来传输流
            readable.pipe( writable );
        }

    }else{
        console.log('目标路径只能是目录') 
    }
};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录

var exists = function( src, dst, callback ){

    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            callback( src, dst );
        }else{// 不存在
            fs.mkdir( dst, function(){
                callback( src, dst );
            });
        }
    });

};

var editFile = function (src) {
    var data = fs.readFileSync(src);
    var oldData = data.toString()  
    if(oldData.indexOf('=/static/shop') == -1){
       var newDate = oldData.replace(/=\/css/g,"=/static/shop/css").replace(/=\/js/g,"=/static/shop/js")
        fs.writeFile(src, newDate, function (err) {
            if (err) return err;
        }); 
        console.log('更改后的html写入完成')
    }else{
       console.log('html未变化') 
    }
}

var delDir = function (path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}
var paths = '../../pc/public/static/shop/css';//设置删除路径
var paths1 = '../../pc/public/static/shop/js';//设置删除路径
delDir(paths);delDir(paths1);//删除文件夹

console.log('更改index.html的静态资源路径')
editFile('./dist/index.html')
console.log('开始复制css js html')
exists('./dist/index.html','../../pc/application/h5/view/shop',copy)
exists( './dist/css', '../../pc/public/static/shop/css', copy );
exists( './dist/js', '../../pc/public/static/shop/js', copy );
console.log('css js复制完成')