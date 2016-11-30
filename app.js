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
      wx.getStorage({
        key: 'session_id',
        success: function(res) {
            //调用用户信息接口 start  //
            var post_data={session_id:res.data}
            http.http_request_action(that.globalData.domainName+that.globalData.api.api_userinfo,post_data,function(info)
            {
              if(info.status==1)
              {
                that.globalData.userInfo = info.resource
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
              else
              {
                //登录过期
                //调用用户登录接口 start  //
                that.wxlogin_action(
                  function(userInfo)
                  {
                    that.globalData.userInfo = userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                )
                //调用用户登录接口 end  //
              }
            })
            
            //调用用户信息接口 end  //
        },
        fail:function(res){
            //调用用户登录接口 start  //
            that.wxlogin_action(
              function(userInfo)
              {
                that.globalData.userInfo = userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            )
            //调用用户登录接口 end  //
        } 
      })

    }
  },
  //用户登录接口
  wxlogin_action:function(cb)
  {
    var that=this
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
                  var post_data={code:result.code,encryptedData:res.encryptedData,iv:res.iv}
                  //发起网络请求
                  http.http_request_action(that.globalData.domainName+that.globalData.api.api_login,post_data,function(info)
                  {
                    if(info.status==1)
                    {
                      wx.setStorage({key:"session_id",data:info.resource})
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                    else
                    {
                      console.log('获取用户登录态失败！' + info.info)
                    }
                  })
                  
                }
                else 
                {
                  console.log('获取用户登录态失败！' + res.errMsg)
                }
              }
            })
        }

      })
      //调用登录接口 end  //
  },
  bindNavigateTo:function(action)
  {
    var linkurl
    switch(action)
    {
      case 'business_card':
      linkurl=this.globalData.basePath+this.globalData.routePath.business_card_add
      break
    }
    wx.navigateTo({
      url: linkurl
    })
  },
  globalData:{
    userInfo:null,
    domainName:"https://api.tzsuteng.com",
    api:{
      api_login:"/api/xcx/login",
      api_userinfo:"/api/xcx/userinfo"
    },
    routePath:{
      business_card_add:"/businessCard/businessCard_add"
    },
    basePath:"/pages",
    
  },
  func:{  
    http_request_action:http.http_request_action,
    showToast_success:showToast.showToast_success,
    showToast_default:showToast.showToast_default
  }

}

App(config)