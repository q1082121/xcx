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
/******************************* 
 * 名称:系统排序方法
 * 作者:rubbish.boy@163.com
 *******************************
*/
function systemSort(arr)
{
	var h = 1;
	while(h<=arr.length/3){
		h = h*3+1;  //O(n^(3/2))by Knuth,1973
	}
	for( ;h>=1;h=Math.floor(h/3)){
		for(var k=0;k<h;k++){
			for(var i=h+k;i<arr.length;i+=h){
				for(var j=i;j>=h&&arr[j]<arr[j-h];j-=h){
					var tmp = arr[j];
					arr[j] = arr[j-h];
					arr[j-h] = tmp;
				}
			}
		}
	}
	return arr;
}
module.exports = {  
  makePhoneCall: makePhoneCall,
  systemSort:systemSort
}  
