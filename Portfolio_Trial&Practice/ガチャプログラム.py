import random
import sys

RANK_THRESHOLDS = [0.3, 1.7, 6.7, 21.6, 51.6, 71.6, 90.6]
RANK_THRESHOLDS_UPGRADE = [1.0, 18.0, 38.5, 68.5, 93.5]
RANKS = ["GR", "SSR", "SR", "RRR", "CR", "R", "C", "N"]
RANKS_UPGRADE = ["GR", "SSR", "SR", "RRR", "CR"]

player_choice1 = "一連"
player_choice2 = "十連"
player_choice_end = "ゲームを終了します"

def play_game():
    print(f"ガチャゲーム\n 1.{player_choice1} / 2.{player_choice2}")
    return int(input("選択: "))

def get_rank(player_point, thresholds):
    for threshold, rank in zip(thresholds, RANKS):
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

def run_single_gacha():
    player_point = random.uniform(0, 100)
    rank = get_rank(player_point, RANK_THRESHOLDS)
    print(f"ランク: {rank}")
    return get_player_choice()

def run_multi_gacha():
    for i in range(10):
        player_point = random.uniform(0, 100)
        rank = get_rank(player_point, RANK_THRESHOLDS_UPGRADE)
        print(f"{i+1}連目: ランク - {rank}")
    return get_player_choice()

if __name__ == "__main__":
    player_status = play_game()

    if player_status == 1:
        choice = run_single_gacha()
        while choice == 'y':
            choice = run_single_gacha()
    elif player_status == 2:
        choice = run_multi_gacha()
        while choice == 'y':
            choice = run_multi_gacha()

    print(player_choice_end)
    sys.exit()