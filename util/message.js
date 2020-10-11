class messages{

    static success (){
        return {
            m1:{
                text:'The new row has been added with id',
                code:201,
                status:true
            } 
        } ;     
    }
    static insert(res,m_num,id){
        return res.status(this.success()[`m${m_num}`]["code"]).json({
            "status":this.success()[`m${m_num}`]["status"],
            "response":`${this.success()[`m${m_num}`]["text"]} ${id}`
        });
    }
}
module.exports=messages;