/******************************* 
 * 名称:添加
 * 作者:rubbish.boy@163.com
 *******************************
*/
import { SA } from '../../../../lib/wxSelectarea/wxSelectarea';
//获取应用实例
var app = getApp()

var config={
  //页面的初始数据
  data: {
    title: '新增收货地址',
    userInfo: {},
    session_id:''
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
      } 
    })
    SA.load(that,app.globalData); // 初始化区域框
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function() {
    // Do something when page ready.

  },
  //生命周期函数--监听页面显示
  onShow: function() {
    // Do something when page show.
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
  formSubmit: function(e) 
  {
    if(e.detail.value.name=="")
    {
      var msgdata=new Object
          msgdata.url=""
          msgdata.msg="姓名必填"
      app.func.showToast_default(msgdata)
    }
    else if(e.detail.value.mobile=="")
    {
      var msgdata=new Object
          msgdata.url=""
          msgdata.msg="手机必填"
          app.func.showToast_default(msgdata)
    }
    else
    {
      var that = this
      var post_data={token:app.globalData.token,session_id:that.data.session_id,formdata:e.detail.value}
      app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_businesscard_add,post_data,function(resback){
        if(resback.status==1)
        {
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.info
              app.func.showToast_success(msgdata)
        }
        else
        {
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.info
              app.func.showToast_default(msgdata)
          //console.log('获取用户登录态失败！' + resback.info);
        }
      })
    }

  },
  choosearea() { // 页面弹框触发事件
      SA.choosearea(this); 
  },
  addDot() { // 字符串截取
      SA.addDot(this);
  },
  tapProvince(e) { // 点击省份
      SA.tapProvince(e, this,app.globalData);
  },
  tapCity(e) { // 点击城市
      SA.tapCity(e, this,app.globalData);
  },
  tapDistrict(e) { // 点击区域
      SA.tapDistrict(e, this,app.globalData);
  },
  cancel() { // 取消选择
      SA.cancel(this);
  },
  confirm(e) { // 确认选择区域
      SA.confirm(e, this);
  }
  
}

Page(config)

