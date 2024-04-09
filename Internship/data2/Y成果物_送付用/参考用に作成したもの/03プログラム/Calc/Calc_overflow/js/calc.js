// グローバル数
// 演算子
const OPERATOR_ADDITION = '＋';
const OPERATOR_SUBTRACTION = '－';
const OPERATOR_MULTIPLY = '×';
const OPERATOR_DIVISION = '÷';
const OPERATOR_EQUAL = '＝';
const OPERATOR_CHANGE = '+/-';

// 入力最大桁数
const INPMAIN_MAX_LEN = '8';

// 計算用配列
let calcList = new Array();

// 入力モード（0:数値入力後、1:演算子選択後、2:イコール実施後）
let inpMode = '0';
const INPMODE_NUM = '0';
const INPMODE_OPE = '1';
const INPMODE_EQL = '2';

// エラー扱いとする戻り値
const RESULT_INFINITY = 'Infinity';
const RESULT_NAN = 'NaN';


// スタイルシート変更処理
function chgStyle() 
{
    let pageObj = document.getElementById('pageStyle');
    
    if (document.getElementById('btnPage').textContent == 'i')
    {
        pageObj.href = 'css/calc_chrome_google.css';
        document.getElementById('btnPage').textContent = 'g';
    }
    else
    {
        pageObj.href = 'css/calc_chrome_ios.css';
        document.getElementById('btnPage').textContent = 'i';
    }
}

// 入力項目追記処理
function inpAppend(id, value) 
{
    document.getElementById(id).value += value;
}

// 入力項目置き換え処理
function inpUpdate(id, value) 
{
    document.getElementById(id).value = value;
}

// 最大桁数チェック
function chkMaxLen(id)
{
    // 表示からマイナス、カンマを消して保持
    const value = document.getElementById(id).value;
    const numString = value.replace(/,/g,'').replace(new RegExp(OPERATOR_SUBTRACTION,'g'),'');
    
    if (numString.length > INPMAIN_MAX_LEN)
    {
        // エラーメッセージを表示する
        document.getElementById(id).value = 'overflow(max=' + INPMAIN_MAX_LEN + ')';
        document.getElementById(id).style.fontSize ='36px';

        // クリアボタン以外はロックする
        const elements = document.querySelectorAll('.btnNumber, .btnOperator, .btnSupport, .btnCalc');
        for (let i = 0; i < elements.length; i++) 
        {
            elements[i].disabled = true;
        }

    }
}

// カンマ区切り変換表示処理
function chgDispComma(target) 
{
    // 数値化して削除された値を補填して置き換える
    inpUpdate(target, chgValComma(document.getElementById(target).value));
}

// カンマ区切り変換処理
function chgValComma(value) 
{
    let lostOpe = '';
    // 先頭が全角マイナスの場合、一度除外して後で補填する
    if (value.indexOf(OPERATOR_SUBTRACTION) >= 0)
    {
        lostOpe = OPERATOR_SUBTRACTION;
    }
    
    // 表示からマイナス、カンマを消して保持（カンマ区切りは後で再設定する）
    const numString = value.replace(/,/g,'').replace(new RegExp(OPERATOR_SUBTRACTION,'g'),'');
    
    // 数値化した場合の桁数を取得
    const numLen = String(parseInt(numString)).length;
    
    let lostVal = '';
    // 文字列の場合と数値型の場合で桁数が異なる場合
    if (numString.length != numLen)
    {
        // 小数点以下で数値なしか最後が0の場合のケースで
        // 桁落ちしていることになるので、その分を取得、補填する
        lostVal = numString.slice(-(numString.length - numLen))
    }
    
    // 数値化して削除された値を補填して置き換える
    return lostOpe + parseInt(numString).toLocaleString() + lostVal;
}

// クリアボタン押下処理
function pressClear() 
{
    // 計算式表示エリアは値なしとする
    inpUpdate('inpFormula', '');
    inpUpdate('inpCalc', '');
    inpUpdate('inpOperator', '');
    calcList = new Array();
    
    // 入力エリアを0に初期化する
    inpUpdate('inpMain', '0');

    // クリアボタン以外のロックを解除する
    const elements = document.querySelectorAll('.btnNumber, .btnOperator, .btnSupport, .btnCalc');
    for (let i = 0; i < elements.length; i++) 
    {
        elements[i].disabled = false;
    }

    // フォントサイズを初期値に戻す
    document.getElementById('inpMain').style.fontSize = '72px';

}

// ボタン押下処理（数値、演算子ボタン）
function pressBtn(value) 
{
    // イコール実施後か演算子選択の場合
    if (inpMode == INPMODE_EQL ||
        inpMode == INPMODE_OPE)
    {
        // 入力が演算子以外の場合
        if (value != OPERATOR_ADDITION && 
            value != OPERATOR_SUBTRACTION && 
            value != OPERATOR_MULTIPLY && 
            value != OPERATOR_DIVISION)
        {
            // 前回の計算結果は無視して0に初期化する
            inpUpdate('inpMain', '0');
        }
    }
    
    // ボタン押下前の値を保持（カンマ区切りは外しておく）
    const wkValue = document.getElementById('inpMain').value.replace(/,/g,'');
    
    // 入力エリアへの設定
    if (setInpMain(wkValue, value) == false)
    {
        return;
    }
    
    // 計算用項目への反映
    // 入力内容、直前入力値と今回入力値を渡す
    setCalcInfo(wkValue, value)
    
    // 表示をカンマ区切りにする
    chgDispComma('inpMain');
}

// 入力エリア設定処理
function setInpMain(wkValue, value)
{
    // 入力が演算子の場合
    if (value == OPERATOR_ADDITION || 
        value == OPERATOR_SUBTRACTION || 
        value == OPERATOR_MULTIPLY || 
        value == OPERATOR_DIVISION)
    {
        // 入力エリアには出力しない
    }
    // 入力が+/-の場合
    else if (value == OPERATOR_CHANGE)
    {
        // 入力最大桁数の場合、処理を抜ける
        if (wkValue.length >= INPMAIN_MAX_LEN)
        {
            return false;
        }
        
        // それ以外の場合
        else
        {
            // 入力されている値の正負を変換する
            if (wkValue.slice(0,1) == OPERATOR_SUBTRACTION)
            {
                inpUpdate('inpMain', wkValue.substr(1, wkValue.length -1));
            }
            else
            {
                inpUpdate('inpMain', OPERATOR_SUBTRACTION + wkValue);
            }
        }
    }
    // 入力が小数点の場合
    else if (value == '.')
    {
        // 入力最大桁数の場合、処理を抜ける
        if (wkValue.length >= INPMAIN_MAX_LEN)
        {
            return false;
        }
        
        // 入力値に既に.がある場合
        if (wkValue.indexOf( '.' ) >= 0)
        {
            // そのまま
        }
        else
        {
            // それ以外は追記
            inpAppend('inpMain', value);
        }
    }
    // それ以外（数値）の場合
    else
    {
        // 入力最大桁数の場合、処理を抜ける
        if (wkValue.length >= INPMAIN_MAX_LEN)
        {
            return false;
        }
        
        // 表示が0か-0の場合
        if (wkValue == '0' || wkValue == OPERATOR_SUBTRACTION + '0')
        {
            if (value == '00')
            {
                // 00 の場合はそのまま
            }
            else
            {
                // 0の値を入力値と置き換える
                inpUpdate('inpMain', String(wkValue).replace('0',value));
            }
        }
        else
        {
            // それ以外は追記
            inpAppend('inpMain', value);
        }
    }
}

// 計算用項目反映処理
function setCalcInfo(wkValue, value)
{
    // 入力が演算子の場合
    if (value == OPERATOR_ADDITION || 
        value == OPERATOR_SUBTRACTION || 
        value == OPERATOR_MULTIPLY || 
        value == OPERATOR_DIVISION)
    {
        
        // 入力した演算子を画面に表示する
        inpUpdate('inpOperator', value);
        
        // 入力モードが演算子選択の場合
        if (inpMode == INPMODE_OPE)
        {
            // 演算子の置き換え以外は何もしない
        }
        // イコール実施後の場合
        else if (inpMode == INPMODE_EQL)
        {
            // 各項目を初期化してから、
            // イコール時の結果を直前の数値として処理する
            calcList = new Array();
            inpUpdate('inpCalc', '');
            inpUpdate('inpFormula', '');
            
            // 入力されている数値を配列に追加する
            calcList.push(wkValue);
            // 入力されている数値を計算用項目に追記する
            inpAppend('inpCalc', wkValue);
            
            // 入力されている数値を計算用項目に追記する
            // マイナスの場合はかっこを付与する。それ以外はそのまま
            if (wkValue.slice(0,1) == OPERATOR_SUBTRACTION) 
            {
                inpAppend('inpFormula', '(' + chgValComma(wkValue) + ')');
            }
            else
            {
                inpAppend('inpFormula', chgValComma(wkValue));
            }
        }
        // それ以外（直前が数値入力）
        else
        {
            
            // 入力されている数値を配列に追加する
            calcList.push(wkValue);
            // 入力されている数値を計算用項目に追記する
            inpAppend('inpCalc', wkValue);
            
            // 入力されている数値を計算用項目に追記する
            // マイナスの場合はかっこを付与する。それ以外はそのまま
            if (wkValue.slice(0,1) == OPERATOR_SUBTRACTION) 
            {
                inpAppend('inpFormula', '(' + chgValComma(wkValue) + ')');
            }
            else
            {
                inpAppend('inpFormula', chgValComma(wkValue));
            }
        }
        
        // 入力モードは演算子選択とする
        inpMode = INPMODE_OPE;
    }
    // それ以外（数値、カンマ、+/-）の場合
    else
    {
        // 直前の値が演算子の場合
        if (inpMode == INPMODE_OPE)
        {
            // 演算子を取得
            const wkOperator = document.getElementById('inpOperator').value;
            
            // 演算子を確定扱いとし、計算用項目に追記する
            // 入力されている演算子を配列に追加する
            calcList.push(wkOperator);
            // 入力されている演算子を計算用項目に追記する
            inpAppend('inpCalc', wkOperator);
            inpAppend('inpFormula', wkOperator);
            
        }
        // イコール実施後の場合
        else if (inpMode == INPMODE_EQL)
        {
            // 再度初回からの計算とみなし、各項目を初期化する
            // 入力されている数値を配列に追加する
            calcList = new Array();
            inpUpdate('inpCalc', '');
            inpUpdate('inpFormula', '');
        }
        
        // 入力モードは数値入力とする
        inpMode = '0';
        
    }
}

// イコールボタン押下処理
function pressEqual() 
{
    // 演算子の設定がない場合は処理を抜ける
    if (document.getElementById('inpOperator').value == '')
    {
        return;
    }
    else if (inpMode == INPMODE_OPE)
    {
        // 演算子を確定させる
        // 演算子を取得
        const wkOperator = document.getElementById('inpOperator').value;
            
        // 演算子を確定扱いとし、計算用項目に追記する
        // 入力されている演算子を配列に追加する
        calcList.push(wkOperator);
        // 入力されている演算子を計算用項目に追記する
        inpAppend('inpCalc', wkOperator);
        inpAppend('inpFormula', wkOperator);
    }
    
    // ボタン押下前の値を保持（カンマ区切りは外しておく）
    const wkValue = document.getElementById('inpMain').value.replace(/,/g,'');
    
    // イコール入力前の数値を計算用項目に追記する
    // 入力されている数値を配列に追加する
    calcList.push(wkValue);
    // 入力されている数値を計算用項目に追記する
    inpAppend('inpCalc', wkValue);
    
    // 入力されている数値を計算用項目に追記する
    // マイナスの場合はかっこを付与する。それ以外はそのまま
    if (wkValue.slice(0,1) == OPERATOR_SUBTRACTION) 
    {
        inpAppend('inpFormula', '(' + chgValComma(wkValue) + ')');
    }
    else
    {
        inpAppend('inpFormula', chgValComma(wkValue));
    }
    
    // ＝を計算式エリアに追記する
    inpAppend('inpFormula', OPERATOR_EQUAL);
    
    // 演算子エリアは不要になるのでクリアする
    inpUpdate('inpOperator', '');
    
    // 配列の要素を計算する
    var resultList =  new Array();
    let errResult = splitCalc(calcList, resultList);
    
    // Infinity（無限大）が返ってきた場合
    if (errResult == RESULT_INFINITY)
    {
        // エラーメッセージを表示する
        document.getElementById('inpMain').value = '0除算エラー';
        // document.getElementById('inpMain').style.fontSize ='36px';

        // クリアボタン以外はロックする
        const elements = document.querySelectorAll('.btnNumber, .btnOperator, .btnSupport, .btnCalc');
        for (let i = 0; i < elements.length; i++) 
        {
            elements[i].disabled = true;
        }
    }
    else
    {
        // 算出結果をマイナス表記を変換、カンマ区切りを設定して表示を統一する
        let result = String(resultList[0]);

        // NaN(非数)の場合
        if (result == RESULT_NAN)
        {
            // エラーメッセージを表示する
            document.getElementById('inpMain').value = '算術エラー';
            // document.getElementById('inpMain').style.fontSize ='36px';

            // クリアボタン以外はロックする
            const elements = document.querySelectorAll('.btnNumber, .btnOperator, .btnSupport, .btnCalc');
            for (let i = 0; i < elements.length; i++) 
            {
                elements[i].disabled = true;
            }
        }
        else
        {
            result = result.replace(/-/g, OPERATOR_SUBTRACTION);
            result = chgValComma(result);
            inpUpdate('inpMain', result);
    
            // 入力モードはイコール実施後とする
            inpMode = INPMODE_EQL;

            // 計算結果が最大桁数を超えた場合はエラーとする
            chkMaxLen('inpMain');
        }
    }
}

// 配列の計算式実行
function splitCalc(splitList, resultList) 
{
    // ループ用変数の初期化
    let i = 0;
    
    // 中間計算用配列の初期化
    let subList = new Array();
    
    // 配列の要素数分、繰り返す
    for (i = 0; i < splitList.length; i++)
    {
        // 乗算、除算を先に計算する
        if (splitList[i] == OPERATOR_MULTIPLY || splitList[i] == OPERATOR_DIVISION)
        {
            // 計算を実施し、計算結果配列の最後を置き換える
            subList[subList.length - 1] =  execCalc(subList[subList.length - 1], splitList[i + 1], splitList[i]);

            if (subList[subList.length - 1] == RESULT_INFINITY)
            {
                // 0除算だった場合は処理を抜ける
                return RESULT_INFINITY;
            }
            else
            { 
                // 演算子と次の数値まで使用したのでループ変数に１加算する
                i++;
            }
        }
        else
        {
            // 数値や＋、－は配列に追記する
            subList.push(splitList[i]);
        } 
    }
    
    // 乗算、除算計算後の計算式の0番目（数値）は先に計算結果配列に格納する
    resultList.push(subList[0]);
    
    // 配列の要素数分、繰り返す
    for (i = 0; i < subList.length; i++)
    {
        if (subList[i] == OPERATOR_ADDITION || subList[i] == OPERATOR_SUBTRACTION)
        {
            // 計算を実施し、計算結果配列の最後を置き換える
            resultList[resultList.length - 1] =  execCalc(resultList[resultList.length - 1], subList[i + 1], subList[i]);
        }
        else
        {
            // 数値はスルーする
        } 
    }
}

// 計算実行
function execCalc(value1, value2, operator) 
{
    // 数値型に変換する
    const numVal1 = Number(String(value1).replace(OPERATOR_SUBTRACTION,'-'));
    const numVal2 = Number(String(value2).replace(OPERATOR_SUBTRACTION,'-'));
    
    // 小数点位置を取得する
    const dotP1 = getDotPosition(numVal1);
    const dotP2 = getDotPosition(numVal2);
    
    // 小数点以下の桁数が大きいほうを基準とする
    const max = Math.max(dotP1, dotP2);
    
    // 基準に合わせて整数化する
    // （固定小数点形式で文字列変換して、その後で.を除く）
    //  (小数点の後の桁数は取得した基準とする）
    const intVal1 = parseInt((numVal1.toFixed(max) + '').replace('.',''));
    const intVal2 = parseInt((numVal2.toFixed(max) + '').replace('.',''));
    
    // 小数点の桁を戻すための桁数（10の階乗）を取得する
    const power = Math.pow(10, max);
    
    // 整数計算した後に取得した桁数で割る
    let result = 0;
    
    if (operator == OPERATOR_ADDITION)
    {
        result = (intVal1 + intVal2) / power;
    }
    else if (operator == OPERATOR_SUBTRACTION)
    {
        result = (intVal1 - intVal2) / power;
    }
    else if (operator == OPERATOR_MULTIPLY)
    {
        // 乗算ではそれぞれ整数化ようにかけているので、桁数を戻す場合は2回割る必要がある
        result = (intVal1 * intVal2) / power / power;
    }
    else if (operator == OPERATOR_DIVISION)
    {
        // 除算では桁を戻す必要はない
        result = (intVal1 / intVal2);
    }
    
    return result;
}

// 小数点位置の取得
function getDotPosition(value) 
{
    // 文字列に変換する
    const strVal = String(value);
    let dotPosition = 0;
    
    // 小数点が存在する場合、その位置を取得する
    if (strVal.lastIndexOf('.') != -1)
    {
        dotPosition = (strVal.length - 1) - strVal.lastIndexOf('.');
    }
    
    return dotPosition;
}
