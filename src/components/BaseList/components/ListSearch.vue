<template>
  <div>
    <el-row v-if="listQuery && listQuery.length > 0" :gutter="5">
      <template v-for="(column, index) in columns" v-if="column.queryable && conditionRelOptions[column.type]">
        <el-col
          :xs="{span: ((column.type === 'ENABLE' || column.type === 'BOOLEAN' || column.type === 'DICTIONARY') ? 1 : 2) * 12}"
          :sm="{span: (listQuery[index].condition === 'BT' ? 4 : ((column.type === 'ENABLE' || column.type === 'BOOLEAN' || column.type === 'DICTIONARY') ? 1 : 2)) * 6}"
          :md="{span: (listQuery[index].condition === 'BT' ? 4 : ((column.type === 'ENABLE' || column.type === 'BOOLEAN' || column.type === 'DICTIONARY') ? 1 : 2)) * 4}"
          :lg="{span: (listQuery[index].condition === 'BT' ? 4 : ((column.type === 'ENABLE' || column.type === 'BOOLEAN' || column.type === 'DICTIONARY') ? 1 : 2)) * 3}"
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
    <el-button v-waves type="primary" class="filter-button" icon="el-icon-search" @click="fetchData()">搜索</el-button>
    <el-button v-waves v-permission="[permission+':add']" type="primary" class="filter-button" icon="el-icon-plus" plain @click="handleAdd">新建</el-button>
  </div>
</template>

<script>
import permission from '@/directive/permission' // 权限判断指令
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ListSearch',
  directives: { permission, waves },
  props: {
    columns: { type: Array, default: () => [] },
    permission: { type: String, default: '' },
    options: {
      type: Object, default: () => {
      }
    },
  },
  data() {
    return {
      listQuery: [],
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
      },
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
    }
  },
  created() {
    const listQuery = []
    this.columns.forEach(e => {
      let condition = 'EQ'
      if (e.type) {
        const conditions = this.conditionRelOptions[e.type]
        if (conditions) {
          condition = conditions[0]
        }
      }
      listQuery.push({ column: e.key, condition: condition, value: [null] })
    })
    const routerQuery = this.$route.query
    for (const key in routerQuery) {
      listQuery.push({ column: key, condition: 'EQ', value: [routerQuery[key]] })
    }
    this.listQuery = listQuery
    this.fetchData()
  },
  methods: {
    handleAdd() {
      this.$emit('handleAdd')
    },
    fetchData(page, size) {
      this.$emit('filterFetchData', page, size, this.listQuery)
    }
  }
}
</script>

<style scoped>

</style>
