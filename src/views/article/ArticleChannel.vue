<script setup>
import {ref} from 'vue'
import {
Edit, Delete
} from '@element-plus/icons-vue'
import {ElMessage, ElLoading, ElMessageBox} from 'element-plus'
import ChannelEdit from '@/components/ChannelEdit.vue'
import {getCategoryList,delCategory} from '@/api/article'
// import PageContainer  from "@/components/PageContainer.vue";
const loading = ref(false)
const channelList = ref([])

const getList = async () => {
  loading.value = true
  const result = await getCategoryList()
  channelList.value = result.data
  loading.value = false
}
const dialog = ref()

getList()

const onAddChannel = ()=>{
  dialog.value.open({})
}
const onEditChannel = (row, index)=>{
  dialog.value.open(row)
}
const onSuccess = ()=>{
  getList()
}
const onDelChannel= async (row, index) =>{
  await ElMessageBox.confirm('确认删除吗？','提示',{
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await delCategory(row.id)
  await getList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- row 就是 channelList 的一项， $index 下标 -->
        <template #default="{ row, $index }">
          <el-button
              :icon="Edit"
              circle
              plain
              type="primary"
              @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
              :icon="Delete"
              circle
              plain
              type="danger"
              @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
