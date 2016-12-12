/******************************* 
 * 名称:入口
 * 作者:rubbish.boy@163.com
 *******************************
*/
var http = require('/lib/service-plugin/http.js') 
var show = require('/lib/service-plugin/show.js') 
var common = require('/lib/service-plugin/common.js') 

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
            var post_data={token:that.globalData.token,session_id:res.data}
            http.http_request_action(that.globalData.domainName+that.globalData.api.api_userinfo,post_data,function(resback)
            {
              if(resback.status==1)
              {
                that.globalData.userInfo = resback.resource
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
                  var post_data={token:that.globalData.token,code:result.code,encryptedData:res.encryptedData,iv:res.iv}
                  //发起网络请求
                  http.http_request_action(that.globalData.domainName+that.globalData.api.api_login,post_data,function(resback)
                  {
                    if(resback.status==1)
                    {
                      wx.setStorage({key:"session_id",data:resback.resource})
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                    else
                    {
                      var msgdata=new Object
                          msgdata.totype=3
                          msgdata.msg=resback.info
                          app.func.showToast_default(msgdata);
                      //console.log('获取用户登录态失败！' + resback.info)
                    }
                  })
                  
                }
                else 
                {
                  var msgdata=new Object
                      msgdata.totype=3
                      msgdata.msg=resback.info
                      app.func.showToast_default(msgdata);
                  //console.log('获取用户登录态失败！' + res.errMsg)
                }
              }
            })
        }

      })
      //调用登录接口 end  //
  },
  //页面内部导航跳转
  bindNavigateTo:function(action,params="")
  {
    var linkurl
    switch(action)
    {
      case 'business_card':
      linkurl=this.globalData.basePath+this.globalData.routePath.business_card+params
      break
      case 'business_card_add':
      linkurl=this.globalData.basePath+this.globalData.routePath.business_card_add+params
      break
      case 'business_card_view':
      linkurl=this.globalData.basePath+this.globalData.routePath.business_card_view+params
      break
      case 'business_card_edit':
      linkurl=this.globalData.basePath+this.globalData.routePath.business_card_edit+params
      break
    }
    wx.navigateTo({
      url: linkurl
    })
  },
  //页面开打导航跳转
  bindRedirectTo:function(action,params="")
  {
    /*
    var linkurl

    wx.redirectTo({
      url: linkurl
    })
    */
  },
  //返回上一页
  bindGoBack:function(type)
  {
    if(type==0)
    {
      wx.navigateBack()
    }
    else
    {
      wx.navigateBack({
        delta: type
      })  
    }
  },
  //加载处理等待函数
  action_loading:function()
  {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  //隐藏消息提示框
  action_loading_hidden:function()
  {
      wx.hideToast()
  },
  //全局数据配置
  globalData:{
    userInfo:null,
    token:"MbYwyExrMd5G42Da",
    domainName:"https://api.tzsuteng.com",
    api:{
      api_login:"/api/xcx/login",
      api_userinfo:"/api/xcx/userinfo",
      api_del:"/api/xcx/deleteapi",
      api_businesscard_add:"/api/xcx/businesscard/add",
      api_businesscard_info:"/api/xcx/businesscard/info",
      api_businesscard_edit:"/api/xcx/businesscard/edit",
      api_businesscard:"/api/xcx/businesscard",
      api_proxy:"/api/xcx/proxy",
      api_is_check_in:"/api/xcx/is_check_in",
      api_check_in:"/api/xcx/check_in"
    },
    routePath:{
      business_card_add:"/businessCard/add/add",
      business_card_view:"/businessCard/view/view",
      business_card_edit:"/businessCard/edit/edit",
      business_card:"/businessCard/index/index"
    },
    basePath:"/pages",
    
  },
  func:{  
    http_request_action   :http.http_request_action,
    showToast_success     :show.showToast_success,
    showToast_default     :show.showToast_default,
    showModal             :show.showModal,
    makePhoneCall         :common.makePhoneCall,
	  systemSort            :common.systemSort
  }

}

App(config)