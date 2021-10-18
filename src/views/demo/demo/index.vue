<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/demo/demo" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="demo:demo"></base-list>
    </div>
  </div>
</template>

<script>
import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
import BaseList from '@/components/BaseList'

export default {
  name: 'DemoDemo',
  components: {BaseList},
  data() {
    return {
      columns: [
        {
          key: 'zhengshu',
          label: '整数',
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 100,
          type: 'NUMBER',
          tooltip: ''
        },
        {
          key: 'xiaoshu',
          label: '小数',
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 100,
          type: 'DECIMAL',
          tooltip: ''
        },
        {
          key: 'jiner',
          label: '金额',
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 100,
          type: 'MONEY',
          tooltip: ''
        },
        {
          key: 'riqi',
          label: '日期',
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 200,
          type: 'DATE',
          tooltip: ''
        },
        {
          key: 'shijian',
          label: '时间',
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 200,
          type: 'TIME',
          tooltip: ''
        },
        {
          key: 'riqishijian',
          label: '日期时间',
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 200,
          type: 'DATE_TIME',
          tooltip: ''
        },
        {
          key: 'wenzi',
          label: '文字',
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 200,
          type: 'WORD',
          tooltip: ''
        },
        {
          key: 'duanluo',
          label: '段落',
          show: true,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 200,
          type: 'LONG_WORD',
          tooltip: ''
        },
        {
          key: 'wenzhang',
          label: '文章',
          show: false,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 200,
          type: 'LONG_TEXT',
          tooltip: ''
        },
        {
          key: 'daxingwenzhang',
          label: '大型文章',
          show: false,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 200,
          type: 'HTML',
          tooltip: ''
        },
        {
          key: 'tupian',
          label: '图片',
          show: true,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 200,
          type: 'IMAGE',
          tooltip: ''
        },
        {
          key: 'shipin',
          label: '视频',
          show: true,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 200,
          type: 'VIDEO',
          tooltip: ''
        },
        {
          key: 'wenjian',
          label: '文件',
          show: true,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 200,
          type: 'FILE',
          tooltip: ''
        },
        {
          key: 'fangwencishu',
          label: '访问次数',
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 100,
          type: 'VISIT_TIMES',
          tooltip: ''
        },
        {
          key: 'paixu',
          label: '排序',
          show: true,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 200,
          type: 'SORT',
          tooltip: ''
        },
        {
          key: 'biaoqian',
          label: '标签',
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 200,
          type: 'TAGS',
          tooltip: ''
        },
      ],
      format: {},
      rules: {
        add: {
          zhengshu: [{required: true, message: '整数不能为空', trigger: 'blur'},],
          xiaoshu: [],
          jiner: [],
          riqi: [],
          shijian: [],
          riqishijian: [],
          wenzi: [],
          duanluo: [],
          wenzhang: [],
          daxingwenzhang: [],
          tupian: [],
          shipin: [],
          wenjian: [],
          fangwencishu: [],
          paixu: [],
          biaoqian: [],
        },
        edit: {
          zhengshu: [{required: true, message: '整数不能为空', trigger: 'blur'},],
          xiaoshu: [],
          jiner: [],
          riqi: [],
          shijian: [],
          riqishijian: [],
          wenzi: [],
          duanluo: [],
          wenzhang: [],
          daxingwenzhang: [],
          tupian: [],
          shipin: [],
          wenjian: [],
          fangwencishu: [],
          paixu: [],
          biaoqian: [],
        }
      },
      options: {}
    }
  },

  created() {
    this.handleGetOptions()
  },
  mounted() {
  },
  methods: {
    handleGetOptions() {
    }
  }
}
</script>

