const http = require('http')
const fs = require('fs')
const ejs = require('ejs')
const url = require('url')
const qs = require('querystring')

const index_page = fs.readFileSync('./index.ejs','utf8')
const other_page = fs.readFileSync('./other.ejs','utf8')
const style_css = fs.readFileSync('./style.css','utf8')

var server = http.createServer(getFromClient)
server.listen(3000)
console.log('Server Start!')

//メインプログラム===============================

//createserver
function getFromClient(request,response){
    var url_parts = url.parse(request.url,true)
    switch (url_parts.pathname) {

        case '/':
            response_index(request,response)
            break;
        
        case '/other':
            response_other(request,response)
            break;

        case '/style.css':
            response.writeHead(200,{'Content-Type':'text/css'})
            response.write(style_css)
            response.end()
            break;
        
        default:
            response.writeHead(200,{'Content-Type':'text/plain'})
            response.end('no page...')
            break;

    }

    var data = {msg:'no message....'}

    var data2 = {
        'Taro':['taro@yamada','09-999-999','Tokyo'],
        'Hanako':['hanako@flower','080-888-888','Yokohama'],
        'Sachiko':['sachiko@happy','070-777-777','Nagoya'],
        'Ichiro':['ichi@baseball','060-666-666','Newyork']
    }

    //index.ejsの処理
    function response_index( request,response ){
        //POSTアクセス時の処理
        if(request.method == 'POST'){
            console.log("response_index:POST")
            var body = '';

            //データ受信イベント処理
            request.on('data',(data)=>{
             body +=data
             console.log(body)
            })

            //データ受信終了時のイベント処理
            request.on('end',()=>{
                var data = qs.parse(body)
                var cookie = request.headers.cookie
                console.log(cookie)
                var dat_text = data.msg
                console.log(data.msg)
                response.setHeader('Set-Cookie',['msg='+escape(data.msg)])
                var cookie_text = unescape(cookie)
                var cookie_data = cookie_text.substring(4);
                var msg = "※伝言を表示します"
                var content = ejs.render(index_page,{
                    title:"Index",
                    content:msg,
                    data:data.msg,
                    cookie_data:cookie_data
                })
                response.writeHead(200,{'Content-Type':'text/html'})
                response.write(content)
                response.end()
            })
        } else {
            var msg = "※伝言を表示します"
            var data = {msg:'no message....'}
            var content = ejs.render(index_page,{
                title:"Index",
                content:msg,
                data:data.msg,
                cookie_data:""
            })
            response.setHeader('Set-Cookie',['msg='+data.msg])
            response.writeHead(200,{'Content-Type':'text/html'})
            response.write(content)
            response.end()
        }
    }

    //other.ejsの処理
    function response_other( request,response ){
        var msg = "これはOtherページです。"
        var content = ejs.render(other_page,{
            title:"Other",
            content:msg,
            data:{
                'Taro':['taro@yamada','09-999-999','Tokyo'],
                'Hanako':['hanako@flower','080-888-888','Yokohama'],
                'Sachiko':['sachiko@happy','070-777-777','Nagoya'],
                'Ichiro':['ichi@baseball','060-666-666','Newyork']
            },
            filename:'data_item'
        })
        response.writeHead(200,{'Content-Type':'text/html'})
        response.write(content)
        response.end()
    }

}