<script setup>
import {ref} from 'vue'
import {ElMessage} from "element-plus"
import {updateUserInfo} from '@/api/user/index.js'
import {userStore} from '@/stores'
import {useRouter} from 'vue-router'
const user = userStore()
const formRef = ref()
const form = ref(user.userInfo)
const router = useRouter()
const rules = ref({
  name: [
    {required: true, message: "请输入用户名", trigger: "blur"},
  ],
  nickname: [
    {required: true, message: "请输入用户昵称", trigger: "blur"},
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
})

const submitForm = async () => {
  await formRef.value.validate()
  await updateUserInfo(form.value)
  user.getUserInfo()
  ElMessage.success("修改成功")
  router.push("/")
}

</script>
<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="登录名称">
        <el-input v-model="form.name" disabled ></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname" ></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
