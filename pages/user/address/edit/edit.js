/******************************* 
 * 名称:编辑
 * 作者:rubbish.boy@163.com
 *******************************
*/
import { SA } from '../../../../lib/wxSelectarea/wxSelectarea';
//获取应用实例
var app = getApp()

var config={
  //页面的初始数据
  data: {
    title: '编辑地址',
    userInfo: {},
    session_id:'',
    requestlock:true,
    dataid:"",
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
          SA.load(that,app.globalData); // 初始化区域框
      } 
    })
    that.setData({
      dataid:options.id
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
  //跳转到 tabBar 页面
  bindSwitchTo: function(action) 
  {
    app.bindSwitchTo(action.target.dataset.action)
  },
  //获取详情数据
  get_info: function(id,actionway="") 
  {
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id,id:id}
    app.action_loading();
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_address_info,post_data,function(resback){
      if(resback.status==1)
      {
        app.action_loading_hidden();
        that.setData({
            infodata:resback.resource
        })
        that.setData({
            address: resback.resource.area_pname+' '+resback.resource.area_cname+' '+resback.resource.area_xname,
            area_ids:{
              area_pid:resback.resource.area_pid,
              area_pname:resback.resource.area_pname,
              area_cid:resback.resource.area_cid,
              area_cname:resback.resource.area_cname,
              area_xid:resback.resource.area_xid,
              area_xname:resback.resource.area_xname
            },
            ischoose_area: true, 
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
        app.action_loading_hidden();
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.info
              app.func.showToast_default(msgdata);

      }
    })
  },
  //返回上一页
  bindGoBack:function(action)
  {
    app.bindGoBack(action.target.dataset.type)
  },
  formSubmit: function(e) 
  {
    var that = this
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
    else if(that.data.ischoose_area==false)
    {
      var msgdata=new Object
          msgdata.url=""
          msgdata.msg="选择地区"
          app.func.showToast_default(msgdata)
    }
    else if(e.detail.value.address=="")
    {
      var msgdata=new Object
          msgdata.url=""
          msgdata.msg="详细地址"
          app.func.showToast_default(msgdata)
    }
    else
    {
      var post_data={token:app.globalData.token,session_id:that.data.session_id,formdata:e.detail.value,formdata_hidden:that.data.area_ids,formdataid:that.data.dataid}
      app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_address_edit,post_data,function(resback){
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

