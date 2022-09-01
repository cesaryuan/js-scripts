type ValueType = string | number | boolean | null;
type GetVarType = ValueType | string[];
type SetVarType = ValueType;

interface QuickerWebViewBridge {
    /**
     * 获取Quicker变量的值，仅支持 数字、字符串、布尔值、null、列表、词典(序列化为JSON字符串)
     * @param varName 变量名
     */
    getVar(varName: string): GetVarType,
    /**
     * 设置Quicker变量的值，仅支持 数字、文本、布尔 类型的变量
     * @param varName 仅支持 数字、字符串、布尔值、null
     * @param value 仅支持 数字、字符串、布尔值、null
     */
    setVar(varName: string, value: SetVarType): void,
    /**
     * 设置Quicker中词典变量的值
     * @param dictVarName 变量的名称
     * @param json JSON字符串
     */
    setDictByJson(dictVarName: string, json: string): void,
    /**
     * 设置Quicker中词典变量某个键的值
     * @param dictVarName 变量的名称
     * @param key 键名
     * @param value 值
     */
    setDictItemValue(dictVarName: string, key: string, value: SetVarType): void,
    /**
     * 读取Quicker中词典变量的值
     * @param dictVarName 变量的名称
     * @param key 键名
     */
    getDictItemValue(dictVarName: string, key: string): GetVarType,
    /**
     * 运行子程序
     * @param spName 子程序名
     * @param dataJson 参数JSON字符串
     * @param ignore 保留参数
     * @param callback 回调
     */
    subprogram(spName: string, dataJson: string, ignore: boolean, callback: (success: boolean, dataJson: string) => void): void,
}

interface Window {
    /**
     * 同步版本的 Quicker WebView Bridge 桥接对象
     */
    $quickerSync: QuickerWebViewBridge;
    /**
     * 异步版本的 Quicker WebView Bridge 桥接对象
     */
    $quicker: {
        [P in keyof QuickerWebViewBridge]: Promise<ReturnType<QuickerWebViewBridge[P]>>;
    };
    /**
     * 调用子程序
     * @param spName 子程序名
     * @param dataObj 参数，其中的每一个键会传递到子程序参数中
     */
    $quickerSp(spName: string, dataObj: object | string): Promise<object>;
}


// window.$quickerSync =  window.chrome.webview.hostObjects.sync.v;
// window.$quicker = window.chrome.webview.hostObjects.v;
window.$quickerSp = (spName, dataObj, callback?) => {
	let dataJson = (typeof dataObj === 'string') ? dataObj : JSON.stringify(dataObj);
	if (!callback) return new Promise((res, rej) => {
		window.$quicker.subprogram(spName, dataJson, false, (success, resultJson) => {
			if (success) res(JSON.parse(resultJson));
			else rej(resultJson);
		});
	});
	else return Promise.resolve(window.$quicker.subprogram(spName, dataJson, false, (success, dataJson) => {
		callback(success, JSON.parse(dataJson))
	}));
};

// console.log('文本', typeof window.$quickerSync.getVar('文本'));
// console.log('词典', typeof window.$quickerSync.getVar('词典'));
// console.log('日期', typeof window.$quickerSync.getVar('日期'));
// console.log('图片', typeof window.$quickerSync.getVar('图片'));
// console.log('列表', typeof window.$quickerSync.getVar('列表'));
// console.log('数字', typeof window.$quickerSync.getVar('数字'));