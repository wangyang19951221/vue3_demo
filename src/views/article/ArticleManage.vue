<script setup>
import {ref} from 'vue'
import ChannelSelect from '@/components/ChannelSelect.vue'
import ArticleEdit from '@/components/ArticleEdit.vue'
import {getArticleList,deleteArticle} from "@/api/article";
import{Edit,Delete} from "@element-plus/icons-vue";
import {ElMessage} from 'element-plus'
const params = ref({
  cate_id: '',
  state: '',
  pagenum:1,
  pagesize:3,
  total:0
})
const articleEditRef = ref()
const articleList = ref([])

const loading = ref(false)

const onSearch = async () => {
  loading.value = true
  const res = await getArticleList(params.value)
  articleList.value = res.data.data
  params.value.total = res.data.total
  loading.value = false
}
onSearch()
const onReset = async () => {
  params.value = {
    cate_id: '',
    state: ''
  }
  await onSearch()
}
const onAddArticle = () => {
  articleEditRef.value.onOpenDrawer()
}
const onEditArticle = (id) => {
  articleEditRef.value.onOpenDrawer(id)
}

const onDeleteArticle = async (row) =>{
  await deleteArticle(row.id)
  ElMessage.success('删除成功')
  onSearch()

}
const onSizeChange = async ()=>{
  onSearch()
}
const onCurrentChange = async ()=>{
  onSearch()
}

const onSuccess = ()=>{
  onSearch()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- Vue2 => v-model :value 和 @input 的简写 -->
        <!-- Vue3 => v-model :modelValue 和 @update:modelValue 的简写 -->
        <channel-select v-model="params.cate_id" class = 'el_select'></channel-select>

        <!-- Vue3 => v-model:cid  :cid 和 @update:cid 的简写 -->
        <!-- <channel-select v-model:cid="params.cate_id"></channel-select> -->
      </el-form-item>
      <el-form-item label="发布状态:">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select v-model="params.state" class = 'el_select'>
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ row.pub_date }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
              circle
              plain
              type="primary"
              :icon="Edit"
              @click="onEditArticle(row.id)"
          ></el-button>
          <el-button
              circle
              plain
              type="danger"
              :icon="Delete"
              @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
        v-model:current-page="params.pagenum"
        v-model:page-size="params.pagesize"
        :page-sizes="[2, 3, 5, 10]"
        :background="true"
        layout="jumper, total, sizes, prev, pager, next"
        :total="params.total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped>

.el_select {
  width: 220px;
}

</style>
