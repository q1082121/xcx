/******************************* 
 * 名称:首页
 * 作者:rubbish.boy@163.com
 *******************************
*/

//获取应用实例
var app = getApp()

var config={
  //页面的初始数据
  data: {
    title: '我的信息',
    userInfo: {},
    session_id:'',
    requestlock:true,
    checkin:0,
    address_count:0
  },
  //生命周期函数--监听页面加载
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    //异步获取缓存session_id
    wx.getStorage({
      key: 'session_id',
      success: function(res) {
          that.setData({
            session_id:res.data
          })
          that.is_check_in()
      } 
    })
    wx.getStorage({
      key: 'address_count',
      success: function(res) {
          that.setData({
            address_count:res.data
          })
      } 
    })
    
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function() {
    // Do something when page ready.

  },
  //生命周期函数--监听页面显示
  onShow: function() {
    // Do something when page show.
    if(this.data.requestlock==false)
    {
      this.is_check_in()
      var that = this
      wx.getStorage({
        key: 'address_count',
        success: function(res) {
            that.setData({
              address_count:res.data
            })
        } 
      })
    }
    else
    {
      this.setData({
          requestlock:false
      })
    }
  },
  //生命周期函数--监听页面隐藏
  onHide: function() {
    // Do something when page hide.
  },
  //生命周期函数--监听页面卸载
  onUnload: function() {
    // Do something when page close.
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    // Do something when pull down.
    this.is_check_in('onPullDownRefresh')
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    // Do something when page reach bottom.
  },
  //导航处理函数
  bindNavigateTo: function(action) 
  {
    app.bindNavigateTo(action.target.dataset.action,action.target.dataset.params)
  },
  //页面打开导航处理函数
  bindRedirectTo: function(action) 
  {
    app.bindRedirectTo(action.target.dataset.action,action.target.dataset.params)
  },
  //跳转到 tabBar 页面
  bindSwitchTo: function(action) 
  {
    app.bindSwitchTo(action.target.dataset.action)
  },
  //今日签到状态
  is_check_in:function(actionway="")
  {
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id}
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_is_check_in,post_data,function(resback){
      if(resback.status==1)
      {
        that.setData({
              checkin:resback.resource
        })
        if(actionway=="onPullDownRefresh")
        {
          setTimeout(function(){
          wx.stopPullDownRefresh()
          },800)                 
        }
      }
      else
      {
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.info
              app.func.showToast_default(msgdata)
      }
    })
  },
  //签到动作
  check_in_action:function(action)
  {
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id}
    app.func.showModal("确定要签到？",function(resback){
      if(resback.confirm)
      {     
            app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_check_in,post_data,function(resback){
              if(resback.status==1)
              {
                that.setData({
                      checkin:1,
                      userInfo:resback.resource
                })
                that.globalData.userInfo = resback.resource
                
                var msgdata=new Object
                msgdata.totype=2
                msgdata.msg=resback.info
                app.func.showToast_success(msgdata);
              }
              else
              {
                var msgdata=new Object
                msgdata.totype=2
                msgdata.msg=resback.info
                app.func.showToast_default(msgdata);
              }
            })
      }
      else
      {
            var msgdata=new Object
            msgdata.url=""
            msgdata.msg="取消"
            app.func.showToast_default(msgdata);
      }
    })

  }


  
}

Page(config)