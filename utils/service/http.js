/******************************* 
 * 名称:网络请求
 * 作者:rubbish.boy@163.com
 *******************************
*/
function request_action(url,data,cb){  
    wx.request({  
      url: this.globalData.domainName + url,  
      data: data,  
      method: 'post',  
      header: {'Content-Type': 'application/json'},  
      success: function(res){  
        return typeof cb == "function" && cb(res.data)  
      },  
      fail: function(){  
        return typeof cb == "function" && cb(false)  
      }  
    })  
}  
module.exports = {  
  request_action: request_action  
}  
