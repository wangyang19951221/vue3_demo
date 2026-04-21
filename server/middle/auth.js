import jwt from 'jsonwebtoken'
import {fail, SECRET_KEY} from '../util.js'

const whiteList = ['/login','/register']

function auth(req, res, next) {
    try {
        // 白名单
        if(whiteList.includes(req.url)) {
            next()
            return
        }
        // 获取请求头 token
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return fail({
                code: 401,
                msg: "请先登录",
                res
            });
        }

        // Bearer xxxxx
        const token = authHeader.replace("Bearer ", "");

        // 校验 token
        // 挂载到 req，后续接口可直接使用
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        return fail({
            code:401,
            msg:'未授权',
            res
        });
    }
}

export default auth;