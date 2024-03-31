import random

def generate_bingo_card():
    # 空の5x5 Bingoカードを初期化する
    bingo_card = [["" for _ in range(5)] for _ in range(5)]

    # Bingoカードの列範囲を定義する
    column_ranges = [(1, 15), (16, 30), (31, 45), (46, 60), (61, 75)]

    # Bingoカードを各列のランダムな数字で埋める
    for col in range(5):
        # 中央のマスをフリースペースとして埋める
        if col == 2:
            bingo_card[2][col] = "FREE"
        else:
            # 列の範囲ごとに各行のランダムな数字を生成する
            used_numbers = set()
            for row in range(5):
                lower, upper = column_ranges[col]
                number = random.randint(lower, upper)
                # 数字がすでに列内に存在しないかつ、他の列でも使用されていないことを確認する
                while number in [bingo_card[i][col] for i in range(5)] or number in used_numbers:
                    number = random.randint(lower, upper)
                used_numbers.add(number)
                bingo_card[row][col] = number

    return bingo_card

def print_bingo_card(bingo_card):
    # Bingoカードを読みやすい形式で表示する
    for row in bingo_card:
        print("\t".join(map(str, row)))

def mark_number(bingo_card, number):
    # 入力された数字がBingoカードに存在する場合、そのマスをマークする
    for row in range(5):
        for col in range(5):
            if bingo_card[row][col] == number:
                bingo_card[row][col] = "X"
                return True
    return False

def check_bingo(bingo_card):
    # ビンゴが達成されているかどうかを確認する
    # 行と列を確認
    for i in range(5):
        if all(cell == "X" for cell in bingo_card[i]) or all(bingo_card[j][i] == "X" for j in range(5)):
            return True
    # 斜めを確認
    if all(bingo_card[i][i] == "X" for i in range(5)) or all(bingo_card[i][4 - i] == "X" for i in range(5)):
        return True
    return False

if __name__ == "__main__":
    # Bingoカードを生成して表示する
    bingo_card = generate_bingo_card()
    print_bingo_card(bingo_card)

    # ゲームプレイ：ルーレットで数字を出してマークする
    while True:
        input("Press Enter to spin the roulette...")
        
        # ルーレットでランダムな数字を選ぶ
        roulette_number = random.randint(1, 75)

        print(f"The roulette number is: {roulette_number}")

        if mark_number(bingo_card, roulette_number):
            print("Number marked!")

        # 更新されたBingoカードを表示する
        print_bingo_card(bingo_card)

        # ビンゴが達成されたか確認
        if check_bingo(bingo_card):
            print("Bingo! You've won!")
            break
        else:
            print("No Bingo yet. Keep playing!")
