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
/******************************* 
 * 名称:运算方法-加法
 * 作者:rubbish.boy@163.com
 *******************************
*/
function Operation_add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (Operation_mul(a, e) + Operation_mul(b, e)) / e;
}
/******************************* 
 * 名称:运算方法-减法
 * 作者:rubbish.boy@163.com
 *******************************
*/
function Operation_sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (Operation_mul(a, e) - Operation_mul(b, e)) / e;
}
/******************************* 
 * 名称:运算方法-乘法
 * 作者:rubbish.boy@163.com
 *******************************
*/
function Operation_mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
/******************************* 
 * 名称:运算方法-除法
 * 作者:rubbish.boy@163.com
 *******************************
*/
function Operation_div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), Operation_mul(c / d, Math.pow(10, f - e));
}

module.exports = {  
  makePhoneCall: makePhoneCall,
  systemSort:systemSort,
  Operation_add:Operation_add,
  Operation_sub:Operation_sub,
  Operation_mul:Operation_mul,
  Operation_div:Operation_div
}  
