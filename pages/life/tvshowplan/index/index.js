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
    title                : '电视节目时间表',
    userInfo             : {},
    session_id           :'',
    requestlock          :true,
    domainName           : app.globalData.domainName,
    tvCategory_name      :[],
    tvCategory_id        :[],
    tvChannel            :[],
    tvProgram            :[],
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
          that.get_tvCategory();
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
    setTimeout(function(){
    wx.stopPullDownRefresh()
    },800) 
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
  get_tvCategory:function()
  {
    var that = this 
    var tvCategory_name=[],tvCategory_id=[];
    var api_data_param="key="+app.globalData.key_juhe_tv
    var post_data={token:app.globalData.token,session_id:that.data.session_id,api_url:app.globalData.api.api_juhe_getCategory,api_data:api_data_param}
    app.action_loading();
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_proxy,post_data,function(resback){
      if(resback.error_code=="0")
      {
        app.action_loading_hidden();
        resback.result.forEach(function(e){
          tvCategory_name.push(e.name);
          tvCategory_id.push(e.id);
        })
        that.setData({
            tvCategory_name:tvCategory_name,
            tvCategory_id:tvCategory_id,
        })
        console.log(that.data.tvCategory)
      }
      else
      {
        app.action_loading_hidden();
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.info
              app.func.showToast_default(msgdata);
      }
    })
  },
  onShareAppMessage(){
    return {
      title: this.data.title,
      desc: '电视节目查询',
      path: 'pages/life/tvshowplan/index/index'
    }
  }
  
}

Page(config)