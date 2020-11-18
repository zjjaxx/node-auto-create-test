
const { exec } = require("child_process")
const path = require("path")
const { promisify } = require("util")
const writeFile=promisify(require("fs").writeFile)
const stat=promisify(require("fs").stat)
const readdir=promisify(require("fs").readdir)
const exists=promisify(require("fs").exists)
module.exports = {
    /**
     * 生成测试文件名
     * @param {*} filename //完整的文件路径名
     */
    createTestFileName(filename) {
        const dirName = path.dirname(filename)
        const baseName = path.basename(filename)
        const extName = path.extname(filename)
        const _baseName = baseName.replace(extName, `.test${extName}`)
        return `${dirName}/${_baseName}`
    },
    /**
     * 
     * @param {*} methodName 测试方法名
     * @param {*} fileName 要测试的文件名
     * @param {*} isObject 是否为一个对象
     */
    createTestCode(methodName, fileName, isObject = false) {
        return `
test('测试${methodName}',()=>{
    ${isObject ? `const {${methodName}}=require('./${fileName}')` :
                `const ${methodName}=require('./${fileName}')`
            }
    /**
    * expect(${methodName}()).toBe("")
    */
})
`
    },
    async createTestCodeFile(outputFileName, testCode) {
        await writeFile(outputFileName, testCode)
    },
    async exec(outputDir){
        let files=await readdir(outputDir)
        files.filter(item=>!item.includes(".test.js")).forEach(async file=>{
            let outputFileName= this.createTestFileName(`${outputDir}/${file}`)
            let isExist=await exists(outputFileName)
            console.log(outputFileName)
            if(isExist){
                console.log(`${file}的测试文件已存在。。。`)
                return false
            }
            let file_module=require(`${outputDir}/${file}`)
            let code="" 
            if(typeof file_module =="object"){
                Object.keys(file_module).forEach((key)=>{
                    code+=this.createTestCode(key,file,true)
                })
            }
            else if(typeof file_module=="function"){
                code+=this.createTestCode(file.replace(path.extname(file),""),file,false)
            }
            this.createTestCodeFile(outputFileName,code)
        })
    }
}