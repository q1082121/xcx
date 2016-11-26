/******************************* 
 * 名称:成功消息提示
 * 作者:rubbish.boy@163.com
 *******************************
*/
function showToast_success(data)
{
    if(data.url)
    {
        wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 2000,
            success:function()
            {
                setTimeout(function(){
                   wx.navigateTo({
                        url: data.url
                    })
                },2000)
            }
        })
    }
    else
    {
        wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 2000
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
    if(data.url)
    {
        wx.showToast({
            title: data.msg,
            duration: 2000,
            success:function()
            {
                setTimeout(function(){
                   wx.navigateTo({
                        url: data.url
                    })
                },2000)
            }
        })
    }
    else
    {
        wx.showToast({
            title: data.msg,
            icon:'info',
            duration: 2000
        })
    }
}
module.exports = {  
  showToast_success: showToast_success,
  showToast_default: showToast_default   
}  
