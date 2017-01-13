/******************************* 
 * 名称:详情
 * 作者:rubbish.boy@163.com
 *******************************
*/

//获取应用实例
var app = getApp()

var config={
  //页面的初始数据
  data: {
    title                : '详情介绍',
    userInfo             : {},
    session_id           : '',
    requestlock          : true,
    dataid               : "",
    qty                  : 1,
    infodata             : {},
    domainName           : app.globalData.domainName,
    imagePath            : app.globalData.imagePath,
    indicatorDots        : true,
    vertical             : false,
    autoplay             : false,
    interval             : 3000,
    duration             : 1000,
    shopping_actionSheetHidden: true,
    content              :"",
    curprice             :"",
    curimageurl          :"",
    curproductattribute_id:0,
    curtotal_amount      :0,
    expressvalue         :"未设置",
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
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_product_info,post_data,function(resback){
      if(resback.status==1)
      {
        app.action_loading_hidden();
        
        if(resback.resource.syseditor=="Ueditor")
        {
          app.func.WxParse.wxParse('content', 'html', resback.resource.content, that,5);
        }
        if(resback.resource.syseditor=="Markdown")
        {
          app.func.WxParse.wxParse('content', 'markdown', resback.resource.content, that,5);
        }
        that.setData({
            infodata:resback.resource,
            curimageurl:that.data.domainName+that.data.imagePath.path_product+resback.resource.attachment,
            curprice:resback.resource.pricegroup,
            curtotal_amount:resback.resource.total_amount
        })
        if(actionway=="onPullDownRefresh")
        {
          setTimeout(function(){
          wx.stopPullDownRefresh()
          },800)                 
        }
        //调用获取当前位置
        app.get_Location(function(res){
          if(res.resource.price!="未设置运费模板")
          {
            that.setData({
                expressvalue:res.resource.price+"元",
            })
          }
        },that.data.session_id)
      }
      else
      {
        app.action_loading_hidden();
          var msgdata=new Object
              msgdata.totype=3
              msgdata.msg=resback.info
              app.func.showToast_default(msgdata);
        //console.log('获取用户登录态失败！' + resback.info);
      }
    })
  },
  //展开加入购物车弹出界面
  shopping_actionSheetTap:function()
  {
    this.setData({
      shopping_actionSheetHidden: !this.data.shopping_actionSheetHidden
    })
  },
  //取消加入购物车弹出界面
  shopping_actionSheetChange: function(e) {
    this.setData({
      shopping_actionSheetHidden: !this.data.shopping_actionSheetHidden
    })
  },
  //减号动作
  less_action:function(e)
  {
    var qty=this.data.qty
    if(qty==1)
    {
      
    }
    else
    {
      qty=parseInt(qty)-1
      this.setData({
          qty: qty
      });
    }
  },
  //加号动作
  plus_action:function(e)
  {
    var qty=this.data.qty
    var curtotal_amount=this.data.curtotal_amount
    if(qty<curtotal_amount)
    {
      qty=parseInt(qty)+1
      this.setData({
          qty: qty
      });
    }
    
  },
  change_qty_action:function(e)
  {
    var qty=e.detail.value
    var curtotal_amount=this.data.curtotal_amount
    if(qty<curtotal_amount)
    {
      qty=parseInt(qty)>=1?qty:1
      this.setData({
          qty: qty
      });
    }
    else
    {
      this.setData({
          qty: curtotal_amount
      });
    }
  },
  //添加到购物车
  shopping_cart_add:function(arr)
  {
    var that = this
    let curproductattribute_id=that.data.curproductattribute_id
    let qty=that.data.qty
    var post_data={token:app.globalData.token,session_id:that.data.session_id,formdata:{item_id:curproductattribute_id,qty:qty}}
    app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_shoppingcart_add,post_data,function(resback){
      if(resback.status==1)
      {
        var msgdata=new Object
            msgdata.totype=1
            msgdata.msg=resback.info
            app.func.showToast_success(msgdata)

      }
      else
      {
        var msgdata=new Object
            msgdata.totype=1
            msgdata.msg=resback.info
            app.func.showToast_default(msgdata)
      }
      that.setData({
        shopping_actionSheetHidden: !that.data.shopping_actionSheetHidden
      })
    })

  },
  //选择项目
  choose_items_action:function(e)
  {
    var that = this
    var curprice=that.data.curprice
    var curimageurl=that.data.curimageurl
    var curproductattribute_id=that.data.curproductattribute_id
    var curtotal_amount=that.data.curtotal_amount

    var arr=e.target.dataset
    if(arr.id==curproductattribute_id)
    {
      that.setData({
          curprice: that.data.infodata.pricegroup,
          curimageurl: that.data.domainName+that.data.imagePath.path_product+that.data.infodata.attachment,
          curproductattribute_id: 0,
          curtotal_amount: that.data.infodata.total_amount,
          qty:1
      })
    }
    else
    {
      that.setData({
          curprice: arr.price,
          curimageurl: that.data.domainName+that.data.imagePath.path_productattribute+arr.attachment,
          curproductattribute_id: arr.id,
          curtotal_amount: arr.totalamount,
          qty:1
      })
    }
    
  }
}

Page(config)

