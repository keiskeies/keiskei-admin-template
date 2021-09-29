<template>
  <div class="base-table">
    <el-table
      :loading="listLoading"
      class="base-table-content"
      :data="listData"
      element-loading-text="加载中"
      border
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
          <slot v-if="column.type === 'SORT'">
            <el-button class="el-icon-top" @click="changeDataSort(scope.$index,-1)" />
            <el-button class="el-icon-bottom" @click="changeDataSort(scope.$index,1)" />
          </slot>
          <!--            图片-->
          <slot v-else-if="column.type === 'IMAGE'">
            <a v-if="!scope.row[column.key]">暂无图片</a>
            <img
              v-else
              :src="$media + scope.row[column.key] +'?x-oss-process=image/resize,h_30'"
              alt=""
              @click="selectImg(scope.row[column.key],column.type)"
            >
          </slot>
          <!--            视频-->
          <slot v-else-if="column.type === 'VIDEO'">
            <a v-if="!scope.row[column.key]">暂无视频</a>
            <img
              v-else
              alt=""
              :src="$media + scope.row[column.key] + '?x-oss-process=video/snapshot,t_1000,h_30,m_fast,f_jpg'"
              @click="selectImg(scope.row[column.key],column.type)"
            >
          </slot>
          <!--            树形单选-->
          <slot v-else-if="column.type === 'TREE_SELECT'">
            <!--              {{ (scope.row[column.key] || {name: ''}).name }}-->
            <!--              <el-tagInfo v-for="item in scope.row[column.key]" :key="item.id">{{item.name}}</el-tagInfo>-->
            <el-cascader
              v-model="(scope.row[column.key]||{id: undefined}).id"
              :options="options[column.optionKey]"
              class="form-item"
              :props="{value: 'id', label: 'name', leaf: 'name', emitPath: false, checkStrictly : true}"
              disabled
            />
          </slot>
          <!--            树形多选-->
          <slot v-else-if="column.type === 'TREE_MULTI_SELECT'">
            <!--              {{ (scope.row[column.key] || {name: ''}).name }}-->
            <!--              <el-tagInfo v-for="item in scope.row[column.key]" :key="item.id">{{item.name}}</el-tagInfo>-->
            <el-cascader
              v-model="(scope.row[column.key]||{id: undefined}).id"
              :options="options[column.optionKey]"
              class="form-item"
              :props="{value: 'id', label: 'name', leaf: 'name', emitPath: false, multiple: true, checkStrictly : true}"
              disabled
            />
          </slot>
          <!--            多选-->
          <slot v-else-if="column.type === 'MULTI_SELECT'">
            {{ (scope.row[column.key] || []).map(e => e.name).join(',') }}
          </slot>
          <!--            单选-->
          <slot v-else-if="column.type === 'DICTIONARY'">
            <el-tag
              v-for="(item, index) in options[column.optionKey]"
              v-if="item.id === scope.row[column.key]"
              :key="index"
              :type="item.type"
              :effect="item.effect"
            >{{ scope.row[column.key] }}
            </el-tag>
          </slot>
          <!--            文章-->
          <slot
            v-else-if="column.type === 'LONG_WORD' || column.type === 'LONG_TEXT' || column.type === 'TO_LONG_TEXT'"
          >
            <div v-html="scope.row[column.key]" />
          </slot>
          <!--            状态-->
          <slot v-else-if="column.type === 'STATUS'">
            <el-tag v-if="scope.row[column.key]" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </slot>
          <!--            其他-->
          <slot v-else :name="column.key" :index="scope.$index" :row="scope.row" :column="column">
            <i v-if="column.type === 'DATE_TIME' && scope.row[column.key]" class="el-icon-time" />
            {{
              scope.row[column.key]
                ?
                  (format != null && typeof (format[column.key]) != 'undefined' ? format[column.key](scope.row, scope.$index) : scope.row[column.key])
                :
                  ''
            }}
          </slot>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showActions"
        prop="actions"
        label="操作"
        header-align="center"
        align="center"
        :fixed="$store.state.app.device !== 'mobile' ? 'right' : undefined"
        :min-width="treeTable ? 260 : 180"
      >
        <template slot-scope="scope" class="actions">
          <el-button v-if="treeTable" v-waves :v-permission="[permission+':add']" type="primary" plain @click="handleAdd(scope.$index, scope.row)">新建子类
          </el-button>
          <el-button v-waves :v-permission="[permission+':edit']" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-popconfirm :v-permission="[permission+':delete']" title="是否删除这条数据？" icon="el-icon-info" icon-color="red" confirm-button-type="danger" @onConfirm="handleDelete(scope.$index, scope.row)">
            <el-button slot="reference" v-waves type="danger" style="margin-left: 10px">删除</el-button>
          </el-popconfirm>
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
</template>
<script>
export default {
  name: 'BaseTable',
  props: {
    url: { type: String, default: '' },
    listLoading: { type: Boolean, default: false },
    showActions: { type: Boolean, default: true }
  },
  data() {
    return {
      listData: []
    }
  }
}
</script>
