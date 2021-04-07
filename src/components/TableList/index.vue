<template>
  <div class="table-list-content">
    <el-table :data="dataList" border element-loading-text="加载中" style="width: 100%;" size="small"
              fit highlight-current-row fit highlight-current-row :span-method="objectSpanMethod"
    >
      <el-table-column v-for="(column,index) in columns" :key="index" :prop="column.key" :label="column.label"
                       :align="column.align || 'center'" :header-align="column.headerAlign" :width="column.width"
                       :min-width="column.minWidth" :max-width="column.maxWidth" :show-overflow-tooltip="!column.type"
                       :fixed="$store.state.app.device !== 'mobile' ? column.fixed : undefined"
      >
        <template slot-scope="scope">
          <div v-if="column.type == 'sort'">
            <el-button  class="el-icon-top" @click="upIndex(scope.$index)"></el-button>
            <el-button  class="el-icon-bottom" @click="downIndex(scope.$index)"></el-button>
          </div>
          <slot v-else-if="column.type == 'image' && !scope.row[column.key]">暂无图片</slot>
          <img v-else-if="column.type == 'image'" @click="selectImg(scope.row[column.key],column.type)"
               :src="scope.row[column.key] +'?x-oss-process=image/resize,h_50'"
               style="max-height: 50px;background-color: #000000"/>
          <slot v-else-if="column.type == 'video' && !scope.row[column.key]">暂无视频</slot>
          <img v-else-if="column.type == 'video'" @click="selectImg(scope.row[column.key],column.type)"
               :src="scope.row[column.key] + '?x-oss-process=video/snapshot,t_1000,h_50,m_fast,f_jpg'"
               style="max-height: 50px;background-color: #000000"/>
          <el-switch v-else-if="column.type == 'switch'" v-model="scope.row[column.key]" active-color="#13ce66"
                     :active-value="switchData.yes" :inactive-value="switchData.no" inactive-color="#ff4949"/>
          <slot v-else :name="column.key" :index="scope.$index" :row="scope.row" :column="column">
            <i v-if="(column.key.indexOf('Time') >= 0 || column.key.indexOf('Date') >= 0) && scope.row[column.key]" class="el-icon-time"/>
            {{ format != null && typeof(format[column.key]) != 'undefined' ? format[column.key](scope.row,scope.$index): scope.row[column.key]}}
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisibleImg">
      <img :src="fileUrl"
                                   style="background-color: #000000" width="100%"/></el-dialog>
    <el-dialog :visible.sync="dialogVisibleVideo">
      <video :src="fileUrl" preload="auto" width="100%"
             controls="controls" style="background-color: #000000"></video>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'TableList',
    data() {
      return {
        fileUrl: '',
        dialogVisibleImg: false,
        dialogVisibleVideo: false,
        spanArr: [],
        spanColumns: [],
        switchData: {
          yes: 1,
          no: 2
        }
      }
    },
    props: {
      columns: { type: Array, default: () => [] },
      format: { type: Object, default: () => {} },
      sortChange: { type: Function, default: () => {} },
      dataList: { type: Array, default: () => [] },
      spanColumn: { type: String },
      index: { type:String, required:false, default:'' },
    },
    watch: {
      dataList:{
        immediate: true,
        handler(newVal,oldVal) {
          if (this.spanColumn) {
            this.spanArr = []
            let sid = -1
            for (let i = 0; i < newVal.length; i++) {
              if (newVal[i][this.spanColumn] != sid) {
                this.spanArr.push(newVal[i].row)
                sid = newVal[i][this.spanColumn]
              } else {
                this.spanArr.push(0)
              }
            }
          }
        }
      },
      columns: {
        immediate: true,
        handler(newVal,oldVal) {
          newVal.forEach(e => {
            this.spanColumns.push(e.spanFlag)
          })
        }
      }
    },
    methods: {
      upIndex(index) {
        if (index !== 0) {
          if (this.spanColumn) {
            let row = ((this.dataList[index-1].row || 0))

            this.sortChange(
                Object.assign({}, this.dataList[index]),
                Object.assign({}, this.dataList[index - row]),
                this.index);
          }else {
            this.dataList[index] = this.dataList.splice(index - 1, 1, this.dataList[index])[0]
          }
        }
      },
      downIndex(index) {
        let row = ((this.dataList[index].row || 0)-1)
        if (index + row !== this.dataList.length - 1 ) {
          if (this.spanColumn) {
            this.sortChange(
                Object.assign({}, this.dataList[index]),
                Object.assign({}, this.dataList[index + row + 1]),
                this.index);
          }else {
            this.dataList[index] = this.dataList.splice(index + 1, 1, this.dataList[index])[0]
          }

        }
      },
      selectImg(val, type) {
        if (!val) {

          return
        }
        if (type === 'image') {
          this.dialogVisibleImg = true
        }
        if (type === 'video') {
          this.dialogVisibleVideo = true
        }
        this.fileUrl = val
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (this.spanColumn && this.spanColumns[columnIndex]) {
          const _row = this.spanArr[rowIndex]

          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-table{
      td , th{
      padding: 5px 0 !important;
    }
  }

</style>


