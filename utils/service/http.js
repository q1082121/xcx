/******************************* 
 * 名称:网络请求
 * 作者:rubbish.boy@163.com
 *******************************
*/
function http_request_action(url,data,cb){  
    wx.request({  
      url: url,  
      data: data,  
      method: 'post',  
      header: {'Content-Type': 'application/json'},  
      success: function(res){  
         typeof cb == "function" && cb(res.data)  
      },  
      fail: function(){  
         typeof cb == "function" && cb(false)  
      }  
    })  
} 
module.exports = {  
  http_request_action: http_request_action
}  
