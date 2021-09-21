<template>
  <div class="base-list page-component__scroll el-scrollbar">
    <el-card class="box-card" shadow="hover" :body-style="{padding: 0}">
      <div slot="header" class="clearfix filter-container">
        <el-row v-if="listQuery && listQuery.length > 0" :gutter="5">
          <template v-for="(column, index) in columns" v-if="column.queryFlag || false">
            <el-col
              :xs="{span: (listQuery[index].condition === 'BT' ? 2 : 1) * 12}"
              :sm="{span: (listQuery[index].condition === 'BT' ? 2 : 1) * 8}"
              :md="{span: (listQuery[index].condition === 'BT' ? 2 : 1) * 6}"
              :lg="{span: (listQuery[index].condition === 'BT' ? 2 : 1) * 4}"
              :xl="{span: (listQuery[index].condition === 'BT' ? 2 : 1) * 3}"
            >
              <!--            TREE_SELECT-->
              <el-cascader
                v-if="column.type && column.type.indexOf('TREE') !== -1"
                v-model="listQuery[index].value"
                :options="options[column.optionKey]"
                class="filter-item"
                :props="{value: 'id', label: 'name', leaf: 'name', emitPath: false, multiple: true, checkStrictly : true}"
                collapse-tags
                @change="fetchData(1)"
              />
              <!--            SELECT-->
              <el-select
                v-else-if="column.type && column.type.indexOf('SELECT') !== -1"
                v-model="listQuery[index].value"
                clearable
                multiple
                class="filter-item"
                :placeholder="column.label"
                @change="fetchData(1)"
              >
                <el-option
                  v-for="item in options[column.optionKey]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <!--            ENABLE-->
              <el-select
                v-else-if="column.type && column.type === 'ENABLE'"
                v-model="listQuery[index].value"
                clearable
                class="filter-item"
                :placeholder="column.label"
                multiple
                @change="fetchData(1)"
              >
                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <!--            DATE_TIME-->
              <el-date-picker
                v-else-if="column.type && column.type === 'DATE_TIME'"
                v-model="listQuery[index].value[0]"
                clearable
                class="filter-item"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator=" - "
                :start-placeholder="column.label + '开始'"
                :end-placeholder="column.label + '结束'"
                @change="fetchData(1)"
              />
              <!--            WORD-->
              <template v-else>
                <template v-if="listQuery[index].condition === 'BT'">
                  <el-input
                    v-model="listQuery[index].value[0]"
                    clearable
                    class="filter-item"
                    @keyup.enter.native="fetchData(1)"
                  >
                    <template slot="prepend">
                      <el-tooltip effect="dark" :content="column.label" placement="top">
                        <el-select v-model="listQuery[index].condition">
                          <el-option
                            v-for="(item, index_) in conditionOptions"
                            v-if="item[column.type]"
                            :key="index_"
                            :label="column.label + item.value"
                            :value="item.key"
                          />
                        </el-select>
                      </el-tooltip>
                    </template>
                    <el-input slot="append" v-model="listQuery[index].value[1]" clearable />
                  </el-input>
                </template>
                <template v-else>
                  <el-input
                    v-model="listQuery[index].value[0]"
                    clearable
                    class="filter-item"
                    :placeholder="column.label"
                    @keyup.enter.native="fetchData(1)"
                  >
                    <template slot="prepend">
                      <el-tooltip effect="dark" :content="column.label" placement="top">
                        <el-select v-model="listQuery[index].condition">
                          <el-option
                            v-for="(item, index_) in conditionOptions"
                            v-if="item['WORD']"
                            :key="index_"
                            :label="column.label + item.value"
                            :value="item.key"
                          />
                        </el-select>
                      </el-tooltip>
                    </template>

                  </el-input>
                </template>
              </template>
            </el-col>
          </template>
        </el-row>

        <el-button v-waves type="primary" class="filter-button" icon="el-icon-search" @click="fetchData()">
          搜索
        </el-button>
        <el-button
          v-waves
          v-permission="[permission+':add']"
          type="primary"
          class="filter-button"
          icon="el-icon-plus"
          plain
          @click="handleAdd"
        >新建
        </el-button>
      </div>
      <!--    表格-->
      <div class="base-table">
        <el-table
          class="base-table-content"
          :data="listData"
          element-loading-text="加载中"
          border
          height="500"
          fit
          highlight-current-row
          stripe
          :span-method="objectSpanMethod"
          row-key="id"
          :default-expand-all="defaultExpandAll"
          :indent="32"
          @sort-change="sortChanged"
          @row-dblclick="handleDetail"
          @selection-change="handleSelectionChange"
          @row-contextmenu="handleRow"
        >
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
              <slot>{{ scope.$index + 1 }}</slot>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(column,index) in columns"
            v-if="column.show"
            :key="index"
            :prop="column.key"
            :label="column.label"
            :sortable="column.sortable"
            header-align="center"
            :align="column.align || 'center'"
            :width="column.width"
            :min-width="column.minWidth"
            :max-width="column.maxWidth"
            :show-overflow-tooltip="!column.type"
            :fixed="$store.state.app.device !== 'mobile' ? column.fixed : undefined"
          >
            <template slot="header" slot-scope="scope">
              <el-tooltip v-if="column.tooltip" class="item" effect="dark" :content="column.tooltip" placement="top">
                <div class="cell">{{ column.label }}</div>
              </el-tooltip>
              <div v-else class="cell">{{ column.label }}</div>
            </template>
            <template slot-scope="scope" :class="column.type">
              <!--            排序-->
              <template v-if="column.type === 'SORT'">
                <el-button class="el-icon-top" @click="changeDataSort(scope.$index, scope.row,-1)" />
                <el-button class="el-icon-bottom" @click="changeDataSort(scope.$index, scope.row, 1)" />
              </template>
              <!--            图片-->
              <template v-else-if="column.type === 'IMAGE'">
                <a v-if="!scope.row[column.key]">暂无图片</a>
                <img
                  v-else
                  :src="$media + scope.row[column.key] +'?x-oss-process=image/resize,h_30'"
                  alt=""
                  @click="selectImg(scope.row[column.key],column.type)"
                >
              </template>
              <!--            视频-->
              <template v-else-if="column.type === 'VIDEO'">
                <a v-if="!scope.row[column.key]">暂无视频</a>
                <img
                  v-else
                  alt=""
                  :src="$media + scope.row[column.key] + '?x-oss-process=video/snapshot,t_1000,h_30,m_fast,f_jpg'"
                  @click="selectImg(scope.row[column.key],column.type)"
                >
              </template>
              <!--            树形单选-->
              <template v-else-if="column.type === 'TREE_SELECT'">
                <el-cascader
                  v-model="(scope.row[column.key]||{id: undefined}).id"
                  :options="options[column.optionKey]"
                  class="form-item"
                  :props="{value: 'id', label: 'name', leaf: 'name', emitPath: false, checkStrictly : true}"
                  disabled
                />
              </template>
              <!--            树形多选-->
              <template v-else-if="column.type === 'TREE_MULTI_SELECT'">
                <el-cascader
                  v-model="(scope.row[column.key]||{id: undefined}).id"
                  :options="options[column.optionKey]"
                  class="form-item"
                  :props="{value: 'id', label: 'name', leaf: 'name', emitPath: false, multiple: true, checkStrictly : true}"
                  disabled
                />
              </template>
              <!--            多选-->
              <template v-else-if="column.type === 'MULTI_SELECT'">
                {{ (scope.row[column.key] || []).map(e => e.name).join(',') }}
              </template>
              <!--            关联单选-->
              <template v-else-if="column.type === 'REL_SELECT'">
                {{ (scope.row[column.key] || {}).name }}
              </template>
              <!--            单选-->
              <template v-else-if="column.type === 'SELECT'">
                <el-tag
                  v-for="(item, index__) in options[column.optionKey]"
                  v-if="item.id === scope.row[column.key]"
                  :key="index__"
                  :type="item.type"
                  :effect="item.effect"
                >{{ item.name }}
                </el-tag>
              </template>
              <!--            文章-->
              <template
                v-else-if="column.type === 'LONG_WORD' || column.type === 'LONG_TEXT' || column.type === 'TO_LONG_TEXT'"
              >
                <div v-html="scope.row[column.key]" />
              </template>
              <!--            状态-->
              <template v-else-if="column.type === 'ENABLE'">
                <el-tag v-if="scope.row[column.key]" type="success">启用</el-tag>
                <el-tag v-else type="danger">禁用</el-tag>
              </template>
              <!--            其他-->
              <template v-else :name="column.key" :index="scope.$index" :row="scope.row" :column="column">
                <i v-if="column.type === 'DATE_TIME' && scope.row[column.key]" class="el-icon-time" />
                {{
                  scope.row[column.key]
                    ?
                      (format != null && typeof (format[column.key]) != 'undefined' ? format[column.key](scope.row, scope.$index) : scope.row[column.key])
                    :
                      ''
                }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showActions"
            prop="actions"
            label="操作"
            header-align="center"
            :align="actionsAlign"
            :fixed="$store.state.app.device !== 'mobile' ? 'right' : undefined"
            :min-width="actionsWidth || (treeTable ? 260 : 180)"
          >
            <template slot-scope="scope" class="actions">
              <el-button
                v-if="treeTable"
                v-waves
                :v-permission="[permission+':add']"
                type="primary"
                plain
                @click="handleAdd(scope.$index, scope.row)"
              >新建子类
              </el-button>
              <el-button
                v-waves
                :v-permission="[permission+':edit']"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑
              </el-button>
              <el-popconfirm
                :v-permission="[permission+':delete']"
                title="是否删除这条数据？"
                icon="el-icon-info"
                icon-color="red"
                confirm-button-type="danger"
                @onConfirm="handleDelete(scope.$index, scope.row)"
              >
                <el-button slot="reference" v-waves type="danger" style="margin-left: 10px">删除</el-button>
              </el-popconfirm>
              <slot name="raw_actions" :row="scope.row" />
            </template>
          </el-table-column>
        </el-table>
        <!--      字段显示控制-->
        <div class="base-table-item">
          <el-tooltip class="item" effect="dark" content="表头展示" placement="top-start">
            <el-popover placement="bottom" title="表头展示" width="250" trigger="click">
              <el-form ref="itemForm" class="base-table-item-form" label-width="150px" label-suffix=": ">
                <el-form-item v-for="(item, index) in columns" :key="index" :label="item.label" :prop="item.key">
                  <el-switch v-model="item.show" />
                </el-form-item>
              </el-form>
              <el-button slot="reference" type="primary" size="mini" icon="el-icon-setting" circle />
            </el-popover>
          </el-tooltip>
        </div>
      </div>

      <pagination
        v-if="!treeTable"
        v-show="total>0"
        :total="total"
        :page="limitQuery.page"
        :limit="limitQuery.size"
        @pagination="fetchData"
      />
    </el-card>
    <!--编辑器-->
    <el-drawer
      :title="drawerOptions[drawerStatus].title"
      :visible.sync="drawerVisible"
      direction="rtl"
      :before-close="handleCloseDrawer"
      :size="$store.state.app.device !== 'mobile' ? '50%' : '100%'"
    >
      <el-form
        :ref="url + '_DataForm'"
        :rules="rules[drawerOptions[drawerStatus].value]"
        :model="temp"
        label-width="auto"
        label-suffix=": "
        style="margin: 15px;"
      >
        <el-form-item v-if="treeTable" label="上级" prop="parentId">
          <el-select v-model="temp.parentId" class="form-item">
            <el-option
              v-for="(item, index) in parentOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(column, index) in columns"
          v-if="column.edit"
          :key="index"
          :label="column.label"
          :prop="column.key"
        >

          <!--     图片     -->
          <upload-image
            v-if="column.type === 'IMAGE'"
            :ref="url + '_UploadImage_' + column.key"
            class="form-item"
            :file-url="temp[column.key]"
            :column-name="column.key"
            @uploadSuccess="columnValChange"
          />
          <!--     视频     -->
          <upload-video
            v-else-if="column.type === 'VIDEO'"
            :ref="url + '_UploadVideo_' + column.key"
            class="form-item"
            :file-url="temp[column.key]"
            :column-name="column.key"
            @uploadSuccess="columnValChange"
          />
          <!--     开关     -->
          <el-switch
            v-else-if="column.type === 'ENABLE'"
            v-model="temp[column.key]"
            active-color="#13ce66"
            inactive-color="#ff0000"
            active-text="启用"
            inactive-text="禁用"
          />
          <!--     数字     -->
          <el-input-number
            v-else-if="column.type === 'NUMBER'"
            v-model="temp[column.key]"
            class="form-item"
          />
          <!--     多选     -->
          <el-select
            v-else-if="column.type === 'MULTI_SELECT'"
            v-model="temp[column.key]"
            class="form-item"
            value-key="id"
            multiple
            clearable
          >
            <el-option
              v-for="(item, index_) in options[column.optionKey]"
              :key="index_"
              :label="item.name"
              :value="item"
            />
          </el-select>
          <!--     关联单选     -->
          <el-select
            v-else-if="column.type === 'REL_SELECT'"
            v-model="temp[column.key]"
            class="form-item"
            value-key="id"
            clearable
          >
            <el-option
              v-for="(item, index_) in options[column.optionKey]"
              :key="index_"
              :label="item.name"
              :value="item"
            />
          </el-select>
          <!--    单选      -->
          <el-select
            v-else-if="column.type === 'SELECT' || column.type === 'SELECT'"
            v-model="temp[column.key]"
            class="form-item"
            clearable
          >
            <el-option
              v-for="(item, index_) in options[column.optionKey]"
              :key="index_"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <!--     树形多选       -->
          <tree-multi-select
            v-else-if="column.type === 'TREE_MULTI_SELECT' && drawerVisible"
            :ref="url + '_TreeForm_' + column.key"
            :column-name="column.key"
            :tree-data="options[column.optionKey]"
            :show-checkbox="drawerStatus > 1"
            :default-checked-keys="(temp[column.key]||[]).map(e => e.id)"
            @columnValChange="columnValChange"
          />
          <!--          富文本-->
          <tinymce
            v-else-if="column.type === 'HTML'"
            :ref="url + '_Html_' + column.key"
            :value="temp[column.key]"
            :column-name="column.key"
            @columnValChange="columnValChange"
          />
          <!--     树形单选       -->
          <tree-single-select
            v-else-if="column.type === 'TREE_SELECT'"
            :options="options[column.optionKey]"
            :check-node="temp[column.key]"
            :column-name="column.key"
            @columnValChange="columnValChange"
          />
          <!--            时间日期-->
          <el-date-picker
            v-else-if="column.type === 'DATE_TIME'"
            v-model="temp[column.key]"
            clearable
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          />
          <!--          标签-->
          <template
            v-else-if="column.type === 'TAGS'"
          >
            <el-tag
              v-for="(tag, index_) in temp[column.key]"
              :key="index_"
              closable
              :disable-transitions="false"
              @close="handleClose(column.key, tag, index_)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible[column.key]"
              :ref="'saveTagInput_' + column.key"
              v-model="inputValue"
              class="input-new-tag"
              @keyup.enter.native="handleInputConfirm(column.key)"
              @blur="handleInputConfirm(column.key)"
            />
            <el-button v-else class="button-new-tag" @click="showInput(column.key)">+ 添加</el-button>
          </template>
          <!--    普通文本      -->
          <el-input v-else v-model="temp[column.key]" clearable :autofocus="column.autofocus" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves @click="drawerVisible = false">取消</el-button>
          <el-button
            v-if="drawerStatus === 3"
            v-waves
            v-permission="[permission+':add']"
            type="primary"
            :loading="addLoading"
            @click="handleSave()"
          >保存
          </el-button>
          <el-button
            v-if="drawerStatus === 2"
            v-waves
            v-permission="[permission+':edit']"
            type="primary"
            @click="handleUpdate()"
          >提交
          </el-button>
        </el-form-item>

      </el-form>
    </el-drawer>
    <el-dialog
      :visible.sync="dialogVisibleImg"
      :width="$store.state.app.device === 'mobile' ? '100%' : '60%'"
      destroy-on-close
    >
      <img :src="$media + fileUrl" width="100%" alt="">
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisibleVideo"
      :width="$store.state.app.device === 'mobile' ? '100%' : '60%'"
      destroy-on-close
    >
      <video preload="auto" :src="$media + fileUrl" width="100%" controls="controls" />
    </el-dialog>
    <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="100" />
  </div>
</template>

<script>
import { getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, changeBaseSort, deleteBase } from '@/api/common'
import permission from '@/directive/permission' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import { treeFind } from '@/utils/treeFind'
import Pagination from '@/components/Pagination'
import UploadImage from '@/components/UploadImage'
import UploadVideo from '@/components/UploadVideo'
import UploadFile from '@/components/UploadFile'
import Tinymce from '@/components/Tinymce'
import TreeMultiSelect from '@/components/TreeMultiSelect'
import TreeSingleSelect from '@/components/TreeSingleSelect'

export default {
  name: 'BaseList',
  components: { Pagination, UploadImage, UploadVideo, UploadFile, Tinymce, TreeMultiSelect, TreeSingleSelect },
  directives: { permission, waves },
  props: {
    editPage: { type: Boolean, default: false },
    actionsWidth: { type: Number },
    actionsAlign: { type: String, default: 'center' },
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
    spanColumn: { type: String, default: '' },
    defaultExpandAll: { type: Boolean, default: false },
    treeTable: { type: Boolean, default: false }
  },
  data: () => {
    return {
      limitQuery: { page: 1, size: 20, asc: undefined, desc: undefined },
      total: 0,
      listData: [],
      listQuery: [],
      temp: {},
      tempBefore: {},
      dialogVisibleImg: false,
      dialogVisibleVideo: false,
      inputVisible: {},
      inputValue: '',
      spanArr: [],
      spanColumns: [],
      statusOptions: [{ id: true, name: '启用' }, { id: false, name: '禁用' }],
      fileUrl: '',
      drawerVisible: false,
      drawerStatus: 0,
      drawerOptions: [{ value: '', title: '' }, { value: 'detail', title: '详情' }, {
        value: 'edit',
        title: '编辑'
      }, { value: 'add', title: '新建' }],
      parentOptions: [],
      addLoading: false,
      conditionOptions: [
        {
          key: 'EQ',
          value: '等于',
          NUMBER: true,
          DECIMAL: true,
          MONEY: true,
          DATE: false,
          TIME: false,
          DATE_TIME: false,
          WORD: true,
          LONG_WORD: true,
          LONG_TEXT: true,
          TO_LONG_TEXT: true,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: true,
          SORT: false,
          SELECT: true
        },
        {
          key: 'NE',
          value: '不等',
          NUMBER: true,
          DECIMAL: true,
          MONEY: true,
          DATE: false,
          TIME: false,
          DATE_TIME: false,
          WORD: true,
          LONG_WORD: true,
          LONG_TEXT: true,
          TO_LONG_TEXT: true,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: true,
          SORT: false,
          SELECT: true
        },
        {
          key: 'GE',
          value: '大/等',
          NUMBER: true,
          DECIMAL: true,
          MONEY: true,
          DATE: false,
          TIME: false,
          DATE_TIME: false,
          WORD: false,
          LONG_WORD: false,
          LONG_TEXT: false,
          TO_LONG_TEXT: false,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: true,
          SORT: false,
          SELECT: false
        },
        {
          key: 'GT',
          value: '大于',
          NUMBER: true,
          DECIMAL: true,
          MONEY: true,
          DATE: false,
          TIME: false,
          DATE_TIME: false,
          WORD: false,
          LONG_WORD: false,
          LONG_TEXT: false,
          TO_LONG_TEXT: false,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: true,
          SORT: false,
          SELECT: false
        },
        {
          key: 'LE',
          value: '小/等',
          NUMBER: true,
          DECIMAL: true,
          MONEY: true,
          DATE: false,
          TIME: false,
          DATE_TIME: false,
          WORD: false,
          LONG_WORD: false,
          LONG_TEXT: false,
          TO_LONG_TEXT: false,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: true,
          SORT: false,
          SELECT: false
        },
        {
          key: 'LT',
          value: '小于',
          NUMBER: true,
          DECIMAL: true,
          MONEY: true,
          DATE: false,
          TIME: false,
          DATE_TIME: false,
          WORD: false,
          LONG_WORD: false,
          LONG_TEXT: false,
          TO_LONG_TEXT: false,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: true,
          SORT: false,
          SELECT: false
        },
        {
          key: 'BT',
          value: '区间',
          NUMBER: true,
          DECIMAL: true,
          MONEY: true,
          DATE: true,
          TIME: true,
          DATE_TIME: true,
          WORD: false,
          LONG_WORD: false,
          LONG_TEXT: false,
          TO_LONG_TEXT: false,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: true,
          SORT: false,
          SELECT: false
        },
        {
          key: 'LIKE',
          value: '包含',
          NUMBER: false,
          DECIMAL: false,
          MONEY: false,
          DATE: false,
          TIME: false,
          DATE_TIME: false,
          WORD: true,
          LONG_WORD: true,
          LONG_TEXT: true,
          TO_LONG_TEXT: true,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: false,
          SORT: false,
          SELECT: false
        },
        {
          key: 'LL',
          value: '前缀',
          NUMBER: false,
          DECIMAL: false,
          MONEY: false,
          DATE: true,
          TIME: true,
          DATE_TIME: true,
          WORD: true,
          LONG_WORD: true,
          LONG_TEXT: true,
          TO_LONG_TEXT: true,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: false,
          SORT: false,
          SELECT: false
        },
        {
          key: 'LR',
          value: '后缀',
          NUMBER: false,
          DECIMAL: false,
          MONEY: false,
          DATE: true,
          TIME: true,
          DATE_TIME: true,
          WORD: true,
          LONG_WORD: true,
          LONG_TEXT: true,
          TO_LONG_TEXT: true,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: false,
          SORT: false,
          SELECT: false
        },
        {
          key: 'IN',
          value: '属于',
          NUMBER: true,
          DECIMAL: true,
          MONEY: true,
          DATE: false,
          TIME: false,
          DATE_TIME: false,
          WORD: false,
          LONG_WORD: false,
          LONG_TEXT: false,
          TO_LONG_TEXT: false,
          IMAGE: false,
          VIDEO: false,
          FILE: false,
          VISIT_TIMES: false,
          SORT: false,
          SELECT: true
        }
      ]
    }
  },
  watch: {
    // columns: {
    //   immediate: true,
    //   handler(newVal, oldVal) {
    //     // this.spanColumns = newVal.map(e => e.spanFlag)
    //
    //   }
    // }
  },
  created() {
    const limitQuery = localStorage.getItem(this.url + '_limitQuery')
    if (limitQuery) {
      this.limitQuery = JSON.parse(limitQuery)
    }
    const listQuery = localStorage.getItem(this.url + '_listQuery')
    if (listQuery) {
      this.listQuery = JSON.parse(listQuery)
    } else {
      const listQuery = []
      this.columns.forEach(e => {
        let condition = 'EQ'
        let value
        if (e.type && e.type.concat('SELECT')) {
          condition = 'IN'
          value = []
        } else if (e.type && e.type.concat('TIME')) {
          condition = 'BT'
          value = []
        } else if (e.type && e.type.concat('WORD')) {
          condition = 'LIKE'
        }
        console.log(e, condition, value)
        listQuery.push({ column: e.key, condition: condition, value: value })
      })
      this.listQuery = listQuery
      this.handleGetParentOptions()
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleClose(key, tag, index) {
      this.temp[key].splice(index, 1)
    },
    showInput(key) {
      this.$set(this.inputVisible, key, true)
      this.$nextTick(_ => {
        // this.$refs['saveTagInput_' + key].$refs.input.focus()
      })
    },
    handleInputConfirm(key) {
      if (this.inputValue) {
        if (!this.temp[key]) {
          this.$set(this.temp, key, [])
        }
        this.temp[key].push(this.inputValue)
      }
      this.$set(this.inputVisible, key, false)
      this.inputValue = ''
    },
    handleSelectionChange(val) {
      this.$emit('selectChange', val.map(e => e.id))
    },
    changeDataSort(rowIndex, row, next) {
      if (this.treeTable) {
        let rowGroupIndex
        treeFind(this.listData, row.parentId).then(res => {
          res.forEach((e, index) => {
            if (e.id === row.id) {
              rowGroupIndex = index
            }
          })
          const nextGroupIndex = rowGroupIndex + next
          if (nextGroupIndex > -1 && nextGroupIndex < res.length) {
            this.handleChangeSort(
              res[rowGroupIndex].id, res[rowGroupIndex].sortBy,
              res[nextGroupIndex].id, res[nextGroupIndex].sortBy
            )
          }
        })
      } else {
        const nextIndex = rowIndex + next
        if (nextIndex > -1 && nextIndex < this.listData.length) {
          this.handleChangeSort(
            this.listData[rowIndex].id, this.listData[rowIndex].sortBy,
            this.listData[nextIndex].id, this.listData[nextIndex].sortBy
          )
        }
      }
    },
    handleChangeSort(id1, sortBy1, id2, sortBy2) {
      changeBaseSort(this.url, { id1: id1, sortBy1: sortBy1, id2: id2, sortBy2: sortBy2 }).then(res => {
        this.fetchData()
        this.handleGetParentOptions()
      })
    },
    fetchData(page, size) {
      if (this.treeTable) {
        getBaseList(this.url, {}).then(response => {
          this.listData = response.data
        }).catch(() => {
        })
      } else {
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
        localStorage.setItem(this.url + '_listQuery', JSON.stringify(this.listQuery))
        localStorage.setItem(this.url + '_limitQuery', JSON.stringify(this.limitQuery))
        getBaseList(this.url, request).then(response => {
          const { content, totalElements, number, size } = response.data || { content: [], totalElements: 0 }
          this.listData = content
          this.total = totalElements
          if (this.spanColumn) {
            const spanArr = []
            let sid = -1
            this.listData.forEach(e => {
              if (e[this.spanColumn] !== sid) {
                spanArr.push(e.row)
                sid = e[this.spanColumn]
              } else {
                spanArr.push(0)
              }
            })
            this.spanArr = spanArr
          }
          this.limitQuery.page = number + 1
          this.limitQuery.size = size
        }).catch(err => {
        })
      }
    },
    handleDetail(row, column, event) {
      if (column.property === 'actions') {
        return
      }
      this.$nextTick(() => {
        this.$refs[this.url + '_DataForm'].clearValidate()
      })
      this.drawerStatus = 1
      this.temp = Object.assign(row)
      this.drawerVisible = true
    },
    handleRow(row, column, event) {
    },
    handleEdit(index, row) {
      if (this.editPage) {
        this.$router.push({ path: this.$route.path + '/edit?id=' + row.id })
      } else {
        const self = this
        getBaseDetail(self.url, row.id).then(res => {
          self.temp = Object.assign(res.data)
          self.tempBefore = Object.assign(res.data)
          self.$nextTick(() => {
            self.$refs[self.url + '_DataForm'].clearValidate()
          })
          self.drawerStatus = 2
          self.drawerVisible = true
        })
      }
    },
    handleUpdate() {
      this.$refs[this.url + '_DataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          editBase(this.url, tempData).then(() => {
            this.fetchData(this.limitQuery.page)
            this.handleGetParentOptions()
            this.drawerVisible = false
            this.$notify.success('修改成功!')
          })
        }
      })
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
      console.log('=========', this.temp)
      this.treeTable && this.$set(this.temp, 'parentId', parentId)
    },
    handleAdd(index = 0, row = { id: undefined }) {
      if (this.editPage) {
        this.$router.push({ path: this.$route.path + '/add' })
      } else {
        const self = this
        self.restTemp(row.id)
        self.$nextTick(() => {
          self.$refs[self.url + '_DataForm'].clearValidate()
        })
        self.drawerStatus = 3
        self.drawerVisible = true
      }
    },
    handleSave() {
      this.addLoading = true
      this.$refs[this.url + '_DataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          addBase(this.url, tempData).then(() => {
            this.fetchData(this.limitQuery.page)
            this.handleGetParentOptions()
            this.drawerVisible = false
            this.$notify.success('创建成功!')
            this.addLoading = false
          }).catch(() => {
            this.addLoading = false
          })
        } else {
          this.addLoading = false
        }
      })
    },
    handleDelete(index, row) {
      const self = this
      deleteBase(self.url, row.id).then(() => {
        self.$notify.success('删除成功!')
        self.fetchData(self.limitQuery.page)
        self.handleGetParentOptions()
      })
    },
    handleCloseDrawer() {
      if (this.drawerStatus === 2) {
        if (this.temp !== this.tempBefore) {

        } else {
          this.drawerVisible = false
        }
      } else {
        this.drawerVisible = false
      }
    },
    handleTreeNodeClick(val, check) {
      this.temp.permissions = check.checkedNodes
    },
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.spanColumn && this.spanColumns[columnIndex]) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0

        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    handleGetParentOptions() {
      this.treeTable && getBaseOptions(this.url, {}).then(res => {
        this.parentOptions = res.data
      })
    },
    columnValChange(val, index, column) {
      this.$set(this.temp, column, val)
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-card__header {
  background-color: #f8f8f8;
  padding: 3px !important;
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
