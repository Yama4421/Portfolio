#ファイル名：自販機プログラム.py
#コード制作者：山本晃大
#最終変更：2023/04/11 9:42

#################################################
#要求仕様
#1. 36種類の商品を販売できる
#2. 一度に購入できる商品は一つである
#3. 商品ごとに異なる価格を設定できる
#4. 在庫あり商品、売り切れ商品が識別できる
#5. 投入金額に応じて購入可能な商品が識別できる
#6. 下記の貨幣、紙幣のみが使える 貨幣：10円, 50円, 100円, 500円, 紙幣：1,000円
#7. 商品価格を超えた投入金額の場合、差額の釣り銭が出る
#8. 釣り銭の最大ストックは下記のとおりである 10円：50枚, 50円：10枚, 100円：20枚, 500円：10枚
#9. 貨幣、紙幣の投入後、何も購入せずに投入した貨幣、紙幣の返却ができる(返却レバー)
#10.下記の電子マネーが使えるiD, Edy, NANACO, WAON, 交通系カード

#オプション仕様(可能であれば実装)
#1. 投入した貨幣が、釣り銭ストックに再利用できる
#2. 電子マネーでの購入時、商品金額100円毎に1ポイント(＝1円)付与され、次回以降の電子マネー支払時に10ポイント以上あれば優先的にポイントが使用される

#################################################
#コード記入欄
#ライブラリ
import sys,datetime,time,random,math
import numpy as np
import pandas as pd
from pandas import Series, DataFrame

#商品棚
drink = ["緑茶１","緑茶２","紅茶１","紅茶２","紅茶３","紅茶４","ソーダ１","ソーダ２","ソーダ３","水１","水２","水３",
         "水４","水５","水６","麦茶１","麦茶２","エナジードリンク１","エナジードリンク２","エナジードリンク３","エナジードリンク４","ジュース１","ジュース２","ジュース３",
         "ジュース４","ジュース５","ジュース６","ジュース７","ジュース８","ジュース９","コーヒー１","コーヒー２","コーヒー３","コーヒー４","コーヒー５","コーヒー６"]

#値段
drink_price = [140,150,140,130,150,120,130,130,140,100,120,130,
               120,110,120,120,130,140,130,150,200,140,120,130,
               140,160,170,150,140,120,120,140,150,140,130,140]

#在庫数
drink_stock = [4,5,3,3,5,5,5,6,7,7,8,4,4,5,5,6,5,7,7,8,8,6,5,5,4,4,2,3,4,5,5,4,3,3,6,3]

#支払方法
payments = ["1:現金","2:iD","3:Edy","4:NANACO","5:WAON","6:交通系カード","7:キャンセル"]

#利用可能な硬貨および紙幣
C_money = ["10円","50円","100円","500円","1000円"]

#硬貨および紙幣のストック可能数
C_money_keep = [50,10,20,10,10]

#硬貨および紙幣の現在のストック数
money_keep_now = [20,6,20,5,4]

#インデックスor番号
drink_index = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
price_index = [1,2,3,4,5]

#コラム
drink_column01 = ["商品名","値段"]
drink_column02 = ["番号","商品名","値段"]
drink_column03 = ["商品名","値段","在庫数"]
drink_column04 = ["商品名","値段","在庫チェック"]
price_column01 = ["硬貨・紙幣","ストック可能数"]
price_column02 = ["硬貨・紙幣","現在のストック数"]
price_column03 = ["硬貨・紙幣","ストック可能数","現在のストック数"]

#データフレーム用データ
drink_data01 = list(zip(drink, drink_price))                                                    #商品棚＋値段
drink_data02 = list(zip(drink,drink_price,drink_stock))                                         #商品棚＋値段＋在庫数
price_data01 = list(zip(C_money,C_money_keep))                                                  #利用可能な硬貨および紙幣＋そのストック可能数
price_data02 = list(zip(C_money,money_keep_now))                                                #利用可能な硬貨および紙幣＋その現在のストック数
price_data03 = list(zip(C_money,C_money_keep,money_keep_now))                                   #利用可能な硬貨および紙幣＋そのストック可能数＋その現在のストック数

#ドリンクデータ
drink_p1 = pd.Series(data=drink, index=drink_index)                                             #商品選択表示
drink_p2 = pd.Series(data=drink_price, index=drink_index)                                       #値段表示
drink_p3 = pd.concat([drink_p1,drink_p2], axis=1)                                               #商品棚表示1
drink_p4 = pd.DataFrame(data=drink_data01, index=drink_index, columns=drink_column01)           #商品棚表示2
drink_np1 = pd.Series(data=drink_stock, index=drink_index)                                      #在庫数チェック1
drink_np2 = pd.concat([drink_p1,drink_np1], axis=1)                                             #在庫数チェック2
drink_np3 = pd.DataFrame(data=drink_data02, index=drink_index, columns=drink_column03)          #在庫数チェック3

#硬貨および紙幣のストック数データ
price01 = pd.Series(data=C_money_keep, index=price_index)                                       #チェック用データ1
price02 = pd.Series(data=money_keep_now, index=price_index)                                     #チェック用データ2
price03 = pd.DataFrame(data=price_data01, index=price_index, columns=price_column01)            #ストック数データ1
price04 = pd.DataFrame(data=price_data02, index=price_index, columns=price_column02)            #ストック数データ2
price05 = pd.DataFrame(data=price_data03, index=price_index, columns=price_column03)            #ストック数データ3

#データ長チェック用データ
drink_point = len(drink)                                                                        #商品棚のデータ長
drink_price_point = len(drink_price)                                                            #値段のデータ長
drink_stock_point = len(drink_stock)                                                            #在庫数のデータ長

#################################################
#プログラム定義
#購入プロセス
def drink_buyprocess():
        print(drink_p4)                                                                         #商品棚表示2を表示
        print("いらっしゃしませ")
        x = int(input("購入したいドリンクをお選びください>>> "))                                  #商品の番号を選択
        print(str(x)+"番を選択しました")                                                         #選択された番号を表示
        if(x == 0):                                                                             #0を選択した場合終了する
                print("プログラムを終了しました")                                                            
                sys.exit()
        elif(x < 1 or x > 36):                                                                  #想定されない番号を選択された場合の返し
                print("不正な操作が検知されました \n 最初から操作を行ってください")
                return(drink_buyprocess())                                                      #最初の操作に戻る
        else:
                pass
        choose_drink_price = drink_p2.loc[x]                                                    #選択された商品の値段を変数として保持
        drink_stock_cheak = drink_np1.loc[x]                                                    #選択された商品の在庫を変数として保持
        if(drink_stock_cheak == 0):                                                             #選択された商品の在庫がない場合の返し
                print("選択されたドリンクは現在品切れです \n 再度選択を行ってください")
                return(drink_buyprocess())                                                      #最初の操作に戻る
        else:
                pass

#現金投入額
        def in_money1():
                print("投入金額をお選びください>>> ")
                print(C_money)                                                                  #支払い可能な支払方法を表示
                a = int(input("10円の枚数>>> "))                                                #それぞれの貨幣の枚数を記入されたものを変数として保持
                b = int(input("50円の枚数>>> "))
                c = int(input("100円の枚数>>> "))
                d = int(input("500円の枚数>>> "))
                e = int(input("1000円の枚数>>> "))
                in_money = 10*a+50*b+100*c+500*d+1000*e                                         #記入された値を合計したものを変数として保持
                if(a > 0 or b > 0 or c > 0 or d > 0 or e > 0):                                  #硬貨および紙幣の現在のストック数に合算
                        money_keep_now[0] = money_keep_now[0] + a
                        money_keep_now[1] = money_keep_now[1] + b
                        money_keep_now[2] = money_keep_now[2] + c
                        money_keep_now[3] = money_keep_now[3] + d
                        money_keep_now[4] = money_keep_now[4] + e
                else:
                        pass
                print("投入金額:"+str(in_money)+"円")                                           #投入金額をを表示
                print("現在選択中の商品:"+drink_p1.loc[x])                                      #選択された商品を表示
                print("現在選択中の商品の値段:"+str(choose_drink_price)+"円")                    #選択された商品の値段を表示
                print("-現在購入可能な商品-")                                                    #投入金額に応じて購入可能な商品を表示
                for i in range(36):
                        i = i + 1
                        drink_price_cheak = drink_p2[i]
                        if(drink_price_cheak <= in_money):
                                print(drink_p4.loc[i])
                        else:
                                pass
                cheak = int(input("購入を確定しますか? \n 1:はい 2:いいえ \n >>> "))                                            #購入確定を問う選択
                if(cheak == 1):
                        out_money = in_money - int(choose_drink_price)
                        if(out_money >= 0):                                                                                    #入金額が正しいのかを判断する
                                print("おつりは"+str(out_money)+"円です")                                                       #おつりを表示
                                print("お買い上げありがとうございました")
                                buyagain = int(input("続けて購入しますか? \n 1:はい 2:いいえ \n >>> "))                          #続けて購入を行うかを問う選択
                                if(buyagain == 1):
                                        return(drink_buyprocess())                                                             #最初の操作に戻る
                                else:
                                        print("ご利用ありがとうございました")                                                    #ここで終了
                        else:
                                print("投入金額が"+str(out_money*-1)+"円不足しています \n おつりは"+str(in_money)+"円です")       #不足金とおつりを表示 
                                print("再度金額を投入してください")
                                return(in_money1())                                                                            #入金の最初の操作に戻る
                elif(cheak == 2):
                        print("キャンセルしました")
                        print("おつりは"+str(in_money)+"円です")
                        print("ご利用ありがとうございました")                                                                    #ここで終了
                else:
                        print("不正な操作が検知されました \n 最初から操作を行ってください")                                       #想定されない番号を選択された場合の返し
                        return(drink_buyprocess())                                                                             #最初の操作に戻る

#電子決済
        def in_money2():
                print("タッチをしてください")
                print("1:タッチを行いました 2:キャンセル")
                z = int(input(">>> "))
                print(str(z)+"を選択しました")
                if(z == 1):                                                                                                  #選択に応じたそれぞれの返し
                        print("お買い上げありがとうございました")
                        buyagain = int(input("続けて購入しますか? \n 1:はい 2:いいえ \n >>> "))                                #続けて購入を行うのかを問う選択
                        if(buyagain == 1):
                                return(drink_buyprocess())                                                                   #最初の操作に戻る
                        else:
                                print("ご利用ありがとうございました")                                                          #ここで終了
                elif(z == 2):
                        print("キャンセルしました")
                        print("ご利用ありがとうございました")                                                                  #ここで終了
                else:
                        print("不正な操作が検知されました \n 最初から操作を行ってください")                                     #想定されない番号を選択された場合の返し
                        return(drink_buyprocess())                                                                           #最初の操作に戻る

#支払方法選択
        def paychoose():
                print(payments)                                                                                              #支払方法を表示
                y = int(input("支払方法をお選びください>>> "))
                print(str(y)+"番を選択しました")
                if(y == 1):                                                                                                  #選択に応じたそれぞれの返し
                        in_money1()
                elif(y >= 2 and y <= 6):
                        in_money2()
                elif(y == 7):
                        print("キャンセルしました")
                        print("ご利用ありがとうございました")                                                                   #ここで終了
                else:
                        print("不正な操作が検知されました \n 最初から操作を行ってください")                                       #想定されない番号を選択された場合の返し
                        return(drink_buyprocess())                                                                             #最初の操作に戻る

        paychoose()

#################################################
#エラーチェック
#在庫チェック
def cheak_drink():
        for i in range(36):                                                                                                    #それぞれの商品の在庫を確認
                i = i + 1
                drink_stock_cheak = drink_np1.loc[i]
                if(drink_stock_cheak == 0):
                        print("*"+str(i)+"番の在庫は現在ございません"+"*")
                else:
                        pass

#数プログラムチェック
def cheak_len():
        if((drink_point or drink_price_point or drink_stock_point) != 36):
                print("*プログラムが正常に行われませんでした*")
                print("発生した問題>>> *数が正しくありません* \n *担当者に連絡を行い問題を解決してください*")
                sys.exit()                                                                                                              #強制終了
        else:
                pass

#値段設定チェック
def cheak_price():
        for i in range(36):
                i = i + 1
                drink_price_cheak = drink_p2[i]
                if(drink_price_cheak == 0):
                        print("*プログラムが正常に行われませんでした*")
                        print("発生した問題>>> *"+str(i)+"番の値段が設定されていません* \n *担当者に連絡を行い問題を解決してください*")
                        sys.exit()                                                                                                      #強制終了
                else:
                        pass

#硬貨および紙幣のストック数チェック
def cheak_money():
        for i in range(5):
                i = i + 1
                C_money_cheak = price01.loc[i]
                N_money_cheak = price02.loc[i]
                if(C_money_cheak < N_money_cheak):
                        print("*プログラムが正常に行われませんでした*")
                        print("発生した問題>>> *貨幣のストック数が超過しています* \n *担当者に連絡を行い問題を解決してください*")
                        sys.exit()                                                                                                      #強制終了
                else:
                        pass

#################################################
#表に実行するプログラム
while True:
        cheak_len()
        cheak_money()
        cheak_price()
        cheak_drink()
        drink_buyprocess()
        time.sleep(3)
        continue