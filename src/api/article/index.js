import {request} from '@/utils/request'


export const getCategoryList = ()=>{
    return request(
        '/categoryList',
        'get'
    )
}

export const delCategory = (id)=>{
    return request(
        '/delCategory',
        'post',
        {id}
    )
}

export const addCategory = (cate_name,cate_alias)=>{

    return request(
        '/addCategory',
        'post',
        {cate_name,cate_alias}
    )
}

export const updCategory = (id,cate_name,cate_alias)=>{
    return request(
        '/updateCategory',
        'post',
        {id,cate_name,cate_alias}
    )
}
