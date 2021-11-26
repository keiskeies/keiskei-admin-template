<template>
  <div class="base-list page-component__scroll el-scrollbar">
    <el-card class="box-card" shadow="hover" :body-style="{padding: 0}">
      <div slot="header" class="clearfix filter-container">
        <list-search :columns="columns" :options="options" :permission="permission" @filterFetchData="filterFetchData"/>
      </div>
      <!--    表格-->
      <list-table ref="dataTable" :tree-table="treeTable" :url="url" :show-select="showSelect" :show-actions="showActions" :id-column="idColumn" :columns="columns" :list-query="listQuery" :options="options" :format="format">
        <template slot="table_raw_actions" slot-scope="scope">
          <el-popover placement="right">
            <template>
              <el-button v-if="treeTable" v-waves :v-permission="[permission+':add']" type="primary" plain @click="handleAdd(scope.$index, scope.row)">新建子类</el-button>
              <el-button v-waves :v-permission="[permission+':edit']" type="primary" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
              <el-popconfirm :v-permission="[permission+':delete']" title="是否删除这条数据？" icon="el-icon-info" icon-color="red" confirm-button-type="danger" @confirm="handleDelete(scope.$index, scope.row)">
                <el-button slot="reference" v-waves type="danger" style="margin-left: 10px">删除</el-button>
              </el-popconfirm>
              <slot name="raw_actions" :row="scope.row" />
            </template>
            <i slot="reference" class="el-icon-more"/>
          </el-popover>
        </template>
      </list-table>
    </el-card>
    <!--编辑器-->
    <el-drawer
      :title="drawerOptions[drawerStatus].title"
      :visible.sync="drawerVisible"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :wrapper-closable="wrapperClosable"
      direction="rtl"
      :before-close="handleBeforeCloseDrawer"
      :size="$store.state.app.device !== 'mobile' ? editPageWidth : '100%'"
    >
      <slot v-if="editPage" name="raw_edit" :row="temp"/>
      <list-row-edit v-else :temp="temp" :url="url" :permission="permission" :columns="columns" :drawer-status="drawerStatus" :tree-table="treeTable" :rules="rules" :options="options" :parent-options="parentOptions"/>
    </el-drawer>

    <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="100" />
  </div>
</template>

<script>
import { getBaseDetail, getBaseOptions, deleteBase } from '@/api/common'
import permission from '@/directive/permission' // 权限判断指令
import waves from '@/directive/waves' // waves directive

import ListTable from '@/components/BaseList/components/ListTable'
import ListSearch from '@/components/BaseList/components/ListSearch'
import ListRowEdit from '@/components/BaseList/components/ListRowEdit';

export default {
  name: 'BaseList',
  components: {
    ListTable,
    ListSearch,
    ListRowEdit
  },
  directives: { permission, waves },
  props: {
    idColumn: { type: String, default: 'id' },
    editPage: { type: Boolean, default: false },
    editPageWidth: { type: String, default: '60%' },
    url: { type: String, default: '' },
    permission: { type: String, default: '' },
    columns: { type: Array, default: () => [] },
    rules: {
      type: Object, default: () => {
      }
    },
    options: {
      type: Object, default: () => {
      }
    },
    format: {
      type: Object, default: () => {
      }
    },
    showSelect: { type: Boolean, default: false },
    showActions: { type: Boolean, default: true },
    defaultExpandAll: { type: Boolean, default: false },
    treeTable: { type: Boolean, default: false }
  },
  data: () => {
    return {
      tableLoading: true,
      drawerLoading: false,
      wrapperClosable: false,
      limitQuery: { page: 1, size: 20, asc: undefined, desc: undefined },
      total: 0,
      listQuery: [],
      temp: {},
      dialogVisibleImg: false,
      dialogVisibleVideo: false,

      statusOptions: [{ id: true, name: '启用' }, { id: false, name: '禁用' }],
      fileUrl: '',
      drawerVisible: false,
      drawerStatus: 0,
      drawerOptions: [
        { value: '', title: '' },
        { value: 'detail', title: '详情' },
        { value: 'edit', title: '编辑' },
        { value: 'add', title: '新建' }
      ],
      parentOptions: [],
      addOrEditLoading: false,
    }
  },
  watch: {
    temp: {
      deep: true,
      handler(newVal, oldVal) {
        this.wrapperClosable = false
      }
    }
  },
  created() {
    this.handleGetParentOptions()
  },
  methods: {

    filterFetchData(page, size, listQuery) {
      this.listQuery = listQuery
      this.fetchData(page, size, listQuery)
    },
    fetchData(page, size) {
      this.$nextTick(_ => {
        this.$refs.dataTable.fetchData(page, size)
      })
    },
    handleEdit(index, row) {
      if (this.editPage) {
        const self = this
        self.temp.id = row[self.idColumn]
        self.drawerLoading = true
        self.drawerStatus = 2
        self.drawerVisible = true
      } else {
        const self = this
        self.drawerLoading = true
        self.drawerStatus = 2
        self.drawerVisible = true
        self.temp = {}
        getBaseDetail(self.url, row[this.idColumn]).then(res => {
          self.temp = Object.assign(res.data)
          self.drawerLoading = false
          self.$nextTick(() => {
            self.wrapperClosable = true
          })
        }).catch(() => {
          self.drawerLoading = false
        })
      }
    },
    restTemp(parentId) {
      this.temp = {}
      this.columns.forEach(e => {
        let value
        if (e.type === 'MULTI_SELECT' || e.type === 'TREE_MULTI_SELECT') {
          value = []
        }
        if (e.type === 'ENABLE') {
          value = true
        }
        this.$set(this.temp, e.key, value)
      })
      const routerQuery = this.$route.query
      for (const key in routerQuery) {
        this.$set(this.temp, key, routerQuery[key])
      }
      this.treeTable && this.$set(this.temp, 'parentId', parentId)
    },
    handleAdd(index = 0, row = { id: undefined }) {
      const self = this
      if (this.editPage) {
        self.editPageUrl = '#' + self.$route.path + '/edit'
        self.drawerLoading = true
        self.drawerStatus = 2
        self.drawerVisible = true
      } else {
        self.restTemp(row[self.idColumn])
        self.$nextTick(() => {

          self.wrapperClosable = true
        })
        self.drawerStatus = 3
        self.drawerVisible = true
      }
    },

    handleDelete(index, row) {
      const self = this
      deleteBase(self.url, row[this.idColumn]).then(() => {
        self.$notify.success('删除成功!')
        self.fetchData(self.limitQuery.page)
        self.handleGetParentOptions()
      })
    },
    handleBeforeCloseDrawer(done) {
      if (!this.wrapperClosable) {
        this.$confirm('您输入的内容将会丢失，是否关闭?', '提示', {
          confirmButtonText: '关闭',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done(true)
        })
      } else {
        done(true)
      }
    },
    handleTreeNodeClick(val, check) {
      this.temp.permissions = check.checkedNodes
    },
    handleGetParentOptions() {
      this.treeTable && getBaseOptions(this.url, {}).then(res => {
        this.parentOptions = res.data
      })
    },
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-card__header {
  background-color: #f8f8f8;
  padding: 3px !important;
}

.el-tag {
  margin: 0 5px 0 0;
}

.base-list {
  .base-table {
    img {
      height: 30px;
      display: inline;
      vertical-align: middle;
    }
  }

}

</style>
