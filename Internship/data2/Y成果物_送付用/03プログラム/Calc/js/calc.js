// 実装予定の機能
/*
・計算結果エリア																					
	計算した結果を表示する																				
	ユーザーエラーの内容もここに表示する																				
	計算式も表示する																				
	それぞれの実行結果を表示する																				
	上記したものはそれぞれ１つしか表示されない											

・小数点 ボタン押下																					
	小数点を値の後ろにつける																				
	同じ値上では2回目以降の操作は受け付けない（例外：四則計算の記号の後に入力される値は最初の値と同一とは見なさない）				

・00,0～9 ボタン押下																					
	押した値を計算結果エリアに表示する																				
	初めに0、00を押しても反応しない																				
	桁が１０桁を超える入力は受け付けない																				
	計算式は１つしか計算できない																				
・プラスマイナス ボタン押下																					
	表示している値の頭に任意の記号を加える																				
	値がプラスの場合は値をマイナスにする																				
	値がプラスの場合はマイナス記号を値の頭につけ表示する																				
	値がマイナスの場合は値をプラスにする																				
	値がプラスの場合は値の頭にプラス記号はつけずに表示する															
・クリア ボタン押下																					
	入力したものをすべて中断して値を０にする																				
・除算 ボタン押下																					
	÷を値の後ろにつける																				
	記号を加えた後に任意の記号を加えることはできない（例外：＝）																				
	任意の値を入力するところに戻る																		
・乗算 ボタン押下																					
	×を値の後ろにつける																				
	記号を加えた後に任意の記号を加えることはできない（例外：＝）																				
	任意の値を入力するところに戻る																				
・減算 ボタン押下																					
	ーを値の後ろにつける																				
	記号を加えた後に任意の記号を加えることはできない（例外：＝）																				
	任意の値を入力するところに戻る																				
・加算 ボタン押下																					
	+を値の後ろにつける																				
	記号を加えた後に任意の記号を加えることはできない（例外：＝）																				
	任意の値を入力するところに戻る													

・イコール ボタン押下																					
	記号を加えた後に入力した場合は最初の値と同じ値が入力されたとみなして計算する																				
	計算結果エリア上にある計算式を計算する																				
	計算した結果を表示する																				
	計算結果の値が１０桁を超える場合は"エラー"と表示する
*/

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

// 記号の配列
const idArray = ['.','＋','－','×','÷'];
var idCheck = new RegExp(/(＋|－|×|÷)/);
//let firstResult = document.getElementById('inpMain');

// 記号ごとの定数
const point = '.';
const plus = '＋';
const minus = '－';
const multi = '×';
const divi = '÷';

// 入力項目追記処理
function inpAppend(id, value) 
{
//if (document.getElementById(id).value[0] === document.getElementById(id).value[1])
if (document.getElementById('inpMain').value == 0 || 00)
{
	// 実装予定（他の方法で実装済み）
	/*
	//if (idCheck.test(document.getElementById(id).value) == true)
	//{
	
	//}
	//else
	//{
	
	//}

	// 変数pointが入力された場合
	if (document.getElementById(id).value.includes('.') === true)
	{
	document.getElementById(id).value = document.getElementById(id).value.replace('.', "");
		//if (document.getElementById(id).value.match(/[0-9]+/g) != document.getElementById('inpMain').value)
		//{
		//inpUpdate('inpMain', "エラー");
		//}
		//else
		//{
		//;
		//}
	}
	//else if (document.getElementById(id).value.includes('＋') === true)
	//{
	//document.getElementById(id).value = document.getElementById(id).value.replace('＋', "");
		//if (document.getElementById(id).value.match(/[0-9]+/g) != //document.getElementById('inpMain').value)
		//{
		//inpUpdate('inpMain', "エラー");
		//}
		//else
		//{
		//;
		//}
	//}
	//else if (document.getElementById(id).value.includes('－') === true)
	//{
	//document.getElementById(id).value = document.getElementById(id).value.replace('－', "");
		//if (document.getElementById(id).value.match(/[0-9]+/g) != //document.getElementById('inpMain').value)
		//{
		//inpUpdate('inpMain', "エラー");
		//}
		//else
		//{
		//;
		//}
	//}
	//else if (document.getElementById(id).value.includes('×') === true)
	//{
	//document.getElementById(id).value = document.getElementById(id).value.replace('×', "");
		//if (document.getElementById(id).value.match(/[0-9]+/g) != //document.getElementById('inpMain').value)
		//{
		//inpUpdate('inpMain', "エラー");
		//}
		//else
		//{
		//;
		//}
	//}
	//else if (document.getElementById(id).value.includes('÷') === true)
	//{
	//document.getElementById(id).value = document.getElementById(id).value.replace('÷', "");
		//if (document.getElementById(id).value.match(/[0-9]+/g) != //document.getElementById('inpMain').value)
		//{
		//inpUpdate('inpMain', "エラー");
		//}
		//else
		//{
		//;
		//}
	//}
	//if (document.getElementById(id).value === '.'||'＋'||'－'||'×'||'÷')
	//{
	//if (document.getElementById(id).value === '.')
	//if (document.getElementById('inpMain').value === '.')
	//{
	//document.getElementById(id).value.onclick = this.disabled = true;
	//}
	*/

		// 初めに入力される値が0の場合
		if (document.getElementById(id).value[1] === '0')
		{
		//return function(inpAppend)
		//{
		//let len = ('0' + document.getElementById('inpMain').value[1]).slice(-1);
		//inpUpdate('inpMain', "");
		document.getElementById(id).value -= value;
		//}
		//return(document.getElementById('inpMain').value[0]);
		}
		// 初めに入力される値が00の場合
		else if (document.getElementById(id).value[1] === '00')
		{
		//return function(inpAppend)
		//{
		//let len = ('0' + document.getElementById('inpMain').value[1]).slice(-1);
		//inpUpdate('inpMain', "");
		document.getElementById(id).value -= value;
		//}
		//return(document.getElementById('inpMain').value[0]);
		}
		else
		{
		//document.getElementById('inpMain').value = document.getElementById('inpMain').value.replace(0,"")
		//document.getElementById(id).value[0] = value[1];
		document.getElementById(id).value[1] += value;
		}
	//}
	//if (document.getElementById(id).value[1] === document.getElementById('btnNumber').value)
	//{
	//document.getElementById(id).value[1] += value;
	document.getElementById('inpMain').value = document.getElementById('inpMain').value.replace(0,"")
	document.getElementById(id).value += value;
	//}   
	//if (document.getElementById(id).value[1] === document.getElementById('inpMain').value[0])
	//{
	//document.getElementById(id).value[1] = document.getElementById(id).value[0];
	//document.getElementById(id).value += value;
	//}
}
//else if (document.getElementById('inpMain').value == '.' || '＋' || '－' || '×' || '÷')

// 変数pointが入力された場合
else if (document.getElementById('inpMain').value.indexOf(point) > 0)
{
document.getElementById('inpMain').value = document.getElementById(id).value;
document.getElementById('inpMain').value[0] = document.getElementById('inpMain').value.replace("0","")
document.getElementById(id).value += value;
//{
//document.getElementById('inpMain').value = document.getElementById('inpMain').value.replace(0,"")
//document.getElementById(id).value += value;
}

// 変数plusが入力された場合
else if (document.getElementById('inpMain').value.indexOf(plus) > 0)
{
document.getElementById('inpMain').value = document.getElementById(id).value;
document.getElementById('inpMain').value[0] = document.getElementById('inpMain').value.replace("0","")
document.getElementById(id).value += value;
}

// 変数minusが入力された場合
else if (document.getElementById('inpMain').value.indexOf(minus) > 0)
{
document.getElementById('inpMain').value = document.getElementById(id).value;
document.getElementById('inpMain').value[0] = document.getElementById('inpMain').value.replace("0","")
document.getElementById(id).value += value;
}

// 変数multiが入力された場合
else if (document.getElementById('inpMain').value.indexOf(multi) > 0)
{
document.getElementById('inpMain').value = document.getElementById(id).value;
document.getElementById('inpMain').value[0] = document.getElementById('inpMain').value.replace("0","")
document.getElementById(id).value += value;
}

// 変数diviが入力された場合
else if (document.getElementById('inpMain').value.indexOf(divi) > 0)
{
document.getElementById('inpMain').value = document.getElementById(id).value;
document.getElementById('inpMain').value[0] = document.getElementById('inpMain').value.replace("0","")
document.getElementById(id).value += value;
}

else
{
document.getElementById('inpMain').value[0] = document.getElementById('inpMain').value.replace("0","")
document.getElementById(id).value += value;
//document.getElementById(id).value += value;
} 
}

// 入力項目置き換え処理
function inpUpdate(id, value) 
{
// 実装予定（未実装）
/*
if (document.getElementById(id).value.sign === 1)
{
Data.value = '-' + value;
document.getElementById(id).value = '-' + value;
}
else if (document.getElementById(id).value.sign === -1)
{
Data.value = '+' + value;
document.getElementById(id).value = '+' + value;
}
else
{
var result = document.getElementById('inpMain').match(/[0-9]+/g);
}
*/

document.getElementById(id).value = value;
}

// クリアボタン押下処理
function pressClear() 
{    
// 入力エリアを0に初期化する
inpUpdate('inpMain', '0');
//onclick = this.disabled = false;
}

//let MainArray = {document.getElementById('inpMain').value};
let equalAct = document.getElementById('btnCalc');

// イコール押下処理（=）
function pressEqual(id, value)
{
// 入力された式の変数
let result = document.getElementById('inpMain').value;

// 割り算の場合
if (result.indexOf(divi) > 0)
{
let num4 = result.split('÷');
let numF10 = parseFloat(num4[0]);
let numF11 = parseFloat(num4[1]);
let numF12 = parseFloat(num4[2]);
	if (isNaN(numF11) === true)
	{
	numF11 = numF10;
	}
	else if (isNaN(numF12) !== true)
	{
		/*
		if (num4.indexOf(multi) > 0)
		{
		numF11 *= numF12;
		}
		else if (num4.indexOf(plus) > 0)
		{
		numF11 += numF12;
		}
		else if (num4.indexOf(minus) > 0)
		{
		numF11 -= numF12;
		}
		else
		{
		numF11 /= numF12;
		}
		*/
	numF11 /= numF12;
	}
	else
	{
	;
	}
//inpUpdate('inpMain', parseFloat(num4[0]) /= (num4[1]));
inpUpdate('inpMain', numF10 /= numF11);
//return inpAppend(value);
}

// 掛け算の場合
else if (result.indexOf(multi) > 0)
{
let num3 = result.split('×');
let numF7 = parseFloat(num3[0]);
let numF8 = parseFloat(num3[1]);
let numF9 = parseFloat(num3[2]);
	if (isNaN(numF8) === true)
	{
	numF8 = numF7;
	}
	else if (isNaN(numF9) !== true)
	{
		/*
		if (num3.indexOf(divi) > 0)
		{
		numF8 /= numF9;
		}
		else if (num3.indexOf(plus) > 0)
		{
		numF8 += numF9;
		}
		else if (num3.indexOf(minus) > 0)
		{
		numF8 -= numF9;
		}
		else
		{
		numF8 *= numF9;
		}
		*/
	numF8 *= numF9;
	}
	else
	{
	;
	}
//inpUpdate('inpMain', parseFloat(num3[0]) *= (num3[1]));
inpUpdate('inpMain', numF7 *= numF8);
//return inpAppend(value);
}

// 引き算の場合
else if (result.indexOf(minus) > 0)
{
let num2 = result.split('－');
let numF4 = parseFloat(num2[0]);
let numF5 = parseFloat(num2[1]);
let numF6 = parseFloat(num2[2]);
	if (isNaN(numF5) === true)
	{
	numF5 = numF4;
	}
	else if (isNaN(numF6) !== true)
	{
		/*
		if (num2.indexOf(divi) > 0)
		{
		numF5 /= numF6;
		}
		else if (num2.indexOf(multi) > 0)
		{
		numF5 *= numF6;
		}
		else if (num2.indexOf(plus) > 0)
		{
		numF5 += numF6;
		}
		else
		{
		numF5 -= numF6;
		}
		*/
	numF5 -= numF6;
	}
	else
	{
	;
	}
//inpUpdate('inpMain', parseFloat(num2[0]) -= parseFloat(num2[1]));
inpUpdate('inpMain', numF4 -= numF5);
//return inpAppend(value);
}

// 足し算の場合
else if (result.indexOf(plus) > 0)
{
let num1 = result.split('＋');
let numF1 = parseFloat(num1[0]);
let numF2 = parseFloat(num1[1]);
let numF3 = parseFloat(num1[2]);
	if (isNaN(numF2) === true)
	{
	numF2 = numF1;
	}
	else if (isNaN(numF3) !== true)
	{
		/*
		if (num1.indexOf(divi) > 0)
		{
		numF2 /= numF3;
		}
		else if (num1.indexOf(multi) > 0)
		{
		numF2 *= numF3;
		}
		else if (num1.indexOf(minus) > 0)
		{
		numF2 -= numF3;
		}
		else
		{
		numF2 += numF3;
		}
		*/
	numF2 += numF3;
	}
	else
	{
	;
	}
//inpUpdate('inpMain', parseFloat(num1[0]) += parseFloat(num1[1]));
inpUpdate('inpMain', numF1 += numF2);
//return inpAppend(value);
}

// 入力されたものがNaNの場合
else if (isNaN(result) === true)
{
result = 0;
}

//let num1 = result.split() //正規表現で区切る

// 上記した計算以外の場合（数字のみや何も入力していない場合など）
else
{
//let num0 = result.split("");
let num0 = result.replace(/\D/g, ""); //数字のみ出力する
//document.getElementById('inpMain') = num0;
inpUpdate('inpMain', num0);
}
}

// ボタン押下処理（数値、演算子ボタン）
function pressBtn(value, id) 
{
//str.replace(document.getElementById('inpMain').value[0],document.getElementById('inpMain').value[1]);

// 桁数の制限
if (document.getElementById('inpMain').value.length < 10 )	// 10桁制限
{
inpAppend('inpMain', value);
}

//else if ()
//{

//}

// 10桁以上入力された場合
else
{
//document.getElementById('inpMain').value = "エラー";
inpUpdate('inpMain', "エラー");				// エラー表示
//document.getElementById('inpMain').reset;
}
}