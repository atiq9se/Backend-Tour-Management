

export interface AuthTokens{
    accessToken?:string;
    refreshToken?:string;
}
const setAuthCookie(res: Response, tokenInfo: string)=>{
    if(tokenInfo.accessToken){
        res.cookie("accessToken", loginInfo.accessToken, {
            httpOnly: true,
            secure: false
        })
    }
    
    if(tokenInfo.refreshToken){
        res.cookie("refreshToken", loginInfo.refreshToken, {
            httpOnly: true,
            secure: false
        })
    }
}