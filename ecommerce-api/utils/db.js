import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
const dbPath=join(__dirname,"..","db.json");
const readDB=()=>JSON.parse(readFileSync("db.path","utf-8"));
const writeDB=(data)=>
    writeFileSync("db.path",JSON.stringify(data,null,2));
export default{readDB,writeDB};