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
    title: '新增名片',
    userInfo: {},
    session_id:''
  },
  //生命周期函数--监听页面加载
  onLoad: function () {
    //设置当前页面标题
    wx.setNavigationBarTitle({
      title: this.data.title
    })
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
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    // Do something when page reach bottom.
  },
  //导航处理函数
  bindNavigateTo: function(action) 
  {
    app.bindNavigateTo(action.target.dataset.action)
  },
  formSubmit: function(e) {
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id,fromdata:e.detail.value}
    app.action_loading();
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_businesscard_add,post_data,function(resback){
      if(resback.status==1)
      {
        app.action_loading_hidden();
        var msgdata=new Object
            msgdata.url=app.globalData.basePath+app.globalData.routePath.business_card
            msgdata.msg=resback.info
            app.func.showToast_success(msgdata);
      }
      else
      {
        app.action_loading_hidden();
        console.log('获取用户登录态失败！' + resback.info);
      }
    })

  }
  
}

Page(config)
