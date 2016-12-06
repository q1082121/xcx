/******************************* 
 * 名称:成功消息提示
 * 作者:rubbish.boy@163.com
 *******************************
*/
function showToast_success(data)
{
    if(data.totype==3)
    {
        wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 1500,
            success:function()
            {
                setTimeout(function(){
                    wx.navigateBack();
                },2000)
            }
        })
    }
    else if(data.url)
    {
        wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 1500,
            success:function()
            {
                switch(data.totype)
                {
                    case 1:
                            setTimeout(function(){
                            wx.navigateTo({
                                    url: data.url
                                })
                            },2000)
                    break
                    case 2:
                            setTimeout(function(){
                            wx.redirectTo({
                                    url: data.url
                                })
                            },2000)
                    break
                    default:
                            setTimeout(function(){
                                wx.navigateBack();
                            },2000)
                    break
                }
            }
        })
    }
    else
    {
        wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 1500
        })
    }
}
/******************************* 
 * 名称:默认消息提示
 * 作者:rubbish.boy@163.com
 *******************************
*/
function showToast_default(data)
{
    if(data.totype==3)
    {
        setTimeout(function(){
            wx.navigateBack();
        },2000)
    }
    else if(data.url)
    {
        wx.showToast({
            title: data.msg,
            duration: 1500,
            success:function()
            {
                switch(data.totype)
                {
                    case 1:
                            setTimeout(function(){
                            wx.navigateTo({
                                    url: data.url
                                })
                            },2000)
                    break
                    case 2:
                            setTimeout(function(){
                            wx.redirectTo({
                                    url: data.url
                                })
                            },2000)
                    break
                    default:
                            setTimeout(function(){
                                wx.navigateBack();
                            },2000)
                    break
                }
                
            }
        })
    }
    else
    {
        wx.showToast({
            title: data.msg,
            icon:'info',
            duration: 1500
        })
    }
}
/******************************* 
 * 名称:模态弹窗
 * 作者:rubbish.boy@163.com
 *******************************
*/
function showModal(msg,cb)
{
    wx.showModal({
        title: '提示',
        content: msg,
        success: function(res) 
        {
            typeof cb == "function" && cb(res)
            /*
            if (res.confirm) 
            {
                console.log('用户点击确定')
            }
            */
        }
    })
}

module.exports = {  
  showToast_success: showToast_success,
  showToast_default: showToast_default,
  showModal: showModal   
}  
