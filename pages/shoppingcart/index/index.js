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
    requestlock:true,
    domainName:app.globalData.domainName,
    imagePath:app.globalData.imagePath,
    listdata:{},
    checkitems:0,
    total:0,
    allcheckitem:false,
    checkitemsid:''
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
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_shoppingcart,post_data,function(resback){
      if(resback.status==1)
      {
        app.action_loading_hidden()
        that.setData({
            listdata:resback.resource,
            checkitems:0,
            allcheckitem:false,
            total:0,
            checkitemsid:''
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
    let status=e.target.dataset.key
    var listitems=this.data.listdata
    let qty=e.detail.value
    listitems[status]['qty']=parseInt(qty)>=1?qty:1
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
    let original_qty=listitems[status]['original_qty']
    let qty=listitems[status]['qty']
    if(original_qty!=qty)
    {
        var post_data={token:app.globalData.token,session_id:that.data.session_id,formdata:{qty:qty},formdataid:e.target.dataset.id}
      app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_shoppingcart_edit,post_data,function(resback)
      {
        if(resback.status==1)
        {
          var msgdata=new Object
              msgdata.totype=1
              msgdata.msg=resback.info
              app.func.showToast_success(msgdata);

              listitems[status]['original_qty']=qty
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

      }
      else
      {
              listitems[status]['isedit']=false
              listitems[status]['buttonplain']=true
              listitems[status]['editname']="编辑"

              that.setData({
                  listdata: listitems
              });
      }
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
  //单选
  checkbox_action: function(e) 
  {
    let status=e.target.dataset.key
    var listitems=this.data.listdata
    let count=listitems.length
    var checkitems=this.data.checkitems
    var allcheckitem=false
    var total=this.data.total
    var checkitemsid="",checkcount=0
    let price=app.func.Operation_mul(listitems[status]['info']['price'],listitems[status]['qty'])
    if(listitems[status]['ischoose']==false)
    {
      listitems[status]['ischoose']=true
      checkitems=parseInt(checkitems)+1
      if(checkitems==count)
      {
        allcheckitem=true
      }
      total=app.func.Operation_add(total,price)
    }
    else
    {
      listitems[status]['ischoose']=false
      checkitems=parseInt(checkitems)-1
      total=app.func.Operation_sub(total,price)
    }
    for (var i = 0; i < count; ++i) 
    {
      if(listitems[i]['ischoose']==true)
      {
        checkitemsid+=(checkcount==0?"":",")+listitems[i]['id'].toString()
        checkcount++
      }
    } 
    this.setData({
        listdata: listitems,
        checkitems:checkitems,
        allcheckitem:allcheckitem,
        total:total,
        checkitemsid:checkitemsid
    });
  },
  //全选
  allcheckbox_action:function()
  {
    var listitems=this.data.listdata
    let count=listitems.length
    var allcheckitem=this.data.allcheckitem
    var checkitems=this.data.checkitems
    var price,sum=0,checkitemsid=""
    if(count>0)
    { 
      if(allcheckitem==false)
      {
          checkitems=count
          allcheckitem=true
      }
      else
      {
          allcheckitem=false
          checkitems=0
      }
      for (var i = 0; i < count; ++i) 
      {
          listitems[i]['ischoose'] = allcheckitem;
          price=app.func.Operation_mul(listitems[i]['info']['price'],listitems[i]['qty'])
          sum=app.func.Operation_add(sum,price)
          checkitemsid+=(i==0?"":",")+listitems[i]['id'].toString()
      } 
      this.setData({
          listdata: listitems,
          allcheckitem:allcheckitem,
          checkitems:checkitems,
          total:allcheckitem?sum:0,
          checkitemsid:allcheckitem?checkitemsid:''
      });
    }
    
  }
}

Page(config)

