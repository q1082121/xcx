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
    tvCategory_index     :0,
    tvCategory_value     :1,
    tvChannel_name       :[],
    tvChannel_id         :[],
    tvChannel_index      :0,
    tvChannel_value      :"cctv1",
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

          //初始化数据
          const date = new Date();
          const cur_year = date.getFullYear();
          const cur_month = date.getMonth() + 1;
          const cur_date = date.getDate();
          var cur_dates=cur_year.toString()+"-"+(cur_month<10?"0"+cur_month.toString():cur_month.toString())+"-"+(cur_date<10?"0"+cur_date.toString():cur_date.toString());
          that.setData({
            cur_dates:cur_dates,
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
  //获取电视台分类
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
        that.get_tvChannel();
      }
      else
      {
        app.action_loading_hidden();
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.reason
              app.func.showToast_default(msgdata);
      }
    })
  },
  //更改电视台分类
  bindPickerChange_tvCategory: function(e) {
    var that = this 
    that.setData({
      tvCategory_index: e.detail.value,
      tvCategory_value:that.data.tvCategory_id[e.detail.value]
    })
    that.get_tvChannel();
  },
  //获取电视频道
  get_tvChannel:function()
  {
    var that = this 
    var tvChannel_name=[],tvChannel_id=[];
    var api_data_param="pId="+that.data.tvCategory_value+"&key="+app.globalData.key_juhe_tv
    var post_data={token:app.globalData.token,session_id:that.data.session_id,api_url:app.globalData.api.api_juhe_getChannel,api_data:api_data_param}
    app.action_loading();
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_proxy,post_data,function(resback){
      if(resback.error_code=="0")
      {
        app.action_loading_hidden();
        resback.result.forEach(function(e){
          tvChannel_name.push(e.channelName);
          tvChannel_id.push(e.rel);
        })
        that.setData({
            tvChannel_name:tvChannel_name,
            tvChannel_id:tvChannel_id,
            tvChannel_index: 0,
            tvChannel_value:resback.result[0]['rel']
        })
        that.get_tvProgram()
      }
      else
      {
        app.action_loading_hidden();
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.reason
              app.func.showToast_default(msgdata);
      }
    })
  },
  bindPickerChange_tvChannel: function(e) {
    var that = this 
    that.setData({
      tvChannel_index: e.detail.value,
      tvChannel_value:that.data.tvChannel_id[e.detail.value]
    })
    that.get_tvProgram()
  },
  bindPickerChange_dates:function(e)
  {
    var that = this
    that.setData({
      cur_dates: e.detail.value
    })
    that.get_tvProgram()
  },
  //获取电视节目表
  get_tvProgram:function()
  {
    var that = this 
    var api_data_param="code="+that.data.tvChannel_value+"&date="+that.data.cur_dates+"&key="+app.globalData.key_juhe_tv
    var post_data={token:app.globalData.token,session_id:that.data.session_id,api_url:app.globalData.api.api_juhe_getProgram,api_data:api_data_param}
    app.action_loading();
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_proxy,post_data,function(resback){
      if(resback.error_code=="0")
      {
        app.action_loading_hidden();
        that.setData({
            tvProgram:resback.result,
        })
      }
      else
      {
        app.action_loading_hidden();
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.reason
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