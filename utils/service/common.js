/******************************* 
 * 名称:拨号请求
 * 作者:rubbish.boy@163.com
 *******************************
*/
function makePhoneCall(phoneNumber){  
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
    })
} 
module.exports = {  
  makePhoneCall: makePhoneCall
}  
