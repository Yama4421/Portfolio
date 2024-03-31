import random
import sys

RANK_THRESHOLDS = [0.6, 1.6, 6.6, 21.6, 51.6, 71.6, 90.6]
RANKS = ["GR", "SSR", "SR", "RRR", "CR", "R", "C", "N"]

player_status = 0
player_choice1 = "一連"
player_choice2 = "十連"
player_choice_end = "ゲームを終了します"

def play_game():
    global player_status  # グローバル変数を更新するために必要

    print(f"ガチャゲーム\n 1.{player_choice1} / 2.{player_choice2}")
    player_status = int(input("選択: "))
    print(f"選択したのは: {player_choice1 if player_status == 1 else player_choice2}")

def get_rank(player_point):
    for threshold, rank in zip(RANK_THRESHOLDS, RANKS):
        if player_point <= threshold:
            return rank
    return RANKS[-1]

def get_player_choice():
    while True:
        choice = input("再度引きますか? (y/n): ").lower()
        if choice in ['y', 'n']:
            return choice
        else:
            print("無効な選択です。 'y' または 'n' を入力してください。")

if __name__ == "__main__":
    play_game()

    if player_status == 1:
        player_point = random.uniform(0, 100)
        rank = get_rank(player_point)
        print(f"ランク: {rank}")

        choice = get_player_choice()
        while choice == 'y':
            player_point = random.uniform(0, 100)
            rank = get_rank(player_point)
            print(f"ランク: {rank}")
            choice = get_player_choice()

        print(player_choice_end)
        sys.exit()

    elif player_status == 2:
        for i in range(10):
            player_point = random.uniform(0, 100)
            rank = get_rank(player_point)
            print(f"{i+1}連目: ランク - {rank}")
        
        choice = get_player_choice()
        while choice == 'y':
            for i in range(10):
                player_point = random.uniform(0, 100)
                rank = get_rank(player_point)
                print(f"{i+1}連目: ランク - {rank}")
                
            choice = get_player_choice()

        print(player_choice_end)
        sys.exit()
