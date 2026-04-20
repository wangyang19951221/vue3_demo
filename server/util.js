
function ok({code=200,msg="success",data={},res}){
    res.send(
        {
            code,
            msg,
            data
        }
    )
}

function fail({code=209,msg="error",res}){
    res.send(
        {
            code,
            msg
        }
    )
}


export {ok,fail}
