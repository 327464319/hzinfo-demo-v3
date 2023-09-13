<template>
  <basic-container>
    <div class="page-container">
      <div class="search">
        <div class="title">站点地图</div>
<!--        <div class="searchInput" v-if="isMapSearch">-->
<!--          <el-input-->
<!--            size="small"-->
<!--            placeholder="请输入关键字"-->
<!--            prefix-icon="el-icon-search"-->
<!--            v-model="input"-->
<!--          >-->
<!--            <el-button-->
<!--              slot="append"-->
<!--              icon="el-icon-search"-->
<!--              @click="search"-->
<!--            ></el-button>-->
<!--          </el-input>-->
<!--        </div>-->
      </div>
      <div style="width:697px;height:550px;border:#ccc solid 1px;" id="map-container"></div>
    </div>
  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "map",
    data() {
      return {
        isMapSearch:false,
        markerArr: [{title:"广东省揭阳市惠来县鳌江镇新寨村",content:"广东省揭阳市惠来县鳌江镇新寨村",point:"116.06019|22.941737",isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}
        ]
      };
    },
    computed: {
      ...mapGetters(["userInfo"]),
    },
    mounted(){
      this.initMap();
    },
    methods: {
      handleChange(val) {
        window.console.log(val);
      },
      initMap(){
        this.createMap();//创建地图
        // this.setMapEvent();//设置地图事件
        // this.addMapControl();//向地图添加控件
        // this.addMarker();//向地图中添加marker
      },
      createMap(){
          var map = new BMap.Map("map-container");//在百度地图容器中创建一个地图
          var point = new BMap.Point(116.060576,22.940971);//定义一个中心点坐标
          map.centerAndZoom(point,17);//设定地图的中心点和坐标并将地图显示在地图容器中
          window.map = map;//将map变量存储在全局
      },
      setMapEvent(){
        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard();//启用键盘上下左右键移动地图
      },
      addMapControl(){
        //向地图中添加缩放控件
        var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
        map.addControl(ctrl_nav);
              //向地图中添加缩略图控件
        var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
        map.addControl(ctrl_ove);
              //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
        map.addControl(ctrl_sca);
      },
      createIcon(json){
        var icon = new BMap.Icon("http://api.map.baidu.com/lbsapi/creatmap/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
        return icon;
      },
      createInfoWindow(i){
        var json = this.markerArr[i];
        var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
        return iw;
      },
      addMarker(){
        for(var i=0;i<this.markerArr.length;i++){
          var json = this.markerArr[i];
          var p0 = json.point.split("|")[0];
          var p1 = json.point.split("|")[1];
          var point = new BMap.Point(p0,p1);
          var iconImg = this.createIcon(json.icon);
          var marker = new BMap.Marker(point,{icon:iconImg});
          var iw = this.createInfoWindow(i);
          var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
          marker.setLabel(label);
          map.addOverlay(marker);
          label.setStyle({
            borderColor:"#808080",
            color:"#333",
            cursor:"pointer"
          });
        }
      }
    },
  };
</script>

<style>
  .el-font-size {
    font-size: 14px;
  }
  .hz-home {

  }
</style>
