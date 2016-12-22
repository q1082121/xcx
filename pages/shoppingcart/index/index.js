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
    title: '我的购物车',
    userInfo: {},
    session_id:'',
    listbuttonishidden:"hidden",
    addbuttonishidden:"hidden",
    requestlock:true,
    inputShowed: false,
    inputVal: "",
    domainName:app.globalData.domainName,
    imagePath:app.globalData.imagePath,
    listdata:{},
    checkitems:0
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
  get_list: function(actionway="") 
  {
    var that = this
    var post_data={token:app.globalData.token,session_id:that.data.session_id,search_keyword:that.data.inputVal}
    app.action_loading()
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_shoppingcart,post_data,function(resback){
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
        //console.log('获取用户登录态失败！' + resback.info);
      }
    })
  },
  //搜索条相关动作函数
  showInput: function () {
      this.setData({
          inputShowed: true
      });
  },
  hideInput: function () {
      this.setData({
          inputVal: "",
          inputShowed: false
      });
      this.get_list();
  },
  clearInput: function () {
      this.setData({
          inputVal: ""
      });
      this.get_list();
  },
  inputTyping: function (e) {
      this.setData({
          inputVal: e.detail.value
      });
  },
  //切换编辑状态
  editshow:function(e)
  {
      let status=e.target.dataset.key
      var listitems=this.data.listdata
      if(listitems[status]['isedit']==false)
      {
        listitems[status]['isedit']=true
        listitems[status]['buttonplain']=false
        listitems[status]['editname']="完成"

        this.setData({
            listdata: listitems
        });
      }
      else
      {
        this.edit_action(e)
      }
      
  },
  //减号动作
  less_action:function(e)
  {
    let status=e.target.dataset.key
    var listitems=this.data.listdata
    if(listitems[status]['qty']==1)
    {
      this.del_action(e)
    }
    else
    {
      listitems[status]['qty']=parseInt(listitems[status]['qty'])-1
      this.setData({
          listdata: listitems
      });
    }
  },
  //加号动作
  plus_action:function(e)
  {
    let status=e.target.dataset.key
    var listitems=this.data.listdata
    listitems[status]['qty']=parseInt(listitems[status]['qty'])+1
    this.setData({
        listdata: listitems
    });
  },
  change_qty_action:function(e)
  {
    console.log(e)
    let status=e.target.dataset.key
    var listitems=this.data.listdata
    let qty=e.detail.value
    listitems[status]['qty']=qty>=1?qty:1
    this.setData({
        listdata: listitems
    });

  },
  //完成编辑动作
  edit_action:function(e)
  {
    var that = this
    let status=e.target.dataset.key
    var listitems=that.data.listdata

    var post_data={token:app.globalData.token,session_id:that.data.session_id,formdata:{qty:listitems[status]['qty']},formdataid:e.target.dataset.id}
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_shoppingcart_edit,post_data,function(resback){
      if(resback.status==1)
      {
        var msgdata=new Object
            msgdata.totype=1
            msgdata.msg=resback.info
            app.func.showToast_success(msgdata);

            listitems[status]['isedit']=false
            listitems[status]['buttonplain']=true
            listitems[status]['editname']="编辑"

            that.setData({
                listdata: listitems
            });
      }
      else
      {
        var msgdata=new Object
            msgdata.totype=1
            msgdata.msg=resback.info
            app.func.showToast_default(msgdata);

            this.get_list()
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
                //console.log('获取用户登录态失败！' + resback.info);
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
  checkbox_action: function(e) 
  {
    let status=e.target.dataset.key
    var listitems=this.data.listdata
    var checkitems=this.data.checkitems
    if(listitems[status]['ischoose']==false)
      {
        listitems[status]['ischoose']=true
        checkitems=parseInt(checkitems)+1
      }
      else
      {
        listitems[status]['ischoose']=false
        checkitems=parseInt(checkitems)-1
      }
    this.setData({
        listdata: listitems,
        checkitems:checkitems
    });
    console.log(this.data.listdata)
  },
}

Page(config)

