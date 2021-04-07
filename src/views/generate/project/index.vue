<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form_project" label-width="auto" label-suffix=": " :rule="projectRules" inline>
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="project.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目注释" prop="comment">
            <el-input v-model="project.comment" clearable></el-input>
          </el-form-item>
          <el-form-item label="版本号" prop="version">
            <el-input v-model="project.version" clearable></el-input>
          </el-form-item>
          <el-form-item label="浏览器图标" prop="favicon">
            <el-input v-model="project.favicon" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目LOGO" prop="logo">
            <el-input v-model="project.logo" clearable></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="project.author" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
<!--模块-->
      <el-tabs ref="project-module" tab-position="left" addable :closable="project.modules.length > 1" @tab-add="handleModuleAdd" @tab-remove="handleModuleRemove" v-model="moduleSelect">
        <el-tab-pane v-for="(module, moduleIndex) in project.modules" :key="moduleIndex" :label="module.name" :name="moduleIndex + ''">
          <el-card class="box-card"  shadow="hover">
            <div slot="header" class="clearfix">
              <el-form :ref="'form_module_' + moduleIndex" :model="module" label-width="auto" label-suffix=": " :rule="moduleRules" inline>
                <el-form-item label="模块名称" prop="name">
                  <el-input v-model="module.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="模块注释" prop="comment">
                  <el-input v-model="module.comment" clearable></el-input>
                </el-form-item>
                <el-form-item label="模块包名" prop="packageName">
                  <el-input v-model="module.packageName" clearable></el-input>
                </el-form-item>
              </el-form>
            </div>
            <el-tabs ref="module-table" tab-position="left" addable :closable="module.tables.length > 1" @tab-add="handleTableAdd(moduleIndex)" @tab-remove="handleTableRemove" v-model="tableSelect[moduleIndex]">
              <el-tab-pane v-for="(table, tableIndex) in module.tables" :key="tableIndex" :label="table.name" :name="moduleIndex + '_' + tableIndex">
                <el-card  class="box-card">
                  <div slot="header" class="clearfix">
                    <el-form :ref="'form_module_' + moduleIndex + '_table_' + tableIndex" :model="table" label-width="auto" label-suffix=": " :rule="tableRules" inline>
                      <el-form-item label="表名称" prop="name">
                        <el-input v-model="table.name" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="表注释" prop="comment">
                        <el-input v-model="table.comment" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="表类型" prop="type">
                        <el-select v-model="table.type" clearable>
                          <el-option value="Base" label="常规"></el-option>
                          <el-option value="Tree" label="层级"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="创建接口" prop="buildController">
                        <el-switch v-model="table.buildController" active-color="#13ce66"  inactive-color="#ff0000" active-text="是" inactive-text="否"></el-switch>
                      </el-form-item>
                    </el-form>
                  </div>


                  <el-table border fit highlight-current-row stripe :data="table.fields">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-form :ref="'form_module_' + moduleIndex + '_table_' + tableIndex + '_field_' + scope.index" :model="table" label-width="auto" label-suffix=": " :rule="fieldRules" inline>
                          <el-form-item label="多对多" prop="manyToMany">
                            <el-select v-model="scope.row.manyToMany" clearable>
                              <el-option v-for="(item, index) in project.modules.map(e => e.tables.map(o => o))" :key="index" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="一对多" prop="oneToOne">
                            <el-select v-model="scope.row.oneToOne" clearable>
                              <el-option v-for="(item, index) in project.modules.map(e => e.tables.map(o => o))" :key="index" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="是否隐藏" prop="jsonIgnore">
                            <el-switch v-model="scope.row.jsonIgnore" active-color="#13ce66"  inactive-color="#ff0000" active-text="是" inactive-text="否"></el-switch>
                          </el-form-item>
                          <el-form-item label="表格显示" prop="show">
                            <el-switch v-model="scope.row.show" active-color="#13ce66"  inactive-color="#ff0000" active-text="是" inactive-text="否"></el-switch>
                          </el-form-item>
                          <el-form-item label="能否更新" prop="edit">
                            <el-switch v-model="scope.row.edit" active-color="#13ce66"  inactive-color="#ff0000" active-text="是" inactive-text="否"></el-switch>
                          </el-form-item>
                          <el-form-item label="能否排序" prop="sortable">
                            <el-switch v-model="scope.row.sortable" active-color="#13ce66"  inactive-color="#ff0000" active-text="是" inactive-text="否"></el-switch>
                          </el-form-item>
                        </el-form>

                      </template>
                    </el-table-column>
                    <el-table-column label="字段名称" header-align="center" align="left" prop="name">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.name" clearable></el-input></slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="字段注释" header-align="center" align="left" prop="comment">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.comment" clearable></el-input></slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="字段解释" header-align="center" align="left" prop="tooltip">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.tooltip" clearable></el-input></slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="字段类型" header-align="center" align="left" prop="type">
                      <template slot-scope="scope">
                        <slot>
                          <el-select v-model="scope.row.type" clearable>
                          </el-select>
                        </slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="新建必填" header-align="center" align="left" prop="createRequire">
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.createRequire" active-color="#13ce66"  inactive-color="#ff0000" active-text="是" inactive-text="否"></el-switch>
                        </slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="更新必填" header-align="center" align="left" prop="updateRequire">
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.updateRequire" active-color="#13ce66"  inactive-color="#ff0000" active-text="是" inactive-text="否"></el-switch>
                        </slot>
                      </template>
                    </el-table-column>

                    <el-table-column label="是否查询" header-align="center" align="left" prop="queryColumn">
                      <template slot-scope="scope">
                        <slot>
                          <el-switch v-model="scope.row.queryColumn" active-color="#13ce66"  inactive-color="#ff0000" active-text="是" inactive-text="否"></el-switch>
                        </slot>
                      </template>
                    </el-table-column>
                    <el-table-column label="表格宽度" header-align="center" align="left" prop="tableWidth">
                      <template slot-scope="scope">
                        <slot><el-input v-model="scope.row.tableWidth" clearable></el-input></slot>
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
  </div>
</template>

<script>
export default {
  name: "Project",
  data() {
    return {
      projectRules: [],
      moduleRules: [],
      tableRules: [],
      fieldRules: [],
      moduleSelect: '0',
      tableSelect: [
        '0_0'
      ],
      project: {
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
                    oneToOne: '',
                    queryColumn: true,
                    jsonIgnore: false,
                    show: true,
                    edit: true,
                    sortable: true,
                    tableWidth: 200,
                    fieldEnums: [
                      {
                        code: 'fieldOptions',
                        name: '字段选项1',
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
  },
  methods: {
    handleModuleAdd() {
      this.tableSelect.push(this.project.modules.length + '_0')
      this.project.modules.push({
        name: 'module'+ this.project.modules.length,
        tables: [
          {
            name: 'table0',
            fields: [
              {name: 'field0'}
            ]
          }
        ]
      })
    },
    handleModuleRemove(targetName) {
      const index = parseInt(targetName)
      this.project.modules.splice(index, 1)
      this.tableSelect.splice(index, 1)
    },
    handleTableAdd(moduleIndex) {
      this.project.modules[moduleIndex].tables.push({
        name: 'table' + this.project.modules[moduleIndex].tables.length,
        fields: [
          {name: 'field1'}
        ]
      })

    },
    handleTableRemove(targetName) {
      const indexes = targetName.split('_')
      const moduleIndex = parseInt(indexes[0])
      const tableIndex = parseInt(indexes[1])
      this.project.modules[moduleIndex].tables.splice(tableIndex, 1)


    }
  }
}
</script>

<style scoped>

</style>
