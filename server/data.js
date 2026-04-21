import fs from 'fs'
class User {

    constructor(name, password) {
        this.name = name
        this.password = password
        this.nickName = "nickXXX"+name
    }
}


const users = JSON.parse(fs.readFileSync('./users.json','utf-8')) || []


export const register = (name,password)=>{
    try{
        users.push(new User(name,password))
    }catch(error){
        throw error
    }
    fs.writeFileSync('./users.json',JSON.stringify(users,null,2))

}
export const findUserByName = (name)=>{
    try{
        return users.find(user=>user.name === name)
    }catch(error){
        throw error
    }
}
