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
    title                : '万年历',
    userInfo             : {},
    session_id           :'',
    requestlock          :true,
    domainName           : app.globalData.domainName,
    // hasEmptyGrid 变量控制是否渲染空格子，若当月第一天是星期天，就不应该渲染空格子
    hasEmptyGrid         : false,
    calendarinfo         :[]

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
          //初始化数据
          const date = new Date();
          const cur_year = date.getFullYear();
          const cur_month = date.getMonth() + 1;
          const cur_date = date.getDate();
          const cur_day = date.getDay();
          const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
          that.calculateEmptyGrids(cur_year, cur_month);
          that.calculateDays(cur_year, cur_month);
          that.getSystemInfo();
          //var cut_dates=cur_year.toString()+"-"+(cur_month<10?"0"+cur_month.toString():cur_month.toString())+"-"+(cur_date<10?"0"+cur_date.toString():cur_date.toString());
          var cut_dates=cur_year.toString()+"-"+(cur_month.toString())+"-"+(cur_date.toString());
          that.setData({
            cur_year,
            cur_month,
            weeks_ch,
            cur_date:cur_date,
            cur_day:cur_day,
            cut_dates
          })
          that.get_calendar();
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
  get_calendar:function(calendar)
  {
    var that = this
    if(calendar)
    {
      that.setData({
            cut_dates:calendar.target.dataset.dateitem
      })
    } 
    var api_data_param="date="+that.data.cut_dates.toString()+"&key="+app.globalData.key_juhe_calendar
    var post_data={token:app.globalData.token,session_id:that.data.session_id,api_url:app.globalData.api.api_juhe_calendar,api_data:api_data_param}
    app.action_loading();
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_proxy,post_data,function(resback){
      if(resback.reason=="Success")
      {
        app.action_loading_hidden();
        that.setData({
            calendarinfo:resback.result.data
        })
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
  // 控制scroll-view高度
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        //scrollViewHeight: res.windowHeight * res.pixelRatio || 667
        scrollViewHeight:667
      });
    } catch (e) {
      console.log(e);
    }
  },
  // 获取当月共多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 获取当月第一天星期几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  // 计算当月1号前空了几个格子
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  // 绘制当月天数占的格子
  calculateDays(year, month) {
    let days = [];
    var dates=[],dateitem=[],months,years=year.toString(),items;
    const thisMonthDays = this.getThisMonthDays(year, month);
    if(month<10)
    {
      months="0"+month.toString();
    }
    else
    {
      months=month.toString();
    }
    for (let i = 1; i <= thisMonthDays; i++) {
      
      days.push(i);
      if(i<10)
      {
        items="0"+i.toString();
      }
      else
      {
        items=i.toString();
      }
      dates.push(years+"-"+months+"-"+items)
      dateitem.push(years+"-"+month.toString()+"-"+i.toString())
    }
    this.setData({
      days,
      dates,
      dateitem
    });
  },
  // 切换控制年月
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  onShareAppMessage() {
    return {
      title: this.data.title,
      desc: '日历查询',
      path: 'pages/life/calendar/index/index'
    }
  }
  
}

Page(config)