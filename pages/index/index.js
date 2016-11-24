//首页方法

//获取应用实例
var app = getApp()

var config={
  //页面的初始数据
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //生命周期函数--监听页面加载
  onLoad: function () {
    // Do something when page load.
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
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
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }
}

Page(config)

