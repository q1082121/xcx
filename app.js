/******************************* 
 * 名称:入口
 * 作者:rubbish.boy@163.com
 *******************************
*/
var http = require('/lib/service-plugin/http.js') 
var show = require('/lib/service-plugin/show.js') 
var common = require('/lib/service-plugin/common.js') 
var WxParse = require('/lib/wxParse/wxParse.js');

var config={
  //生命周期函数--监听小程序初始化
  onLaunch: function () {
    // Do something when page load.

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
      case 'product_view':
      linkurl=this.globalData.basePath+this.globalData.routePath.product_view+params
      break
      case 'user_address':
      linkurl=this.globalData.basePath+this.globalData.routePath.user_address+params
      break
      case 'user_address_add':
      linkurl=this.globalData.basePath+this.globalData.routePath.user_address_add+params
      break
      case 'user_address_edit':
      linkurl=this.globalData.basePath+this.globalData.routePath.user_address_edit+params
      break
      case 'shopping_cart_settle_account':
      linkurl=this.globalData.basePath+this.globalData.routePath.shopping_cart_settle_account+params
      break
      case 'life_calendar':
      linkurl=this.globalData.basePath+this.globalData.routePath.life_calendar+params
      break
      case 'life_tvshowplan':
      linkurl=this.globalData.basePath+this.globalData.routePath.life_tvshowplan+params
      break
      case 'life_wxnews':
      linkurl=this.globalData.basePath+this.globalData.routePath.life_wxnews+params
      break
    }
    console.log(linkurl)
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
  //跳转到 tabBar 页面
  bindSwitchTo:function(action)
  {
    
    var linkurl
    switch(action)
    {
      case 'shoppingcart':
      linkurl=this.globalData.basePath+this.globalData.routePath.shopping_cart
      break
    }
    wx.switchTab({
      url: linkurl
    })
    
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
  //获取当前位置
  get_Location:function(cb,session_id)
  {
      var that = this
      wx.getLocation({
      type: 'wgs84',
      success: function(arr)
      {
        var post_data={token:that.globalData.token,session_id:session_id,formdata:arr}
        that.func.http_request_action(that.globalData.domainName+that.globalData.api.api_get_location,post_data,function(resback)
        {
          typeof cb == "function" && cb(resback)
        })
      }
    })
  },
  //全局数据配置
  globalData:{
    userInfo:null,
    token:"MbYwyExrMd5G42Da",
    key_juhe_wxnews:"f80345671e5703c0e7ad025ed1489fd5",
    key_juhe_tv:"e4c801770385609b074eaefd9cd7a646",
    key_juhe_calendar:"f68ed7da2fcc6fd078f5c38c6dd1ca95",
    domainName:"https://api.tzsuteng.com",
    api:{
      api_login                   :"/api/xcx/login",
      api_userinfo                :"/api/xcx/userinfo",
      api_del                     :"/api/xcx/deleteapi",
      api_proxy                   :"/api/xcx/proxy",
      api_get_location            :"/api/xcx/getlocation",
      api_district                :"/api/xcx/district",
      api_is_check_in             :"/api/xcx/is_check_in",
      api_check_in                :"/api/xcx/check_in",
      api_businesscard_add        :"/api/xcx/businesscard/add",
      api_businesscard_info       :"/api/xcx/businesscard/info",
      api_businesscard_edit       :"/api/xcx/businesscard/edit",
      api_businesscard            :"/api/xcx/businesscard",
      api_product                 :"/api/xcx/product",
      api_product_info            :"/api/xcx/product/info",
      api_shoppingcart_add        :"/api/xcx/shoppingcart/add",
      api_shoppingcart_edit       :"/api/xcx/shoppingcart/edit",
      api_shoppingcart            :"/api/xcx/shoppingcart",
      api_address_add             :"/api/xcx/address/add",
      api_address_edit            :"/api/xcx/address/edit",
      api_address_info            :"/api/xcx/address/info",
      api_address_set             :"/api/xcx/address/set",
      api_address_default         :"/api/xcx/address/default",
      api_address                 :"/api/xcx/address",
      api_juhe_calendar           :"http://v.juhe.cn/calendar/day",
      api_juhe_getCategory        :"http://japi.juhe.cn/tv/getCategory",
      api_juhe_getChannel         :"http://japi.juhe.cn/tv/getChannel",
      api_juhe_getProgram         :"http://japi.juhe.cn/tv/getProgram",
      api_juhe_wxnews             :"http://v.juhe.cn/weixin/query",
    },
    routePath:{
      business_card_add           :"/businessCard/add/add",
      business_card_view          :"/businessCard/view/view",
      business_card_edit          :"/businessCard/edit/edit",
      business_card               :"/businessCard/index/index",
      product_view                :"/product/view/view",
      shopping_cart               :"/shoppingcart/index/index",
      shopping_cart_settle_account:"/shoppingcart/settle_account/settle_account",
      user_address                :"/user/address/index/index",
      user_address_add            :"/user/address/add/add",
      user_address_edit           :"/user/address/edit/edit",
      life_calendar               :"/life/calendar/index/index",
      life_tvshowplan             :"/life/tvshowplan/index/index",
      life_wxnews                 :"/life/wxnews/index/index",
    },
    imagePath:{
      path_product                :'/uploads/Product/',
      path_productattribute       :'/uploads/Productattribute/',
      path_article                :'/uploads/Article/',
    },
    basePath                      :"/pages",
    
  },
  func:{  
    http_request_action   :http.http_request_action,
    showToast_success     :show.showToast_success,
    showToast_default     :show.showToast_default,
    showModal             :show.showModal,
    makePhoneCall         :common.makePhoneCall,
    WxParse               :WxParse,
    Operation_add         :common.Operation_add,
    Operation_sub         :common.Operation_sub,
    Operation_mul         :common.Operation_mul,
    Operation_div         :common.Operation_div,
  }

}

App(config)