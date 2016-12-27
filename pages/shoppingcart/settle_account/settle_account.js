/******************************* 
 * 名称:结算
 * 作者:rubbish.boy@163.com
 *******************************
*/

//获取应用实例
var app = getApp()

var config=
{
    data:{
      title: '结算信息',
      userInfo: {},
      session_id:'',
      requestlock:true,
      domainName:app.globalData.domainName,
      imagePath:app.globalData.imagePath,
      listdata:{},
      total:0,
      checkitemsid:'',
      checkitems:0,
      isaddress:false,
      addressarr:[]
    },
    onLoad:function(options)
    {
      // 页面初始化 options为页面跳转所带来的参数
      var that = this

      that.setData({
        checkitemsid:options.id
      })

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
    onReady:function(){
      // 页面渲染完成
    },
    onShow:function(){
      // 页面显示
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
    onHide:function(){
      // 页面隐藏
    },
    onUnload:function(){
      // 页面关闭
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
          
          var listitems=resback.resource
          let count=resback.resource.length
          var price,sum=0,itemsidarr
          var checkitemsid=that.data.checkitemsid
          itemsidarr = checkitemsid.split(",");
          let arrcount=itemsidarr.length

          for (var i = 0; i < count; i++) 
          {
              for (var j = 0; j < arrcount; j++) 
              {
                if(listitems[i]['id']==itemsidarr[j])
                {
                  listitems[i]['ischoose']=true
                  price=app.func.Operation_mul(listitems[i]['info']['price'],listitems[i]['qty'])
                  sum=app.func.Operation_add(sum,price)
                }
              }
          } 
          that.get_default_address();
          that.setData({
              listdata:listitems,
              total:sum,
              checkitems:arrcount
          })
          console.log(that.data.addressarr)
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
    get_default_address:function()
    {
      var that = this
      var isaddress
      var post_data={token:app.globalData.token,session_id:that.data.session_id}
      app.action_loading();
      app.func.http_request_action(app.globalData.domainName+app.globalData.api.api_address_default,post_data,function(resback){
        if(resback.status==1)
        {
          app.action_loading_hidden();
          if(resback.resource)
          {
            isaddress=true
          }
          else
          {
            isaddress=false
          }
          that.setData({
              addressarr:resback.resource,
              isaddress:isaddress
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
    }
}
Page(config)