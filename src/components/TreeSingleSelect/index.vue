<template>
<div>
  <el-cascader :ref="columnName + '_' + index" class="form-item" v-model="val" :options="options" @click="handleTreeNodeClick"
                           :props="props" clearable filterable>
    <template slot-scope="{ node, data }">
      <span>{{ data.name }}</span>
      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
    </template>
  </el-cascader>
</div>
</template>
<script>

export default {
  name: 'TreeSingleSelect',
  props: {
    props: {type: Object, required: false, default: () => {return {value: 'id', label: 'name', leaf: 'id', emitPath: false}}},
    options: {type: Array, default: () => []},
    index: {type: Number, required: false, default: 0},
    columnName: {type: String, required: true, default: ''},
    checkNode: {type: Object, default: () => {}}
  },
  data: () => {
    return {
      val: undefined
    }
  },
  watch: {
    checkNode: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          console.log(newVal)
          this.val = newVal.id
        }
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleTreeNodeClick() {
      this.$emit('columnValChange', this.$refs[this.columnName + '_' + this.index].getCheckedNodes()[0].data, this.index, this.columnName)
    },
  }
}
</script>
