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
    title: '微信精选',
    userInfo: {},
    session_id:'',
    domainName:app.globalData.domainName,
    imagePath:app.globalData.imagePath,
    totals               : 0,
    totals_title         :"总数",  
    first_page           :1,//首页
    prev_page            :1,//上一页
    current_page         :1,//当前页
    next_page            :1,//下一页
    last_page            :1,//尾页
    listdata             :{},//列表数据 
    page                 :1 ,
    pagesize             :20,
  },
  //生命周期函数--监听页面加载
  onLoad: function () {
    //调用应用实例的方法获取全局数据
    /**/
    var that = this
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
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
    var api_data_param="pno="+that.data.page+"&ps="+that.data.pagesize+"&key="+app.globalData.key_juhe_wxnews
    var post_data={token:app.globalData.token,session_id:that.data.session_id,api_url:app.globalData.api.api_juhe_wxnews,api_data:api_data_param}
    app.action_loading()
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_proxy,post_data,function(resback){
      if(resback.error_code=="0")
      {
        app.action_loading_hidden()
        let totals=resback.result.totalPage
        let current_page=resback.result.pno
        let last_page=resback.result.totalPage
        that.setData({
            listdata:resback.result.list,
            current_page:current_page,
            last_page:last_page
        })
        //分页限制3组
        if(totals<=3)
        {
          that.setData({
            totals:totals
          })
        }
        else
        {
          that.setData({
            totals:[current_page+1,current_page,current_page+1]
          })
        }
         //下一页数据
        if(current_page==totals)
        {
          that.setData({
            next_page:totals
          })
        }
        else
        {
          that.setData({
            next_page:current_page+1
          })
        }
        //上一页数据
        if(current_page==1)
        {
          that.setData({
            prev_page:1
          })
        }
        else
        {
          that.setData({
            prev_page:current_page-1
          })
        }

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
              //console.log('获取用户登录态失败！' + resback.info);
      }
    })
  },
  //点击页码获取列表数据
  btnClick: function(action)
  {   
      if(action.target.dataset.page != this.current_page)
      {
          this.setData({
            page:action.target.dataset.page
          })
          this.get_list();
      }
      console.log(action.target.dataset.page);
  },
}

Page(config)

