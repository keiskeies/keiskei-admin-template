<template>
  <div>
    <div class="base-table">
      <el-table
        v-loading="tableLoading"
        class="base-table-content"
        element-loading-text="数据加载中"
        :data="listData"
        border
        fit
        highlight-current-row
        stripe
        row-key="id"
        :indent="32"
        @sort-change="sortChanged"
        @selection-change="handleSelectionChange">
        <el-table-column
          v-if="showSelect"
          type="selection"
          :fixed="$store.state.app.device !== 'mobile' ? 'left' : undefined"
          width="55"
        />
        <el-table-column
          v-if="!treeTable"
          label="编号"
          header-align="center"
          align="right"
          :fixed="$store.state.app.device !== 'mobile' ? 'left' : undefined"
          width="60"
        >
          <template slot-scope="scope">
            <slot>
              <span style="user-select: none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;">
                {{ scope.$index + 1 }}
              </span>
            </slot>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(column,index) in columns"
          v-if="column.show"
          :key="index"
          :prop="column.key"
          :label="column.label"
          :sortable="column.sortable || (column.type && sortableOptions.includes(column.type))"
          header-align="center"
          :align="column.align || 'center'"
          :width="column.width"
          :min-width="column.minWidth"
          :max-width="column.maxWidth"
          :show-overflow-tooltip="!column.type || column.type.indexOf('WORD') !== -1 || column.type.indexOf('TEXT') !== -1"
          :fixed="$store.state.app.device !== 'mobile' ? column.fixed : undefined"
        >
          <template slot="header" slot-scope="scope">
            <el-tooltip v-if="column.tooltip" class="item" effect="dark" :content="column.tooltip" placement="top">
              <div class="cell">{{ column.label }}</div>
            </el-tooltip>
            <div v-else class="cell">{{ column.label }}</div>
          </template>
          <template slot-scope="scope">
            <!--              format-->
            <template v-if="format[column.key]">
              {{ format[column.key](scope.row, scope.$index) }}
            </template>
            <!--            排序-->
            <template v-else-if="column.type && column.type === 'SORT'">
              <el-button class="el-icon-top" @click="changeDataSort(scope.$index, scope.row,-1)"/>
              <el-button class="el-icon-bottom" @click="changeDataSort(scope.$index, scope.row, 1)"/>
            </template>
            <!--            图片-->
            <template v-else-if="column.type && column.type === 'IMAGE'">
              <a v-if="!scope.row[column.key]">暂无图片</a>
              <img
                v-else
                style="width: 100px; height: 30px"
                referrerpolicy="no-referrer"
                :src="scope.row[column.key] +'?x-oss-process=image/resize,h_30'"
                alt=""
                @click="selectImg(scope.row[column.key],column.type)"
              >
            </template>
            <!--            视频-->
            <template v-else-if="column.type && column.type === 'VIDEO'">
              <a v-if="!scope.row[column.key]">暂无视频</a>
              <img
                v-else
                alt=""
                :src="scope.row[column.key] + '?x-oss-process=video/snapshot,t_1000,h_30,m_fast,f_jpg'"
                @click="selectImg(scope.row[column.key],column.type)"
              >
            </template>
            <!--              链接-->
            <template v-else-if="column.type && column.type === 'LINK'">
              <el-link v-if="scope.row[column.key]" :href="scope.row[column.key]" target="_blank"
                       rel="noopener noreferrer">{{ scope.row[column.key] }}
              </el-link>
            </template>
            <!--            树形单选-->
            <template v-else-if="column.type && column.type === 'TREE_SELECT'">
              <el-cascader
                v-model="(scope.row[column.key]||{id: undefined}).id"
                :options="options[column.optionKey]"
                class="form-item"
                :props="{value: 'id', label: 'name', leaf: 'name', emitPath: false, checkStrictly : true}"
                disabled
              />
            </template>
            <!--            树形多选-->
            <template v-else-if="column.type && column.type === 'TREE_MULTI_SELECT'">
              <el-cascader
                :value="scope.row[column.key].map(e => e.id)"
                :options="options[column.optionKey]"
                class="form-item"
                :props="{value: 'id', label: 'name', leaf: 'name', emitPath: false, multiple: true, checkStrictly : true}"
                disabled
              />
            </template>
            <!--            多选-->
            <template v-else-if="column.type && column.type === 'MULTI_SELECT'">
              {{
                scope.row[column.key] ?
                  (options[column.optionKey] || []).filter(e => scope.row[column.key].includes(e.id)).map(e => e[column.optionKeyLabel || 'name']).join(',')
                  : ''
              }}
            </template>
            <!--            关联单选-->
            <template v-else-if="column.type && column.type === 'REL_SELECT'">
              {{ (scope.row[column.key] || {})[column.optionKeyLabel || 'name'] }}
            </template>
            <!--            单选-->
            <template v-else-if="column.type && column.type === 'DICTIONARY'">
              <el-tag
                v-for="(item, index__) in options[column.optionKey]"
                v-if="item.id === scope.row[column.key]"
                :key="index__"
                :type="item.type"
                :effect="item.effect"
              >{{ item.name }}
              </el-tag>
            </template>
            <template v-else-if="column.type && column.type === 'DICTIONARY1'">
              <el-tag>{{ (options[column.optionKey].filter(e => e.id === scope.row[column.key])[0] || {name: scope.row[column.key]}).name }}
              </el-tag>
            </template>
            <!--            文章-->
            <template v-else-if="column.type && column.type === 'LONG_TEXT' || column.type === 'HTML'">
              <div v-html="scope.row[column.key]"/>
            </template>
            <!--            状态-->
            <template v-else-if="column.type && column.type === 'ENABLE'">
              <el-tag v-if="scope.row[column.key]" type="success">启用</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </template>
            <!--            是否-->
            <template v-else-if="column.type && column.type === 'BOOLEAN'">
              <el-tag v-if="scope.row[column.key]" type="success">是</el-tag>
              <el-tag v-else type="danger">否</el-tag>
            </template>
            <!--              时间-->
            <template
              v-else-if="column.type && (column.type.indexOf('DATE') !== -1 || column.type.indexOf('TIME') !== -1)">
              <i v-if="scope.row[column.key]" class="el-icon-time"/>
              {{ scope.row[column.key] }}
            </template>
            <!--              WORD-->
            <template v-else>
              {{ scope.row[column.key] }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showActions"
          prop="actions"
          label="操作"
          header-align="center"
          align="center"
          :fixed="$store.state.app.device !== 'mobile' ? 'right' : undefined"
          width="100"
        >
          <slot slot-scope="scope" name="table_raw_actions" :row="scope.row"/>
        </el-table-column>
      </el-table>
      <!--      字段显示控制-->
      <div class="base-table-item">
        <el-tooltip class="item" effect="dark" content="表头展示" placement="top-start">
          <el-popover placement="bottom" title="表头展示" width="250" trigger="click">
            <el-form ref="itemForm" class="base-table-item-form" label-width="150px" label-suffix=": ">
              <el-form-item v-for="(item, index) in columns" :key="index" :label="item.label" :prop="item.key">
                <el-switch v-model="item.show"/>
              </el-form-item>
            </el-form>
            <el-button slot="reference" type="primary" size="mini" icon="el-icon-setting" circle/>
          </el-popover>
        </el-tooltip>
      </div>
    </div>
    <div v-show="total>0" style="height: 55px;width: 100%;display: block" />
    <el-card class="box-card" shadow="hover" :body-style="{padding: 0, margin: 0}" style="position: fixed; bottom: 20px; right: 46px; z-index: 5;">
      <pagination v-show="total>0" :total="total" :page="limitQuery.page" :limit="limitQuery.size" @pagination="fetchData"/>
    </el-card>
    <el-dialog :visible.sync="dialogVisibleImg" :width="$store.state.app.device === 'mobile' ? '100%' : '60%'" destroy-on-close center>
      <img :src="fileUrl" width="100%" alt="">
    </el-dialog>
    <el-dialog center :visible.sync="dialogVisibleVideo" :width="$store.state.app.device === 'mobile' ? '100%' : '60%'" destroy-on-close>
      <video preload="auto" :src="fileUrl" width="100%" controls="controls" />
    </el-dialog>
  </div>
</template>
<script>
import {changeBaseSort, getBaseOptions, requestBase} from '@/api/common'
import { treeFind } from '@/utils/treeFind'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission'
import waves from '@/directive/waves'
export default {
  name: 'ListTable',
  components: {
    Pagination,
  },
  directives: { permission, waves },
  props: {
    url: {type: String, default: ''},
    treeTable: { type: Boolean, default: false },
    showSelect: {type: Boolean, default: false},
    showActions: {type: Boolean, default: true},
    idColumn: { type: String, default: 'id' },
    columns: { type: Array, default: () => [] },
    listQuery: {type: Array, default: () => []},
    permission: { type: String, default: '' },
    options: {
      type: Object, default: () => {
      }
    },
    format: {
      type: Object, default: () => {
      }
    },
  },
  data() {
    return {
      listData: [],
      limitQuery: {page: 1, size: 20, asc: undefined, desc: undefined},
      total: 0,
      fileUrl: '',
      tableLoading: false,
      dialogVisibleImg: false,
      dialogVisibleVideo: false,
      sortableOptions: ['TIME', 'DATE', 'DATE_TIME', 'NUMBER', 'BOOLEAN', 'ENABLE'],
      parentOptions:[],
    }
  },
  methods: {
    sortChanged(val) {
      const prop = val.prop
      this.limitQuery.desc = undefined
      this.limitQuery.asc = undefined

      if (val.order === 'ascending') {
        this.limitQuery.asc = prop
      } else if (val.order === 'descending') {
        this.limitQuery.desc = prop
      }
      this.fetchData()
    },
    fetchData(page, size) {
      this.tableLoading = true
      page && typeof (page) === 'number' && (this.limitQuery.page = page)
      size && typeof (size) === 'number' && (this.limitQuery.size = size)
      const conditions = this.listQuery.filter(e => {
        if (e.value && Array.isArray(e.value)) {
          for (let i = 0; i < e.value.length; i++) {
            if (e.value[i]) {
              return true
            }
          }
        }
        return false
      })
      const request = {
        page: this.limitQuery.page,
        size: this.limitQuery.size,
        desc: this.limitQuery.desc,
        asc: this.limitQuery.asc,
        conditions: JSON.stringify(conditions),
        show: this.columns.filter(e => e.show).map(e => e.key).join(',')
      }
      requestBase({url: this.url, params: request}).then(response => {
        const {content, totalElements, number, size} = response.data || {content: [], totalElements: 0}
        this.listData = content
        this.total = totalElements
        this.limitQuery.page = number + 1
        this.limitQuery.size = size
        this.$nextTick(() => {
          this.tableLoading = false
        })
      }).catch(err => {
        console.error(err)
        this.tableLoading = false
      })
    },
    handleSelectionChange(val) {
      this.$emit('selectChange', val.map(e => e[this.idColumn]))
    },
    changeDataSort(rowIndex, row, next) {
      if (this.treeTable) {
        let rowGroupIndex
        treeFind(this.listData, row.parentId).then(res => {
          res.forEach((e, index) => {
            if (e[this.idColumn] === row[this.idColumn]) {
              rowGroupIndex = index
            }
          })
          const nextGroupIndex = rowGroupIndex + next
          if (nextGroupIndex > -1 && nextGroupIndex < res.length) {
            this.handleChangeSort(
              res[rowGroupIndex][this.idColumn], res[rowGroupIndex].sortBy,
              res[nextGroupIndex][this.idColumn], res[nextGroupIndex].sortBy
            )
          }
        })
      } else {
        const nextIndex = rowIndex + next
        if (nextIndex > -1 && nextIndex < this.listData.length) {
          this.handleChangeSort(
            this.listData[rowIndex][this.idColumn], this.listData[rowIndex].sortBy,
            this.listData[nextIndex][this.idColumn], this.listData[nextIndex].sortBy
          )
        }
      }
    },
    handleChangeSort(id1, sortBy1, id2, sortBy2) {
      changeBaseSort(this.url, { id1: id1, sortBy1: sortBy1, id2: id2, sortBy2: sortBy2 }).then(res => {
        this.fetchData()
      })
    },
    handleGetParentOptions() {
      this.treeTable && getBaseOptions(this.url, {}).then(res => {
        this.parentOptions = res.data
      })
    },
    selectImg(val, type) {
      if (!val) {
        return
      }
      if (type === 'IMAGE') {
        this.dialogVisibleImg = true
      }
      if (type === 'VIDEO') {
        this.dialogVisibleVideo = true
      }
      this.fileUrl = val
    },
  }
}
</script>
