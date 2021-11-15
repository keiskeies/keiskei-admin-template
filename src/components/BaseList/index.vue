<template>
  <div class="base-list page-component__scroll el-scrollbar">
    <el-card class="box-card" shadow="hover" :body-style="{padding: 0}">
      <div slot="header" class="clearfix filter-container">
        <el-row v-if="listQuery && listQuery.length > 0" :gutter="5">
          <template v-for="(column, index) in columns" v-if="column.queryable && conditionRelOptions[column.type]">
            <el-col
              :xs="{span: (listQuery[index].condition === 'BT' ? 4 : ((column.type === 'ENABLE' || column.type === 'BOOLEAN' || column.type === 'DICTIONARY') ? 1 : 2)) * 6}"
              :sm="{span: (listQuery[index].condition === 'BT' ? 4 : ((column.type === 'ENABLE' || column.type === 'BOOLEAN' || column.type === 'DICTIONARY') ? 1 : 2)) * 4}"
              :md="{span: (listQuery[index].condition === 'BT' ? 4 : ((column.type === 'ENABLE' || column.type === 'BOOLEAN' || column.type === 'DICTIONARY') ? 1 : 2)) * 3}"
              :lg="{span: (listQuery[index].condition === 'BT' ? 4 : ((column.type === 'ENABLE' || column.type === 'BOOLEAN' || column.type === 'DICTIONARY') ? 1 : 2)) * 2}"
              :xl="{span: (listQuery[index].condition === 'BT' ? 4 : ((column.type === 'ENABLE' || column.type === 'BOOLEAN' || column.type === 'DICTIONARY') ? 1 : 2)) * 2}"
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
              <!--            DICTIONARY-->
              <el-select
                v-else-if="column.type && column.type === 'DICTIONARY'"
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
                v-model="listQuery[index].value[0]"
                clearable
                class="filter-item"
                :placeholder="column.label"
                @change="fetchData(1)"
              >
                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <!--            BOOLEAN-->
              <el-select
                v-else-if="column.type && column.type === 'BOOLEAN'"
                v-model="listQuery[index].value[0]"
                clearable
                class="filter-item"
                :placeholder="column.label"
                @change="fetchData(1)"
              >
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
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
              <!--            OTHER-->
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
                            v-for="(item, index_) in conditionRelOptions[column.type || 'WORD']"
                            :key="index_"
                            :label="column.label + conditionOptions[item]"
                            :value="item"
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
                            v-for="(item, index_) in conditionRelOptions[column.type || 'WORD']"
                            :key="index_"
                            :label="column.label + conditionOptions[item]"
                            :value="item"
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
          v-loading="tableLoading"
          class="base-table-content"
          element-loading-text="拼命加载中"
          :data="listData"
          border
          fit
          highlight-current-row
          stripe
          row-key="id"
          :default-expand-all="defaultExpandAll"
          :indent="32"
          @sort-change="sortChanged"
          @selection-change="handleSelectionChange"
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
                <el-button class="el-icon-top" @click="changeDataSort(scope.$index, scope.row,-1)" />
                <el-button class="el-icon-bottom" @click="changeDataSort(scope.$index, scope.row, 1)" />
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
                <el-link v-if="scope.row[column.key]" :href="scope.row[column.key]" target="_blank" rel="noopener noreferrer">{{ scope.row[column.key] }}</el-link>
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
                {{ scope.row[column.key] ?
                  (options[column.optionKey]||[]).filter(e => scope.row[column.key].includes(e.id)).map(e => e[column.optionKeyLabel || 'name']).join(',')
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
              <!--            文章-->
              <template v-else-if="column.type && column.type === 'LONG_TEXT' || column.type === 'HTML'">
                <div v-html="scope.row[column.key]" />
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
              <template v-else-if="column.type && (column.type.indexOf('DATE') !== -1 || column.type.indexOf('TIME') !== -1)">
                <i v-if="scope.row[column.key]" class="el-icon-time" />
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
            <template slot-scope="scope" class="actions">
              <el-popover placement="right">
                <template>
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
                    @confirm="handleDelete(scope.$index, scope.row)"
                  >
                    <el-button slot="reference" v-waves type="danger" style="margin-left: 10px">删除</el-button>
                  </el-popconfirm>
                  <slot name="raw_actions" :row="scope.row" />
                </template>
                <i slot="reference" class="el-icon-more" />
              </el-popover>
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

      <div v-if="!treeTable" v-show="total>0" style="height: 55px;width: 100%;display: block" />
      <el-card class="box-card" shadow="hover" :body-style="{padding: 0, margin: 0}" style="position: fixed; bottom: 20px; right: 46px; z-index: 5;">
        <pagination
          v-if="!treeTable"
          v-show="total>0"
          :total="total"
          :page="limitQuery.page"
          :limit="limitQuery.size"
          @pagination="fetchData"
        />
      </el-card>
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
      :size="$store.state.app.device !== 'mobile' ? '65%' : '100%'"
    >
      <el-form
        :ref="url + '_DataForm'"
        v-loading="drawerLoading"
        :rules="rules[drawerOptions[drawerStatus].value]"
        :model="temp"
        label-width="auto"
        label-suffix=": "
        style="margin: 15px;"
      >
        <el-form-item v-if="treeTable" label="上级" prop="parentId">
          <el-select v-model="temp.parentId" class="form-item">
            <el-option v-for="(item, index) in parentOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-for="(column, index) in columns" v-if="column.edit" :key="index" :label="column.label" :prop="column.key">
          <!--     图片     -->
          <template v-if="column.type === 'IMAGE'">
            <upload-image
              :ref="url + '_UploadImage_' + column.key"
              class="form-item"
              :file-url="temp[column.key]"
              :column-name="column.key"
              @columnValChange="columnValChange"
            />
          </template>
          <!--     视频     -->
          <template v-else-if="column.type === 'VIDEO'">
            <upload-video
              :ref="url + '_UploadVideo_' + column.key"
              class="form-item"
              :file-url="temp[column.key]"
              :column-name="column.key"
              @columnValChange="columnValChange"
            />
          </template>
          <!--     开关     -->
          <template v-else-if="column.type === 'ENABLE'">
            <el-switch
              v-model="temp[column.key]"
              active-color="#13ce66"
              inactive-color="#ff0000"
              active-text="启用"
              inactive-text="禁用"
            />
          </template>
          <!--     是否     -->
          <template v-else-if="column.type === 'BOOLEAN'">
            <el-switch
              v-model="temp[column.key]"
              active-color="#13ce66"
              inactive-color="#ff0000"
              active-text="是"
              inactive-text="否"
            />
          </template>
          <!--     数字     -->
          <template v-else-if="column.type === 'NUMBER'">
            <el-input-number
              v-model="temp[column.key]"
              class="form-item"
            />
          </template>
          <!--     多选     -->
          <template v-else-if="column.type === 'MULTI_SELECT'">
            <el-select
              v-model="temp[column.key]"
              class="form-item"
              value-key="id"
              multiple
              clearable
            >
              <el-option
                v-for="(item, index_) in options[column.optionKey]"
                :key="index_"
                :label="item[column.optionKeyLabel || 'name']"
                :value="item"
              />
            </el-select>
          </template>
          <!--     关联单选     -->
          <template v-else-if="column.type === 'REL_SELECT'">
            <el-select
              v-model="temp[column.key]"
              class="form-item"
              value-key="id"
              clearable
            >
              <el-option
                v-for="(item, index_) in options[column.optionKey]"
                :key="index_"
                :label="item[column.optionKeyLabel || 'name']"
                :value="item"
              />
            </el-select>
          </template>
          <!--    单选      -->
          <template v-else-if="column.type === 'DICTIONARY'">
            <el-select
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
          </template>
          <!--     树形多选       -->
          <template v-else-if="column.type === 'TREE_MULTI_SELECT' && drawerVisible">
            <tree-multi-select
              :ref="url + '_TreeForm_' + column.key"
              :column-name="column.key"
              :tree-data="options[column.optionKey]"
              :show-checkbox="drawerStatus > 1"
              :default-checked-keys="(temp[column.key]||[]).map(e => e.id)"
              @columnValChange="columnValChange"
            />
          </template>
          <!--          富文本-->
          <template v-else-if="column.type === 'HTML' || column.type === 'LONG_TEXT'">
            <tinymce
              :ref="url + '_Html_' + column.key"
              :value="temp[column.key]"
              :column-name="column.key"
              @columnValChange="columnValChange"
            />
          </template>
          <!--          LONG_WORD-->
          <template v-else-if="column.type === 'LONG_WORD'">
            <el-input
              v-model="temp[column.key]"
              type="textarea"
              :rows="5"
              :placeholder="'请输入' + column.label"
            />
          </template>
          <!--     树形单选       -->
          <template v-else-if="column.type === 'TREE_SELECT'">
            <tree-single-select
              :options="options[column.optionKey]"
              :check-node="temp[column.key]"
              :column-name="column.key"
              @columnValChange="columnValChange"
            />
          </template>
          <!--            时间日期-->
          <template v-else-if="column.type === 'DATE_TIME'">
            <el-date-picker
              v-model="temp[column.key]"
              clearable
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              class="form-item"
            />
          </template>
          <!--            时间日期-->
          <template v-else-if="column.type === 'DATE'">
            <el-date-picker
              v-model="temp[column.key]"
              clearable
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              class="form-item"
            />
          </template>
          <!--            时间日期-->
          <template v-else-if="column.type === 'TIME'">
            <el-time-picker
              v-model="temp[column.key]"
              clearable
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              type="time"
              class="form-item"
            />
          </template>
          <!--          标签-->
          <template v-else-if="column.type === 'TAGS'">
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
              class="form-item"
              @keyup.enter.native="handleInputConfirm(column.key)"
            />
            <el-button v-else class="button-new-tag" @click="showInput(column.key)">+ 添加</el-button>
          </template>
          <!--          Object-->
          <template v-else-if="column.type === 'OBJECT'">
            <vue-json-editor
              v-model="temp[column.key]"
              :mode="'code'"
              lang="zh"
            />
          </template>
          <!--          Array-->
          <template v-else-if="column.type === 'ARRAY'">
            <template v-for="arrayItem in temp[column.key]">
              <vue-json-editor
                :value="arrayItem"
                :mode="'code'"
                lang="zh"
              />
            </template>
          </template>
          <!--    普通文本      -->
          <template v-else>
            <el-input v-model="temp[column.key]" clearable :autofocus="column.autofocus" />
          </template>
        </el-form-item>
        <el-form-item>
          <el-button v-waves @click="drawerVisible = false">取消</el-button>
          <el-button
            v-if="drawerStatus === 3"
            v-waves
            v-permission="[permission+':add']"
            type="primary"
            :loading="addOrEditLoading"
            @click="handleSave()"
          >保存
          </el-button>
          <el-button
            v-if="drawerStatus === 2"
            v-waves
            v-permission="[permission+':edit']"
            type="primary"
            :loading="addOrEditLoading"
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
      center
    >
      <img :src="fileUrl" width="100%" alt="">
    </el-dialog>
    <el-dialog
      center
      :visible.sync="dialogVisibleVideo"
      :width="$store.state.app.device === 'mobile' ? '100%' : '60%'"
      destroy-on-close
    >
      <video preload="auto" :src="fileUrl" width="100%" controls="controls" />
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
import Tinymce from '@/components/Tinymce'
import TreeMultiSelect from '@/components/TreeMultiSelect'
import TreeSingleSelect from '@/components/TreeSingleSelect'
import VueJsonEditor from 'vue-json-editor'

export default {
  name: 'BaseList',
  components: {
    Pagination,
    UploadImage,
    UploadVideo,
    Tinymce,
    TreeMultiSelect,
    TreeSingleSelect,
    VueJsonEditor
  },
  directives: { permission, waves },
  props: {
    idColumn: { type: String, default: 'id' },
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
      listData: [],
      listQuery: [],
      temp: {},
      dialogVisibleImg: false,
      dialogVisibleVideo: false,
      inputVisible: {},
      inputValue: '',
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
      conditionRelOptions: {
        DICTIONARY: ['EQ', 'IN'],
        TREE_SELECT: ['EQ', 'IN'],
        TREE_MULTI_SELECT: ['IN'],
        MULTI_SELECT: ['IN'],
        ENABLE: ['EQ'],
        BOOLEAN: ['EQ'],
        NUMBER: ['EQ', 'NE', 'BT', 'GE', 'GT', 'LE', 'LT'],
        TAGS: ['IN'],
        WORD: ['LIKE', 'EQ', 'LL', 'LR'],
        TIME: ['BT'],
        DATE: ['BT'],
        DATE_TIME: ['BT']
      },
      sortableOptions: ['TIME', 'DATE', 'DATE_TIME', 'NUMBER', 'BOOLEAN', 'ENABLE'],
      conditionOptions: {
        EQ: '等于',
        NE: '不等',
        GE: '大/等',
        GT: '大于',
        LE: '小/等',
        LT: '小于',
        BT: '区间',
        LIKE: '包含',
        LL: '前缀',
        LR: '后缀',
        IN: '属于'
      }
    }
  },
  watch: {
    columns: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        const listQuery = []
        this.columns.forEach(e => {
          let condition = 'EQ'
          if (e.type) {
            const conditions = this.conditionRelOptions[e.type]
            if (conditions) {
              condition = conditions[0]
            }
          }
          listQuery.push({ column: e.key, condition: condition, value: [undefined] })
        })
        const routerQuery = this.$route.query
        for (const key in routerQuery) {
          listQuery.push({ column: key, condition: 'EQ', value: [routerQuery[key]] })
        }
        this.listQuery = listQuery
        this.fetchData()
      }
    },
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
          this.$set(this.temp, key, [undefined])
        }
        this.temp[key].push(this.inputValue)
      }
      this.$set(this.inputVisible, key, false)
      this.inputValue = ''
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
        this.handleGetParentOptions()
      })
    },
    fetchData(page, size) {
      this.tableLoading = true
      if (this.treeTable) {
        getBaseList(this.url, {}).then(response => {
          this.listData = response.data
          this.$nextTick(() => {
            this.tableLoading = false
          })
        }).catch(() => {
          this.tableLoading = false
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
        getBaseList(this.url, request).then(response => {
          const { content, totalElements, number, size } = response.data || { content: [], totalElements: 0 }
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
      }
    },
    handleEdit(index, row) {
      if (this.editPage) {
        this.$router.push({ path: this.$route.path + '/edit?id=' + row[this.idColumn] })
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
            self.$refs[self.url + '_DataForm'].clearValidate()
            self.wrapperClosable = true
          })
        }).catch(() => {
          self.drawerLoading = false
        })
      }
    },
    handleUpdate() {
      this.addOrEditLoading = true
      this.$refs[this.url + '_DataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          editBase(this.url, tempData).then(() => {
            this.fetchData(this.limitQuery.page)
            this.handleGetParentOptions()
            this.drawerVisible = false
            this.$notify.success('修改成功!')
            this.addOrEditLoading = false
          }).catch(() => {
            this.addOrEditLoading = false
          })
        } else {
          this.addOrEditLoading = false
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
      const routerQuery = this.$route.query
      for (const key in routerQuery) {
        this.$set(this.temp, key, routerQuery[key])
      }
      this.treeTable && this.$set(this.temp, 'parentId', parentId)
    },
    handleAdd(index = 0, row = { id: undefined }) {
      if (this.editPage) {
        this.$router.push({ path: this.$route.path + '/edit' })
      } else {
        const self = this
        self.restTemp(row[this.idColumn])
        self.$nextTick(() => {
          self.$refs[self.url + '_DataForm'].clearValidate()
          self.wrapperClosable = true
        })
        self.drawerStatus = 3
        self.drawerVisible = true
      }
    },
    handleSave() {
      this.addOrEditLoading = true
      this.$refs[this.url + '_DataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          addBase(this.url, tempData).then(() => {
            this.fetchData(this.limitQuery.page)
            this.handleGetParentOptions()
            this.drawerVisible = false
            this.$notify.success('创建成功!')
            this.addOrEditLoading = false
          }).catch(() => {
            this.addOrEditLoading = false
          })
        } else {
          this.addOrEditLoading = false
        }
      })
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
