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
    title: '详情介绍',
    userInfo: {},
    session_id:'',
    addbuttonishidden:"hidden",
    listbuttonishidden:"hidden",
    requestlock:true,
    dataid:"",
    infodata:{},
    domainName:app.globalData.domainName,
    imagePath:app.globalData.imagePath,
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    content:""
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
      } 
    })
    that.setData({
      dataid:options.id
    })
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function() {
    // Do something when page ready.
    this.get_info(this.data.dataid);
    
  },
  //生命周期函数--监听页面显示
  onShow: function() {
    // Do something when page show.
    if(this.data.requestlock==false)
    {
      this.get_info(this.data.dataid);
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
    this.get_info(this.data.dataid,"onPullDownRefresh");
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
  get_info: function(id,actionway="") 
  {
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id,id:id}
    app.action_loading();
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_product_info,post_data,function(resback){
      if(resback.status==1)
      {
        app.action_loading_hidden();
        that.setData({
            infodata:resback.resource
        })
        app.func.WxParse.wxParse('content', 'html', resback.resource.content, that,5);

        if(actionway=="onPullDownRefresh")
        {
          setTimeout(function(){
          wx.stopPullDownRefresh()
          },800)                 
        }
      }
      else
      {
        app.action_loading_hidden();
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.info
              app.func.showToast_default(msgdata);
        //console.log('获取用户登录态失败！' + resback.info);
      }
    })
  },
}

Page(config)
