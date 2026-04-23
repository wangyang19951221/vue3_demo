<script setup>
import {ref} from 'vue'
import {resetPassword} from '@/api/user/index'
import {ElMessage} from 'element-plus'
import {userStore} from '@/stores'
import {useRouter} from 'vue-router'
const user = userStore()
const router = useRouter()
const pwdForm = ref({
  old_pwd:'',
  new_pwd:'',
  re_pwd:''
})
const formRef = ref()
const rules = {

  old_pwd:[
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],

  new_pwd:[
    { required: true, message: '请输入新密码', trigger: 'blur' }
  ],
  re_pwd:[
    { required: true, message: '请输入确认密码', trigger: 'blur' },{
      validator: (rule, value, callback) => {
        if (value !== pwdForm.value.new_pwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
  ]
}
const submitForm = async ()=>{
  await formRef.value.validate()
  await resetPassword(pwdForm.value)
  ElMessage.success('修改密码成功')
  user.setToken('')
  user.setUserInfo({})
  router.push('/login')
}

const resetForm = ()=>{
  pwdForm.value.old_pwd = ''
  pwdForm.value.new_pwd = ''
  pwdForm.value.re_pwd = ''
}

</script>

<template>
  <page-container title="修改密码">
    <el-row>
      <el-col :span="12">
        <el-form
          ref="formRef"
          :model="pwdForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">修改密码</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form></el-col
      >
    </el-row>
  </page-container>
</template>
