
function ok({code=200,msg="success",data={},res}){
    return res.send(
        {
            code,
            msg,
            data
        }
    )
}

function fail({code=209,msg="error",res}){
    return res.send(
        {
            code,
            msg
        }
    )
}


export {ok,fail}


// utils/jwt.js
import jwt from "jsonwebtoken";

// 建议放到 .env 文件中
export const SECRET_KEY = "abcde123456";

/**
 * 生成 token
 * @param {Object} payload 要保存的数据
 * @param {String} expiresIn 过期时间，例如：1h、7d、30m
 */
function generateToken(payload, expiresIn = "7d") {
    return 'Bearer ' + jwt.sign(payload, SECRET_KEY, {
        expiresIn
    });
}

/**
 * 校验 token
 * @param {String} token
 * @returns {Object|null}
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
}

export { generateToken, verifyToken };