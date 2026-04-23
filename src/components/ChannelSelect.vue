<script setup>
import {ref} from 'vue'
import {getCategoryList} from '@/api/article'
const emit = defineEmits(['update:modelValue'])

const channelList = ref([])

const channelListService = async ()=>{
  const res = await getCategoryList()
  channelList.value = res.data.data
}

channelListService()

defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
</script>

<template>
  <!-- label 展示给用户看的，value 收集起来提交给后台的 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
