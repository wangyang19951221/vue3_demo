<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {QuillEditor} from '@vueup/vue-quill'
import {addArticle, updateArticle, getArticleDetail} from "@/api/article";
import ChannelSelect from '@/components/ChannelSelect.vue'
import {Plus} from '@element-plus/icons-vue'

const visibleDrawer = ref(false)
const formModel = ref({})
const emit = defineEmits(["success"])
import '@vueup/vue-quill/dist/vue-quill.snow.css'

defineExpose({
  async onOpenDrawer(id) {
    visibleDrawer.value = true
    if (id) {
      formModel.value = (await getArticleDetail(id)).data
    }else{
      formModel.value = {}
      editorRef.value.setHTML('')
      imgUrl.value = ''
    }
  }
})
const formRef = ref()
const editorRef = ref()
const rules = {
  title: [
    {required: true, message: '请输入标题', trigger: 'blur'}
  ],
  cate_id:[
    {required: true, message: '请选择分类', trigger: 'change' },
  ],
  content:[
    {required: true, message: '请输入内容', trigger: 'blur'},
  ],

}


const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
  // 立刻将图片对象，存入 formModel.value.cover_img 将来用于提交
  formModel.value.cover_img = uploadFile.raw
}

const imgUrl = ref('')

const onChannelChange = (channel) => {
  formModel.value.cate_name = channel?.cate_name || ''
}

const onPublish = async (state) => {
  await formRef.value.validate()
  formModel.value.state = state
  const formData = new FormData()
  for (const key in formModel.value) {
    formData.append(key, formModel.value[key])
  }
  const add = async (formData) => {
    await addArticle(formData)
    ElMessage.success("添加成功")
  }
  const upd = async (formData) => {
    await updateArticle(formData)
    ElMessage.success("编辑成功")
  }
  if (formModel.value.id) {
    await upd(formData)
  } else {
    await add(formData)
  }
  emit('success')
  visibleDrawer.value = false
}
</script>

<template>
  <el-drawer
      v-model="visibleDrawer"
      :title="formModel.id ? '编辑文章' : '添加文章'"
      direction="rtl"
      size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px" :rules="rules">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
            v-model="formModel.cate_id"
            width="100%"
            @change="onChannelChange"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数
             只需要做前端的本地预览图片即可，无需在提交前上传图标
             语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
        -->
        <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
              ref="editorRef"
              v-model:content="formModel.content"
              content-type="html"
              theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
