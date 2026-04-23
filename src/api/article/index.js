import {request} from '@/utils/request'

export const artGetListService = (params) => {
    return request(
        '/articleList',
        'get',
        params
    )
}

export const artDelService = (id) => {
    return request(
        '/delArticle',
        'post',
        {id}
    )
}

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

export const getArticleList = (params)=> {
    return request(
        '/articleList',
        'get',
        params
    )
}

export const deleteArticle = (id)=>{
    return request(
        '/delArticle',
        'post',
        {id}
    )
}

export const addArticle = (data)=>{
    return request(
        '/addArticle',
        'post',
        data
    )
}

export const updateArticle = (data)=>{
    return request(
        '/updateArticle',
        'post',
        data
    )
}

export const getArticleDetail = (id)=>{

    return request(
        '/articleDetail',
        'get',
        {id}
    )
}
