import {Promise} from 'util';

const API = 'https://api.tzsuteng.com/vendor/zto/baseArea?msg_type=GET_AREA&data=';

const selectArea = {
  addDot:function(arr) {
    if(arr instanceof Array) {
      arr.map(val => {
        if(val.alias.length > 4) {
          val.fullNameDot = val.alias.slice(0, 4) + '...';
          return val;
        }else {
          val.fullNameDot = val.alias;
          return val;
        }
      }) 
    }
  },
  load:function(_this,globalData) {
    _this.setData({
      isShow: false,
      address_actionSheetHidden:true
    });
    Promise(wx.request, {
      url: globalData.domainName+globalData.api.api_district,
      method: 'GET'
    }).then((province) => {
      const firstProvince = province.data.resource[0];
      selectArea.addDot(province.data.resource);
      _this.setData({
        proviceData: province.data.resource,
        'selectedProvince.index': 0,
        'selectedProvince.id': firstProvince.id,
        'selectedProvince.level': firstProvince.level,
        'selectedProvince.alias': firstProvince.alias,
      });
      return (
        Promise(wx.request, {
          url: globalData.domainName+globalData.api.api_district +'?parentid='+ firstProvince.id+'&level='+(parseInt(firstProvince.level)+1),
          method: 'GET'
        })
      );
    }).then((city) => {
      const firstCity = city.data.resource[0];
      selectArea.addDot(city.data.resource);
      _this.setData({
        cityData: city.data.resource,
        'selectedCity.index': 0,
        'selectedCity.id': firstCity.id,
        'selectedCity.level': firstCity.level,
        'selectedCity.alias': firstCity.alias
      });
      return (
        Promise(wx.request, {
          url: globalData.domainName+globalData.api.api_district +'?parentid='+ firstCity.id+'&level='+(parseInt(firstCity.level)+1),
          method: 'GET'
        })
      );
    }).then((district) => {
      const firstDistrict = district.data.resource[0];
      selectArea.addDot(district.data.resource);
      _this.setData({
        districtData: district.data.resource,
        'selectedDistrict.index': 0,
        'selectedDistrict.id': firstDistrict.id,
        'selectedDistrict.level': firstDistrict.level,
        'selectedDistrict.alias': firstDistrict.alias
      });
    }).catch((e) => {
      console.log(e);
    })
  },
  tapProvince:function(e, _this,globalData) {
    const dataset = e.currentTarget.dataset;
    Promise(wx.request, {
      url: globalData.domainName+globalData.api.api_district +'?parentid='+ dataset.id+'&level='+(parseInt(dataset.level)+1),
      method: 'GET'
    }).then((city) => {
        selectArea.addDot(city.data.resource);
        _this.setData({
            cityData: city.data.resource,
            'selectedProvince.id': dataset.id,
            'selectedProvince.alias': dataset.alias,
            'selectedCity.id': city.data.resource[0].id,
            'selectedCity.alias': city.data.resource[0].alias
        });
        return (
          Promise(wx.request, {
            url: globalData.domainName+globalData.api.api_district +'?parentid='+ city.data.resource[0].id+'&level='+(parseInt(city.data.resource[0].level)+1),
            method: 'GET'
          })
        );
    }).then((district) => {
        selectArea.addDot(district.data.resource);
        _this.setData({
            districtData: district.data.resource,
            'selectedProvince.index': e.currentTarget.dataset.index,
            'selectedCity.index': 0,
            'selectedDistrict.index': 0,
            'selectedDistrict.id': district.data.resource[0].id,
            'selectedDistrict.alias': district.data.resource[0].alias
        });
    }).catch((error) => {
      console.log(error);
    })
  },
  tapCity:function(e, _this,globalData) {
    const dataset = e.currentTarget.dataset;
    Promise(wx.request, {
      url: globalData.domainName+globalData.api.api_district +'?parentid='+ dataset.id+'&level='+(parseInt(dataset.level)+1),
      method: 'GET'
    }).then((district) => {
       selectArea.addDot(district.data.resource);
       _this.setData({
            districtData: district.data.resource,
            'selectedCity.index': e.currentTarget.dataset.index,
            'selectedCity.id': dataset.id,
            'selectedCity.alias': dataset.alias,
            'selectedDistrict.index': 0,
            'selectedDistrict.id': district.data.resource[0].id,
            'selectedDistrict.alias': district.data.resource[0].alias
        });
    }).catch((error) => {
        console.log(error);
    })
  },
  tapDistrict:function(e, _this,globalData) {
      const dataset = e.currentTarget.dataset;
      _this.setData({
          'selectedDistrict.index': e.currentTarget.dataset.index,
          'selectedDistrict.id': dataset.id,
          'selectedDistrict.alias': dataset.alias
      });
  },
  confirm:function(e, _this) {
    _this.setData({
      address: _this.data.selectedProvince.alias + ' ' + _this.data.selectedCity.alias + ' ' + _this.data.selectedDistrict.alias,
      isShow: false,
      address_actionSheetHidden:true
    })
  },
  cancel:function(_this) {
    _this.setData({
      isShow: false,
      address_actionSheetHidden:true
    })
  },
  choosearea:function(_this) {
    _this.setData({
      isShow: true,
      address_actionSheetHidden:false
    })
  }
}

module.exports = {
  SA: selectArea
}
