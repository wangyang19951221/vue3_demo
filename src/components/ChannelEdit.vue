<script setup>
import {ref, defineEmits} from 'vue'
import {updCategory, addCategory} from '@/api/article'
import {ElMessage} from 'element-plus'
const dialogVisible = ref(false)
const formRef = ref()

const formModel = ref({
  cate_name: '',
  cate_alias: ''
})

const rules = [
  {
    cate_name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' }
    ]
  },
  {
    cate_alias: [
      { required: true, message: '请输入分类别名', trigger: 'blur' }
    ]
  }
]

defineExpose({
  open:(model)=>{
    dialogVisible.value = true
    formModel.value = {...model}
  }
})

const emit = defineEmits(['success'])
const onSubmit = async ()=>{
  await formRef.value.validate()
  if(formModel.value.id){
    await updCategory(formModel.value.id,formModel.value.cate_name,formModel.value.cate_alias)
    ElMessage.success('编辑成功')
  }else{
    await addCategory(formModel.value.cate_name,formModel.value.cate_alias)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
