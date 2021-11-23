<template>
  <div class="app-container">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <el-form ref="form_project" label-width="100px" label-suffix=": " :rule="projectRules" inline>
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="project.name" clearable />
          </el-form-item>
          <el-form-item label="项目注释" prop="comment">
            <el-input v-model="project.comment" clearable />
          </el-form-item>
          <el-form-item label="版本号" prop="version">
            <el-input v-model="project.version" clearable />
          </el-form-item>
          <el-form-item label="浏览器图标" prop="favicon">
            <el-input v-model="project.favicon" clearable />
          </el-form-item>
          <el-form-item label="LOGO" prop="logo">
            <el-input v-model="project.logo" clearable />
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="project.author" clearable />
          </el-form-item>
          <el-form-item label="文件管理" prop="fileJar">
            <el-select v-model="project.fileJar" clearable>
              <el-option value="LOCAL" label="本地服务器存储" />
              <el-option value="ALI_OSS" label="阿里OSS" />
              <el-option value="JD_OSS" label="京东OSS" />
              <el-option value="MINIO" label="MINIO" />
            </el-select>
          </el-form-item>
          <el-form-item label="日志存储" prop="sqlLog">
            <el-select v-model="project.sqlLog" clearable>
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
          </el-form-item>
          <el-form-item label="工作流" prop="workflow">
            <el-select v-model="project.workflow" clearable>
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!--模块-->
      <el-tabs v-model="moduleSelect" type="card" addable :closable="project.modules && project.modules.length && project.modules.length > 1" @tab-add="handleModuleAdd" @tab-remove="handleModuleRemove">
        <el-tab-pane v-for="(module, moduleIndex) in project.modules" :key="moduleIndex" :ref="'tab_module_' + moduleIndex" :label="module.comment" :name="moduleIndex + ''">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <el-form :ref="'form_module_' + moduleIndex" :model="module" label-width="100px" label-suffix=": " :rule="moduleRules" inline>
                <el-form-item label="模块名称" prop="name">
                  <el-input v-model="module.name" clearable />
                </el-form-item>
                <el-form-item label="模块注释" prop="comment">
                  <el-input v-model="module.comment" clearable />
                </el-form-item>
                <el-form-item label="模块包名" prop="packageName">
                  <el-input v-model="module.packageName" clearable />
                </el-form-item>
                <el-form-item label="模块路径" prop="path">
                  <el-input v-model="module.path" clearable />
                </el-form-item>
              </el-form>
            </div>
            <el-tabs ref="module-table" v-model="tableSelect[moduleIndex]" tab-position="left" addable :closable="module.tables.length > 1" @tab-add="handleTableAdd(moduleIndex)" @tab-remove="handleTableRemove">
              <el-tab-pane v-for="(table, tableIndex) in module.tables" :key="tableIndex" :ref="'tab_module_' + moduleIndex + '_table_' + tableIndex" :label="table.comment" :name="moduleIndex + '_' + tableIndex">
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="clearfix">
                    <el-form :ref="'form_module_' + moduleIndex + '_table_' + tableIndex" :model="table" label-width="auto" label-suffix=": " :rule="tableRules" inline>
                      <el-form-item label="表名称" prop="name">
                        <el-input v-model="table.name" clearable />
                      </el-form-item>
                      <el-form-item label="表注释" prop="comment">
                        <el-input v-model="table.comment" clearable />
                      </el-form-item>
                      <el-form-item label="表类型" prop="type">
                        <el-select v-model="table.type" clearable>
                          <el-option value="LIST" label="列表结构" />
                          <el-option value="TREE" label="树形结构" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="创建接口" prop="buildController">
                        <el-switch v-model="table.buildController" active-color="#13ce66" inactive-color="#ff0000" />
                      </el-form-item>
                    </el-form>
                  </div>

                  <el-table :ref="'table_module_' + moduleIndex + '_table_' + tableIndex" border fit highlight-current-row stripe :data="table.fields">
                    <!--                    -->
                    <el-table-column label="字段名称" header-align="center" align="left" prop="name" fixed width="150">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.name" clearable /></slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column label="字段注释" header-align="center" align="left" prop="comment" fixed width="150">
                      <template slot-scope="scope">
                        <slot>
                          <el-tooltip class="item" effect="light" :content="scope.row.comment" placement="right">
                            <el-input v-model="scope.row.comment" clearable />
                          </el-tooltip>
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column label="字段类型" header-align="center" prop="type" width="120">
                      <template slot-scope="scope">
                        <slot>
                          <el-select
                            v-model="scope.row.type"
                            :filterable="fieldTypeOptions.length > 5"
                            @change="handleFieldTypeChange(moduleIndex, tableIndex, scope.$index, scope.row.type)"
                          >
                            <el-option v-for="item in fieldTypeOptions" :key="item.key" :value="item.key" :label="item.value" />
                          </el-select>
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" align="left" prop="type" width="150">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="字段类型需要选择关联ID" placement="top">
                          <span>字段关系</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-select v-model="scope.row.relation" clearable :disabled="scope.row.type !== 'MIDDLE_ID'">
                            <el-option v-for="item in fieldRelationOptions" :key="item.key" :value="item.key" :label="item.value" />
                          </el-select>
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" align="left" prop="relationEntity" width="200">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="需要先选择字段关系" placement="top">
                          <span>关联表</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-select v-model="scope.row.relationEntity" clearable :disabled="scope.row.type !== 'MIDDLE_ID'">
                            <el-option v-for="item in module.tables" v-if="item.name !== table.name" :key="item.name" :value="item.name" :label="item.comment || item.name" />
                          </el-select>
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" prop="tooltip" min-width="200">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="可在表头显示如此的小弹窗" placement="top">
                          <span>字段解释</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-tooltip class="item" effect="light" :content="scope.row.tooltip" placement="right">
                            <el-input v-model="scope.row.tooltip" clearable />
                          </el-tooltip>
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" align="center" prop="editAble" width="100">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="是否允许更新数据" placement="top">
                          <span>可编辑</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.editAble" active-color="#13ce66" inactive-color="#ff0000" />
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" align="center" prop="createRequire" width="100">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="新建数据时是否必填" placement="top">
                          <div>新建必填</div>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.createRequire" active-color="#13ce66" inactive-color="#ff0000" />
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" align="center" prop="updateRequire" width="100">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="更新数据时是否必填" placement="top">
                          <span>更新必填</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.updateRequire" active-color="#13ce66" inactive-color="#ff0000" />
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" align="center" prop="queryAble" width="100">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="是否在页面可作为筛选项" placement="top">
                          <span>筛选条件</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.queryAble" active-color="#13ce66" inactive-color="#ff0000" />
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" align="center" prop="directShow" width="100">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="是否在表格中直接展示数据，否则每次需要手动开启(注意表格宽度)" placement="top">
                          <span>直接展示</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.directShow" active-color="#13ce66" inactive-color="#ff0000" />
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" align="center" prop="jsonIgnore" width="100">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="后端将不返回该数据" placement="top">
                          <span>隐藏数据</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.jsonIgnore" active-color="#13ce66" inactive-color="#ff0000" />
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column header-align="center" align="center" prop="sortAble" width="100">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="在表格中是否可排序查询" placement="top">
                          <span>排序查询</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.sortAble" active-color="#13ce66" inactive-color="#ff0000" />
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    -->
                    <el-table-column label="表格宽度" header-align="center" align="left" prop="tableWidth" width="100">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.tableWidth" /></slot>
                      </template>
                    </el-table-column>

                    <!--                    -->
                    <el-table-column header-align="center" prop="validate" width="350">
                      <template slot="header">
                        <el-tooltip class="item" effect="dark" content="输入正则表达式" placement="top">
                          <span>字段校验</span>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-input v-model="scope.row.validate" clearable />
                        </slot>
                      </template>
                    </el-table-column>
                    <!--                    排序表格-->
                    <el-table-column label="排序" fixed="right" width="100" align="center">
                      <el-button-group>
                        <el-button class="el-icon-top" size="mini" circle @click="changeDataSort(moduleIndex, tableIndex, scope.$index,-1)" />
                        <el-button class="el-icon-bottom" size="mini" circle @click="changeDataSort(moduleIndex, tableIndex, scope.$index, 1)" />
                      </el-button-group>
                    </el-table-column>
                    <!--                    枚举表格-->
                    <el-table-column label="枚举" fixed="right" width="50">
                      <template v-if="scope.row.type === 'DICTIONARY'" slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="handleEditFieldEnum(moduleIndex, tableIndex, scope.$index)" />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" width="100">
                      <template slot-scope="scope">
                        <slot>
                          <el-button-group>
                            <el-button v-if="scope.$index === table.fields.length - 1" type="primary" size="mini" icon="el-icon-plus" circle @click="handleFieldAdd(moduleIndex, tableIndex, scope.$index)" />
                            <el-button v-if="scope.$index !== 0" type="info" icon="el-icon-minus" circle @click="handleFieldRemove(moduleIndex, tableIndex, scope.$index)" />
                          </el-button-group>
                        </slot>
                      </template>
                    </el-table-column>

                  </el-table>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-button
      v-if="project.id"
      v-waves
      v-permission="[project+':edit']"
      type="primary"
      :loading="addLoading"
      @click="handleUpdate()"
    >保存
    </el-button>
    <el-button
      v-else
      v-waves
      v-permission="[project+':add']"
      type="primary"
      :loading="addLoading"
      @click="handleSave()"
    >保存
    </el-button>
    <el-dialog
      :title="fieldDialogRow.comment + '-枚举编辑'"
      :visible.sync="enumDialog"
      append-to-body
      destroy-on-close
      :width="$store.state.app.device === 'mobile' ? '100%' : '60%'"
    >
      <el-table :ref="'table_module_' + moduleDialogIndex + '_table_' + tableDialogIndex + '_field_' + fieldDialogIndex" border fit highlight-current-row stripe :data="fieldDialogRow.fieldEnums">
        <el-table-column label="枚举名称" header-align="center" align="center" prop="name">
          <template slot-scope="scopeEnum">
            <slot><el-input v-model="scopeEnum.row.name" clearable /></slot>
          </template>
        </el-table-column>
        <el-table-column label="枚举注释" header-align="center" align="center" prop="comment">
          <template slot-scope="scopeEnum">
            <slot><el-input v-model="scopeEnum.row.comment" clearable /></slot>
          </template>
        </el-table-column>
        <el-table-column label="显示类型" header-align="center" align="center" prop="type">
          <template slot-scope="scopeEnum">
            <slot>
              <el-select v-model="scopeEnum.row.type" clearable>
                <el-option v-for="item in fieldEnumTypeOptions" :key="item.name" :value="item.name" :label="item.comment" />
              </el-select>
            </slot>
          </template>
        </el-table-column>
        <el-table-column label="显示主题" header-align="center" align="center" prop="effect">
          <template slot-scope="scopeEnum">
            <slot>
              <el-select v-model="scopeEnum.row.effect" clearable>
                <el-option v-for="item in fieldEnumEffectOptions" :key="item.name" :value="item.name" :label="item.comment" />
              </el-select>
            </slot>
          </template>
        </el-table-column>
        <el-table-column label="预览展示" header-align="center" align="center" prop="name">
          <template slot-scope="scopeEnum">
            <slot>
              <el-tag :type="scopeEnum.row.type" :effect="scopeEnum.row.effect">{{ scopeEnum.row.comment }}</el-tag>
            </slot>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header">
            <el-button type="primary" icon="el-icon-plus" circle @click="handleFieldEnumAdd(moduleDialogIndex, tableDialogIndex, fieldDialogIndex, 0)" />
          </template>
          <template slot-scope="scopeEnum">
            <slot>
              <el-button type="info" icon="el-icon-minus" circle @click="handleFieldEnumRemove(moduleIndex, tableIndex, scope.$index, scopeEnum.$index)" />
            </slot>
          </template>
        </el-table-column>
        <!--                            影响字段-->
        <el-table-column type="expand" label="影响字段" header-align="center" align="center" prop="fieldEnumAffects">
          <template slot="header">
            <el-tooltip class="item" effect="dark" content="影响表格中的字段值" placement="top">
              <span>影响字段</span>
            </el-tooltip>
          </template>
          <template slot-scope="scopeEnum">
            <slot>
              <el-table border fit highlight-current-row stripe :data="scopeEnum.row.fieldEnumAffects">
                <el-table-column label="字段名称" header-align="center" align="center" prop="name">
                  <template slot="header">
                    <el-tooltip class="item" effect="dark" content="当前表中字段" placement="top">
                      <span>字段名称</span>
                    </el-tooltip>
                  </template>
                  <template slot-scope="enumAffect">
                    <slot>
                      <el-select v-model="enumAffect.row.name" clearable>
                        <el-option v-for="item in table.fields" :key="item.name" :value="item.name" :label="item.comment" />
                      </el-select>
                    </slot>
                  </template>
                </el-table-column>
                <el-table-column label="设定值" header-align="center" align="center" prop="value">
                  <template slot="header">
                    <el-tooltip class="item" effect="dark" content="为该字段设置默认值" placement="top">
                      <span>设定值</span>
                    </el-tooltip>
                  </template>
                  <template slot-scope="enumAffect">
                    <slot><el-input v-model="enumAffect.row.value" clearable /></slot>
                  </template>
                </el-table-column>
                <el-table-column label="清除字段" header-align="center" align="center" prop="cleanValue">
                  <template slot="header">
                    <el-tooltip class="item" effect="dark" content="清空该字段值" placement="top">
                      <span>清除字段</span>
                    </el-tooltip>
                  </template>
                  <template slot-scope="enumAffect">
                    <slot>
                      <el-switch v-model="enumAffect.row.cleanValue" active-color="#13ce66" inactive-color="#ff0000" />
                    </slot>
                  </template>
                </el-table-column>
                <el-table-column label="禁止编辑" header-align="center" align="center" prop="disableEdit">
                  <template slot="header">
                    <el-tooltip class="item" effect="dark" content="将该字段输入框disable" placement="top">
                      <span>禁止编辑</span>
                    </el-tooltip>
                  </template>
                  <template slot-scope="enumAffect">
                    <slot>
                      <el-switch v-model="enumAffect.row.disableEdit" active-color="#13ce66" inactive-color="#ff0000" />
                    </slot>
                  </template>
                </el-table-column>

                <el-table-column align="center">
                  <template slot="header">
                    <el-button type="primary" icon="el-icon-plus" circle @click="handleFieldEnumAffectAdd(moduleDialogIndex, tableDialogIndex, fieldDialogIndex, scopeEnum.$index, 0)" />
                  </template>
                  <template slot-scope="enumAffect">
                    <slot>
                      <el-button type="info" icon="el-icon-minus" circle @click="handleFieldEnumAffectRemove(moduleDialogIndex, tableDialogIndex, fieldDialogIndex, enumAffect.$index)" />
                    </slot>
                  </template>
                </el-table-column>
              </el-table>
            </slot>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getBaseDetail, addBase, editBase } from '@/api/common'
import permission from '@/directive/permission' // 权限判断指令
import waves from '@/directive/waves' // waves directive
export default {
  name: 'Project',
  directives: { permission, waves },
  props: {

  },
  data() {
    return {
      project: { modules: [{ tables: [{ fields: [{}] }] }] },
      projectRules: [],
      moduleRules: [],
      tableRules: [],
      fieldRules: [],
      moduleSelect: '0',
      addLoading: false,
      url: '/generate/project',
      fieldTypeOptions: [
        { key: 'NUMBER', value: '整数' },
        { key: 'DECIMAL', value: '小数' },
        { key: 'MONEY', value: '金额' },
        { key: 'DATE', value: '日期' },
        { key: 'TIME', value: '时间' },
        { key: 'DATE_TIME', value: '日期时间' },
        { key: 'WORD', value: '文字' },
        { key: 'LONG_WORD', value: '段落' },
        { key: 'LONG_TEXT', value: '文章' },
        { key: 'HTML', value: '大型文章' },
        { key: 'MIDDLE_ID', value: '关联ID' },
        { key: 'IMAGE', value: '图片' },
        { key: 'VIDEO', value: '视频' },
        { key: 'FILE', value: '文件' },
        { key: 'VISIT_TIMES', value: '访问次数' },
        { key: 'ENABLE', value: '启/禁用' },
        { key: 'SORT', value: '排序' },
        { key: 'DICTIONARY', value: '枚举' },
        { key: 'TAG', value: '标签' }
      ],
      fieldRelationOptions: [
        { key: 'ONE_TO_ONE', value: '一对一' },
        { key: 'ONE_TO_MANY', value: '一对多' },
        { key: 'MANY_TO_MANY', value: '多对多' },
        { key: 'MANY_TO_ONE', value: '多对一' }
      ],
      fieldEnumTypeOptions: [
        { name: 'none', comment: '默认' },
        { name: 'success', comment: '成功' },
        { name: 'info', comment: '信息' },
        { name: 'warning', comment: '警告' },
        { name: 'danger', comment: '危险' }
      ],
      fieldEnumEffectOptions: [
        { name: 'light', comment: '默认' },
        { name: 'dark', comment: '填充' },
        { name: 'plain', comment: '镂空' }
      ],
      tableSelect: ['0_0'],
      moduleDialogIndex: 0,
      tableDialogIndex: 0,
      fieldDialogIndex: 0,
      fieldDialogRow: {},
      enumDialog: false
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      getBaseDetail(this.url, id).then(res => {
        this.project = Object.assign(res.data)
        console.log(JSON.stringify(this.project))
      })
    }
  },
  methods: {
    handleEditFieldEnum(moduleIndex, tableIndex, fieldIndex) {
      const self = this
      self.$nextTick(() => {
        self.moduleDialogIndex = moduleIndex
        self.tableDialogIndex = tableIndex
        self.fieldDialogIndex = fieldIndex
        self.fieldDialogRow = self.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex]
        self.enumDialog = true
      })
    },
    handleModuleAdd() {
      this.tableSelect.push(this.project.modules.length || 0 + '_0')
      this.project.modules.push({
        name: 'module' + this.project.modules.length || 0,
        comment: '______',
        tables: [
          {
            name: 'table0',
            comment: '______',
            fields: [
              { name: 'field0' }
            ]
          }
        ]
      })
    },
    handleModuleRemove(targetName) {
      const modules = Object.assign(this.project.modules)
      const index = parseInt(targetName)
      this.$nextTick(() => {
        modules.splice(index, 1)
        this.project.modules = modules
      })
    },
    handleTableAdd(moduleIndex) {
      this.project.modules[moduleIndex].tables.push({
        name: 'table' + this.project.modules[moduleIndex].tables.length || 0,
        comment: '______',
        fields: [
          { name: 'field1' }
        ]
      })
    },
    handleTableRemove(targetName) {
      const indexes = targetName.split('_')
      const moduleIndex = parseInt(indexes[0])
      const tableIndex = parseInt(indexes[1])
      this.project.modules[moduleIndex].tables.splice(tableIndex, 1)
    },
    handleFieldAdd(moduleIndex, tableIndex, fieldIndex) {
      this.project.modules[moduleIndex].tables[tableIndex].fields.push(
        { name: '', comment: '', tooltip: '', type: '', createRequire: true, updateRequire: true, manyToMany: '',
          relation: undefined, relationEntity: '', queryAble: true, jsonIgnore: false, directShow: true,
          editAble: true, tableWidth: 200, dictionaryShow: false, fieldEnums: undefined }
      )
    },
    handleFieldRemove(moduleIndex, tableIndex, fieldIndex) {
      this.project.modules[moduleIndex].tables[tableIndex].fields.splice(fieldIndex, 1)
    },
    handleFieldTypeChange(moduleIndex, tableIndex, fieldIndex, val) {
      if (val && val === 'DICTIONARY') {
        this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].fieldEnums = [
          { name: '', comment: '', type: 'info', effect: 'dark', fieldEnumAffects: [] }
        ]
      } else {
        this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].fieldEnums = undefined
      }
      this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].relation = undefined
      this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].relationEntity = undefined
    },
    handleFieldEnumAdd(moduleIndex, tableIndex, fieldIndex, fieldEnumIndex) {
      this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].fieldEnums.push(
        { name: '', comment: '', type: 'info', effect: 'dark', fieldEnumAffects: [] }
      )
    },
    handleFieldEnumRemove(moduleIndex, tableIndex, fieldIndex, fieldEnumIndex) {
      this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].fieldEnums.splice(fieldEnumIndex, 1)
    },
    handleFieldEnumAffectAdd(moduleIndex, tableIndex, fieldIndex, fieldEnumIndex, enumAffectIndex) {
      this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].fieldEnums[fieldEnumIndex].fieldEnumAffects.push(
        { name: '', cleanValue: false, value: 'info', disableEdit: false }
      )
    },
    handleFieldEnumAffectRemove(moduleIndex, tableIndex, fieldIndex, fieldEnumIndex, enumAffectIndex) {
      this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].fieldEnums[fieldEnumIndex].fieldEnumAffects.splice(enumAffectIndex, 1)
    },
    changeDataSort(moduleIndex, tableIndex, fieldIndex, operate) {
      operate = Number(operate)
      fieldIndex = Number(fieldIndex)
      const length = this.project.modules[moduleIndex].tables[tableIndex].fields.length
      if (fieldIndex + operate < 0 || fieldIndex + operate >= length) {
        return
      }
      const sortBy1 = this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].sortBy
      const sortBy2 = this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex + operate].sortBy
      this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex].sortBy = sortBy2
      this.project.modules[moduleIndex].tables[tableIndex].fields[fieldIndex + operate].sortBy = sortBy1
    },
    handleSave() {
      this.addLoading = true
      addBase(this.url, this.project).then(res => {
        this.$notify.success('创建成功!')
        this.project = res.data
        this.addLoading = false
      }).catch(() => {
        this.addLoading = false
      })
      this.addLoading = false
    },
    handleUpdate() {
      this.addLoading = true
      editBase(this.url, this.project).then(res => {
        this.project = res.data
        this.$notify.success('更新成功!')
        this.addLoading = false
      }).catch(() => {
        this.addLoading = false
      })
      this.addLoading = false
    }
  }
}
</script>

<style scoped>
::v-deep .el-card__header{
  background-color: #f8f8f8;
}
</style>
