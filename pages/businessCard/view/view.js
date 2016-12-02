/******************************* 
 * 名称:详情
 * 作者:rubbish.boy@163.com
 *******************************
*/

//获取应用实例
var app = getApp()

var config={
  //页面的初始数据
  data: {
    title: '名片介绍',
    userInfo: {},
    session_id:'',
    addbuttonishidden:"hidden",
    infodata:{}
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
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
          that.get_info(options.id);
      } 
    })
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function() {
    // Do something when page ready.
    //设置当前页面标题
    wx.setNavigationBarTitle({
      title: this.data.infodata.name+' - '+this.data.title
    })
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
    app.bindNavigateTo(action.target.dataset.action,action.target.dataset.params)
  },
  //页面打开导航处理函数
  bindRedirectTo: function(action) 
  {
    app.bindRedirectTo(action.target.dataset.action,action.target.dataset.params)
  },
  //获取详情数据
  get_info: function(id) 
  {
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id,id:id}
    app.action_loading();
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_businesscard_info,post_data,function(resback){
      if(resback.status==1)
      {
        app.action_loading_hidden();
        that.data.infodata=resback.resource;
        console.log(that.data.infodata);
      }
      else
      {
        app.action_loading_hidden();
        console.log('获取用户登录态失败！' + resback.info);
      }
    })
  },
  //删除请求
  del_action:function(action)
  {
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id,actiondata:action.target.dataset}
    app.func.showModal("确定要执行删除？",function(resback){
      if(resback.confirm)
      {     
            app.action_loading();
            app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_del,post_data,function(resback){
              if(resback.status==1)
              {
                app.action_loading_hidden();
                var msgdata=new Object
                msgdata.url=app.globalData.basePath+app.globalData.routePath.business_card
                msgdata.totype=2
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
      else
      {
            var msgdata=new Object
            msgdata.url=""
            msgdata.msg="取消"
            app.func.showToast_default(msgdata);
      }
    })

  },
  //拨号请求
  makePhoneCall:function(action)
  {
    app.func.makePhoneCall(action.target.dataset.phoneNumber)
  },
  
  
}

Page(config)

