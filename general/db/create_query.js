let prepare;
module.exports.select_query=(data,coming_value)=>{
    prepare=[]; 
    return {
        sql:create_query(data["select"],data["from"],data["where"],data["order"],coming_value,data["subquery"]),
        prepare:prepare
    };
}

create_query=(select,from,where,order,user_value,subquery)=>{
    let query="";
    query+=select_part(select);
    query+=from_part(from);
    query+=where_part(where,user_value,subquery);
    query+=order_part(order);
    return query;
}


select_part=(data)=>{
    let output="select ";
    for (const iterator of data) {
        output+=`${iterator},`;
    }
    return output.substr(0,output.length-1)+" ";
}
from_part=(data)=>{
    let output="from ";
    for (const iterator of data) {
        output+=`${iterator},`;
    }
    return output.substr(0,output.length-1)+" ";
}
where_part=(data,user_value={},subquery={})=>{
    if(data.length>0){
        let output="where ";
        const whereGroup={};
        //group the where conditions
        for (const iterator of data) {
            if(Object.keys(whereGroup).includes(`key${iterator.group[0]}`)){
                whereGroup["key"+iterator.group[0]].push(iterator);
            }else{
                whereGroup["key"+iterator.group[0]]=[iterator];
            }
        }
        //create where part
        lastItem=Object.keys(whereGroup)[Object.keys(whereGroup).length-1];
        for (const key in whereGroup) {
            let subCondtion=" ( ";
            let lenSubCondition=whereGroup[key].length;
            for (let i = 0,il=lenSubCondition; i < il; i++) {
                if(whereGroup[key][i]["type"]=="var"){
                    for (const inner_key in user_value) {
                        if (inner_key==whereGroup[key][i]["value"]) {
                            subCondtion+=` ${whereGroup[key][i]["key"]}${whereGroup[key][i]["operation"]}? `;
                            prepare.push(user_value[inner_key]);
                        }
                    }
                }else if(whereGroup[key][i]["type"]=="sub"){
                    let subq=subquery[whereGroup[key][i]["value"]];
                    let suboutput=create_query(subq["select"],subq["from"],subq["where"],subq["order"],user_value);
                    subCondtion+=` ( ${whereGroup[key][i]["key"]}${whereGroup[key][i]["operation"]} (${suboutput}) ) `;
                }else{
                   // console.log(findColumnValue(whereGroup[key][i]["type"],whereGroup[key][i]["value"]));
                    subCondtion+=` ${whereGroup[key][i]["key"]}${whereGroup[key][i]["operation"]}${findColumnValue(whereGroup[key][i]["type"],whereGroup[key][i]["value"])} `;
                }
                if(i!=lenSubCondition-1){
                    subCondtion+=` ${whereGroup[key][i]["link"]} `;
                }
                //console.log(subCondtion);
            }
            output+=` ${subCondtion} )${key==lastItem?"":whereGroup[key][0]["group"][1]} `;
        }
        return output;
    }else{
        return "";
    }
}
order_part=(data)=>{
    let output="";
    if(data.length>0){
        output+="order by ";
    }
    for (const iterator of data) {
        output+=`${iterator[0]} ${iterator[1]},`;
    }
    return output.substr(0,output.length-1)+" ";
}


findColumnValue= (type,value)=>{
    switch (type) {
        case "num":
            return value;
        case "str":
            return `'${value}'`;
        case "ref":
            return value;
        case "fun":
            if(value=="cur_date"){
                return `"${cur_date()}"`;
            }else if(value=="cur_time"){
                return `"${cur_time()}"`;
            }
        default:
            return value;
    }
}
cur_date=()=>  new Date().toJSON().slice(0,10).replace(/-/g,'-');
cur_time=()=>  new Date().toJSON().slice(11,19);