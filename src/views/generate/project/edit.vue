<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form_project" label-width="auto" label-suffix=": " :rule="projectRules" inline>
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
          <el-form-item label="项目LOGO" prop="logo">
            <el-input v-model="project.logo" clearable />
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="project.author" clearable />
          </el-form-item>
        </el-form>
      </div>
      <!--模块-->
      <el-tabs ref="project-module" v-model="moduleSelect" tab-position="left" addable :closable="project.modules.length > 1" @tab-add="handleModuleAdd" @tab-remove="handleModuleRemove">
        <el-tab-pane v-for="(module, moduleIndex) in project.modules" :key="moduleIndex" :label="module.name" :name="moduleIndex + ''">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <el-form :ref="'form_module_' + moduleIndex" :model="module" label-width="auto" label-suffix=": " :rule="moduleRules" inline>
                <el-form-item label="模块名称" prop="name">
                  <el-input v-model="module.name" clearable />
                </el-form-item>
                <el-form-item label="模块注释" prop="comment">
                  <el-input v-model="module.comment" clearable />
                </el-form-item>
                <el-form-item label="模块包名" prop="packageName">
                  <el-input v-model="module.packageName" clearable />
                </el-form-item>
              </el-form>
            </div>
            <el-tabs ref="module-table" v-model="tableSelect[moduleIndex]" tab-position="left" addable :closable="module.tables.length > 1" @tab-add="handleTableAdd(moduleIndex)" @tab-remove="handleTableRemove">
              <el-tab-pane v-for="(table, tableIndex) in module.tables" :key="tableIndex" :label="table.name" :name="moduleIndex + '_' + tableIndex">
                <el-card class="box-card">
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
                          <el-option value="BASE" label="列表结构" />
                          <el-option value="TREE" label="树形结构" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="创建接口" prop="buildController">
                        <el-switch v-model="table.buildController" active-color="#13ce66" inactive-color="#ff0000" active-text="是" inactive-text="否" />
                      </el-form-item>
                    </el-form>
                  </div>

                  <el-table border fit highlight-current-row stripe :data="table.fields">
                    <el-table-column label="字段名称" header-align="center" align="left" prop="name">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.name" clearable /></slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="字段类型" header-align="center" align="left" prop="type">
                      <template slot-scope="scope">
                        <slot>
                          <el-select v-model="scope.row.type" clearable >
                            <el-option v-for="item in fieldTypeOptions" :key="item.key" :value="item.key" :label="item.value"></el-option>
                          </el-select>
                        </slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="字段注释" header-align="center" align="left" prop="comment">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.comment" clearable /></slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="字段解释" header-align="center" align="left" prop="tooltip">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.tooltip" clearable /></slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="字段关系" header-align="center" align="left" prop="type">
                      <template slot="header" slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="字段类型需要选择关联ID" placement="top">
                          <div class="cell">字段关系</div>
                        </el-tooltip>
                      </template>
                      <template slot-scope="scope">
                        <slot>
                          <el-select v-model="scope.row.relation" clearable :disabled="scope.row.type !== 'MIDDLE_ID'">
                            <el-option v-for="item in fieldRelationOptions" :key="item.key" :value="item.key" :label="item.value"></el-option>
                          </el-select>
                        </slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="关联关系表" header-align="center" align="left" prop="relationEntity">
                      <template slot-scope="scope">
                        <template slot="header" slot-scope="scope">
                          <el-tooltip class="item" effect="dark" content="需要先选择字段关系" placement="top">
                            <div class="cell">关联关系表</div>
                          </el-tooltip>
                        </template>
                        <slot>
                          <el-select v-model="scope.row.relationEntity" clearable :disabled="!scope.row.relation">
                            <el-option v-for="item in module.tables" v-if="item.name !== table.name" :key="item.name" :value="item.name" :label="item.comment || item.name"></el-option>
                          </el-select>
                        </slot>
                      </template>
                    </el-table-column>

                    <el-table-column label="新建必填" header-align="center" align="left" prop="createRequire">
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.createRequire" active-color="#13ce66" inactive-color="#ff0000" active-text="是" inactive-text="否" />
                        </slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="更新必填" header-align="center" align="left" prop="updateRequire">
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.updateRequire" active-color="#13ce66" inactive-color="#ff0000" active-text="是" inactive-text="否" />
                        </slot>
                      </template>
                    </el-table-column>

                    <el-table-column label="是否查询" header-align="center" align="left" prop="queryColumn">
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.queryColumn" active-color="#13ce66" inactive-color="#ff0000" active-text="是" inactive-text="否" />
                        </slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="表格宽度" header-align="center" align="left" prop="tableWidth">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.tableWidth" clearable /></slot>
                      </template>
                    </el-table-column>
                    <!--                  fieldEnums:-->

                  </el-table>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </el-card>

        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-button v-waves type="primary" v-permission="[project+':add']"
               @click="handleSave()" :loading="addLoading"
    >保存
    </el-button>
  </div>
</template>

<script>
import permission from '@/directive/permission' // 权限判断指令
import waves from '@/directive/waves' // waves directive
export default {
  directives: { permission, waves },
  name: 'Project',
  props: {
    // eslint-disable-next-line vue/require-valid-default-prop
    project: {
      type: Object, default: () => {
        return {
          name: 'project0',
          comment: '项目注释',
          version: 'v1',
          favicon: '浏览器图标',
          logo: '项目LOGO',
          author: '作者',
          modules: [
            {
              name: 'module0',
              comment: '模块注释',
              packageName: 'top.keiskeiframework',
              tables: [
                {
                  name: 'table0',
                  comment: '标注释',
                  table: 'table_name',
                  type: 'Tree',
                  buildController: true,
                  fields: [
                    {
                      name: 'field0',
                      comment: '字段注释',
                      tooltip: '字段解释',
                      type: '',
                      createRequire: true,
                      updateRequire: true,
                      manyToMany: '',
                      relation: undefined,
                      relationEntity: '',
                      queryColumn: true,
                      jsonIgnore: false,
                      show: true,
                      edit: true,
                      sortable: true,
                      tableWidth: 200,
                      fieldEnums: [
                        {
                          name: 'fieldOptions',
                          comment: '字段选项1',
                          type: 'info',
                          effect: 'dark'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      projectRules: [],
      moduleRules: [],
      tableRules: [],
      fieldRules: [],
      moduleSelect: '0',
      addLoading: false,
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
        { key: 'TO_LONG_TEXT', value: '大型文章' },
        { key: 'MIDDLE_ID', value: '关联ID' },
        { key: 'IMAGE', value: '图片' },
        { key: 'VIDEO', value: '视频' },
        { key: 'FILE', value: '文件' },
        { key: 'VISIT_TIMES', value: '访问次数' },
        { key: 'ENABLE', value: '启/禁用' },
        { key: 'SORT', value: '排序' },
        { key: 'DICTIONARY', value: '枚举' },
      ],
      fieldRelationOptions: [
        { key: 'ONE_TO_ONE', value: '一对一' },
        { key: 'ONE_TO_MANY', value: '一对多' },
        { key: 'MANY_TO_MANY', value: '多对多' },
        { key: 'MANY_TO_ONE', value: '多对一' },
      ],
      tableSelect: [
        '0_0'
      ],
    }
  },
  methods: {
    handleModuleAdd() {
      this.tableSelect.push(this.project.modules.length + '_0')
      this.project.modules.push({
        name: 'module' + this.project.modules.length,
        tables: [
          {
            name: 'table0',
            fields: [
              { name: 'field0' }
            ]
          }
        ]
      })
    },
    handleModuleRemove(targetName) {
      const modules = Object.assign(this.project.modules)
      console.log(modules)
      console.log(targetName)
      const index = parseInt(targetName)
      this.$nextTick(() => {
        modules.splice(index, 1)
        this.project.modules = modules
          console.log(this.project.modules)
      })
    },
    handleTableAdd(moduleIndex) {
      this.project.modules[moduleIndex].tables.push({
        name: 'table' + this.project.modules[moduleIndex].tables.length,
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
    handleSave() {
      this.addLoading = true
      console.log(this.project)
      this.addLoading = false
    }
  }
}
</script>

<style scoped>

</style>
