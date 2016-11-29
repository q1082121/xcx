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
    if(this.globalData.userInfo){
      console.log(1)
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      console.log(2)
      //调用登录接口
      wx.login({
        success: function () {
          //获取用户资料
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
      
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
    domainName:"http://127.0.0.1",
    basePath:"/pages"
    
  },
  func:{  
    http_request_action:http.http_request_action,
    showToast_success:showToast.showToast_success,
    showToast_default:showToast.showToast_default

  }  
}

App(config)