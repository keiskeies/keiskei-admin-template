<template>
  <el-card>
    <el-tree
      accordion
      :data="treeData"
      :show-checkbox="showCheckbox"
      node-key="id"
      :props="props"
      default-expand-all
      :check-strictly="checkStrictly"
      :default-checked-keys="defaultCheckedKeys"
      @check="handleTreeNodeClick"
    />
  </el-card>
</template>
<script>

export default {
  name: 'TreeMultiSelect',
  props: {
    props: {
      type: Object, required: false, default: () => {
        return { children: 'children', label: 'name' }
      }
    },
    checkStrictly: { type: Boolean, required: false, default: true },
    showCheckbox: { type: Boolean, required: false, default: true },
    defaultCheckedKeys: { type: Array, required: false, default: () => [] },
    treeData: { type: Array, default: () => [] },
    index: { type: Number, required: false, default: 0 },
    columnName: { type: String, required: false, default: '' }
  },
  data: () => {
    return {}
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleTreeNodeClick(val, check) {
      this.$emit('columnValChange', check.checkedNodes, this.index, this.columnName)
    }
  }
}
</script>
