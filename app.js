/******************************* 
 * 名称:入口
 * 作者:rubbish.boy@163.com
 *******************************
*/
var http = require('/utils/service/http.js') 
var showToast = require('/utils/service/showToast.js') 

var config={
  //生命周期函数--监听小程序初始化
  onLaunch: function () {
    // Do something when page load.

    //调用API从本地缓存中获取数据
    /**/
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  //生命周期函数--监听小程序显示
  onShow: function() {
      // Do something when show.
  },
  //生命周期函数--监听小程序隐藏
  onHide: function() {
      // Do something when hide.
  },
  //获取用户信息
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo)
    {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else
    {
      var local_encryptedData = wx.getStorageSync('encryptedData')
      var local_iv = wx.getStorageSync('iv')
      if(local_encryptedData && local_iv)
      {
        //调用登录接口 start  //
          wx.login({
            success: function (result) {
                //获取用户资料
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo

                    wx.setStorage({key:"encryptedData",data:res.encryptedData})

                    wx.setStorage({key:"iv",data:res.iv})

                    if (result.code) 
                    {
                      var result_data={code:result.code,encryptedData:res.encryptedData,iv:res.iv}
                      //发起网络请求
                      http.http_request_action(that.globalData.domainName+'/api/xcx/login',result_data,function(info)
                      {
                        if(info.status==1)
                        {
                          wx.setStorageSync('session_id', info.resource)
                        }
                        else
                        {
                          console.log('获取用户登录态失败！' + info.info)
                        }
                        console.log(info)
                      })
                      
                    }
                    else 
                    {
                      console.log('获取用户登录态失败！' + res.errMsg)
                    }

                    typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                })
            }
          })
          //调用登录接口 end  //
      }
      else
      {
          //调用登录接口 start  //
          wx.login({
            success: function (result) {
                //获取用户资料
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo

                    wx.setStorage({key:"encryptedData",data:res.encryptedData})

                    wx.setStorage({key:"iv",data:res.iv})

                    if (result.code) 
                    {
                      var result_data={code:result.code,encryptedData:res.encryptedData,iv:res.iv}
                      //发起网络请求
                      http.http_request_action(that.globalData.domainName+'/api/xcx/login',result_data,function(info)
                      {
                        if(info.status==1)
                        {
                          wx.setStorageSync('session_id', info.resource)
                        }
                        else
                        {
                          console.log('获取用户登录态失败！' + info.info)
                        }
                        console.log(info)
                      })
                      
                    }
                    else 
                    {
                      console.log('获取用户登录态失败！' + res.errMsg)
                    }

                    typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                })
            }
          })
          //调用登录接口 end  //
      }

    }
  },
  bindNavigateTo:function(action)
  {
    var linkurl
    switch(action)
    {
      case 'business_card':
      linkurl=this.globalData.basePath+'/businessCard/businessCard_add'
      break
    }
    wx.navigateTo({
      url: linkurl
    })
  },
  globalData:{
    userInfo:null,
    domainName:"https://api.tzsuteng.com",
    basePath:"/pages"
    
  },
  func:{  
    http_request_action:http.http_request_action,
    showToast_success:showToast.showToast_success,
    showToast_default:showToast.showToast_default

  }  
}

App(config)