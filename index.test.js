
const {createTestFileName,createTestCode,exec} =require("./src/autoExe")
describe("node auto create test",()=>{
    test("自动生成测试文件名",()=>{
        let homeTestName=createTestFileName("/test/home.js")
        expect(homeTestName).toBe("/test/home.test.js")
    })
    test("自动生成测试代码",()=>{
        let code=createTestCode("getHome","home.js",false)
        expect(code).toBe(`
test('测试getHome',()=>{
    const getHome=require('./home.js')
    /**
    * expect(getHome()).toBe("")
    */
})
`)
    })
})








