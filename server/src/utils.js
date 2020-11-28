/** 
 * 生成n位随机数
*/
function generateCode(n) {
    let code = '';
    for (var i = 1; i <= n; i++) {
        const num = Math.floor(Math.random() * 10);
        code += num;
    }
    
    return code
}

randomWord = (randomFlag, min, max) => {
    let str = '',
        range = min, // 默认赋值为第二个参数，如果是随机产生位数会通过下面的if改变。
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (let i = 0; i < range; i++) {
        let index = Math.round(Math.random() * (arr.length - 1));
        str += arr[index];
    }
    return str;
}

module.exports = {
    generateCode,
    randomWord
}

