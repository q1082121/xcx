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
    title: '收货地址',
    userInfo: {},
    session_id:'',
    requestlock:true,
    listdata:{}
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
          that.get_list()
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
      this.get_list()
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
    this.get_list('onPullDownRefresh')
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
  get_list: function(actionway="") 
  {
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id,search_keyword:that.data.inputVal}
    app.action_loading()
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_address,post_data,function(resback){
      if(resback.status==1)
      {
        app.action_loading_hidden()
        that.setData({
            listdata:resback.resource
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
          app.action_loading_hidden()
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.info
              app.func.showToast_default(msgdata)    
        
      }
    })
  },
  //设置请求
  set_action:function(action)
  {
    let status=action.target.dataset.key
    var listitems=this.data.listdata
    let count=listitems.length
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id,actiondata:action.target.dataset}
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_address_set,post_data,function(resback){
          if(resback.status==1)
          {
            var msgdata=new Object
            msgdata.totype=1
            msgdata.msg=resback.info
            app.func.showToast_success(msgdata);

            let isdefault=listitems[status]['isdefault']==0?1:0
            for (var i = 0; i < count; ++i) 
            {
                listitems[i]['isdefault'] = 0;
            } 
            listitems[status]['isdefault']=isdefault
            that.setData({
                listdata:listitems
            })
            
          }
          else
          {
            var msgdata=new Object
            msgdata.totype=1
            msgdata.msg=resback.info
            app.func.showToast_default(msgdata);
            
          }
        })

  },
  //删除请求
  del_action:function(action)
  {
    let status=action.target.dataset.key
    var listitems=this.data.listdata
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id,actiondata:action.target.dataset}
    app.func.showModal("确定要执行删除？",function(resback){
      if(resback.confirm)
      {     
            app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_del,post_data,function(resback){
              if(resback.status==1)
              {
                var msgdata=new Object
                msgdata.totype=1
                msgdata.msg=resback.info
                app.func.showToast_success(msgdata);

                listitems.splice(status,1)
                that.setData({
                    listdata: listitems
                })

              }
              else
              {
                var msgdata=new Object
                msgdata.totype=1
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

  },
  
}

Page(config)