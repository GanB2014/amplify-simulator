import random

# 일반 증폭 테이블
NORMAL_AMPLIFY_TABLE = {
    0: {"rate": 1.0, "penalty": "none"},
    1: {"rate": 1.0, "penalty": "none"},
    2: {"rate": 1.0, "penalty": "none"},
    3: {"rate": 1.0, "penalty": "none"},
    4: {"rate": 0.8, "penalty": 3},
    5: {"rate": 0.7, "penalty": 4},
    6: {"rate": 0.6, "penalty": 5},
    7: {"rate": 0.7, "penalty": 4},
    8: {"rate": 0.6, "penalty": 5},
    9: {"rate": 0.5, "penalty": 6},
    10: {"rate": 0.4, "penalty": "destroy"},
    11: {"rate": 0.3, "penalty": "destroy"},
    12: {"rate": 0.2, "penalty": "destroy"},
    13: {"rate": 0.2, "penalty": "destroy"},
    14: {"rate": 0.2, "penalty": "destroy"},
}

# 안전 증폭 테이블
SAFE_AMPLIFY_TABLE = {
    "weapon": {
        0: {"rate": 1.0, "gold": 430100, "harmony": 36},
        1: {"rate": 1.0, "gold": 490600, "harmony": 41},
        2: {"rate": 1.0, "gold": 551100, "harmony": 46},
        3: {"rate": 1.0, "gold": 611600, "harmony": 51},
        4: {"rate": 0.7, "gold": 876652, "harmony": 55},
        5: {"rate": 0.6, "gold": 1072098, "harmony": 67},
        6: {"rate": 0.5, "gold": 1730400, "harmony": 109},
        7: {"rate": 0.5, "gold": 1932679, "harmony": 122},
        8: {"rate": 0.4, "gold": 3656400, "harmony": 230},
        9: {"rate": 0.3, "gold": 5084870, "harmony": 320},
    },
    "armor": {
        0: {"rate": 1.0, "gold": 189860, "harmony": 16},
        1: {"rate": 1.0, "gold": 250360, "harmony": 21},
        2: {"rate": 1.0, "gold": 310860, "harmony": 26},
        3: {"rate": 1.0, "gold": 371360, "harmony": 31},
        4: {"rate": 0.7, "gold": 490750, "harmony": 46},
        5: {"rate": 0.6, "gold": 615450, "harmony": 58},
        6: {"rate": 0.5, "gold": 1043132, "harmony": 98},
        7: {"rate": 0.5, "gold": 1157283, "harmony": 109},
        8: {"rate": 0.4, "gold": 2246200, "harmony": 212},
        9: {"rate": 0.3, "gold": 2937440, "harmony": 277},
    }
}

def amplify(
    amplify_type: str,
    item_type: str,
    current_level: int,
    use_protection: bool,
    use_harmony: bool,
    use_conflict: bool,
    harmony_price: int,
    conflict_price: int,
    protection_price: int,
    correction_count: int = 0
):
    item_key = "weapon" if item_type.strip() == "무기" else "armor"
    table = SAFE_AMPLIFY_TABLE[item_key] if amplify_type == "safe" else NORMAL_AMPLIFY_TABLE

    if current_level not in table:
        return {
            "next_level": current_level,
            "success": False,
            "protection_used": False,
            "cost": 0,
            "message": "최대 수치 도달",
            "destroyed": False,
            "corrected_rate": 0.0,
            "correction_count": correction_count
        }

    data = table[current_level]
    base_rate = data["rate"]
    corrected_rate = base_rate

    if amplify_type == "safe":
        corrected_rate = min(base_rate + correction_count * 0.05, 1.0)

    gold_cost = data["gold"] if amplify_type == "safe" else (739200 if item_type.strip() == "무기" else 258720)
    harmony_cost = int(harmony_price * data["harmony"]) if amplify_type == "safe" and use_harmony else 0
    conflict_cost = int(conflict_price * (current_level + 1)) if amplify_type == "normal" and use_conflict else 0
    total_cost = gold_cost + harmony_cost + conflict_cost

    # 성공 여부 결정
    success = corrected_rate >= 1.0 or random.random() < corrected_rate

    if success:
        return {
            "next_level": current_level + 1,
            "success": True,
            "protection_used": False,
            "cost": total_cost,
            "message": f"★ 성공! +{current_level + 1}",
            "destroyed": False,
            "corrected_rate": corrected_rate,
            "correction_count": 0  # 성공하면 초기화
        }

    # 실패 처리
    if amplify_type == "safe":
        return {
            "next_level": current_level,
            "success": False,
            "protection_used": False,
            "cost": total_cost,
            "message": "× 실패! (수치 유지, 보정치 +1)",
            "destroyed": False,
            "corrected_rate": corrected_rate,
            "correction_count": correction_count + 1
        }

    penalty = data["penalty"]
    is_destroy_range = current_level >= 10
    if penalty == "destroy":
        if use_protection and is_destroy_range:
            return {
                "next_level": 0,
                "success": False,
                "protection_used": True,
                "cost": total_cost + protection_price,
                "message": "× 실패! 보호권 사용 → +0 하락",
                "destroyed": False,
                "corrected_rate": corrected_rate,
                "correction_count": 0
            }
        else:
            return {
                "next_level": 0,
                "success": False,
                "protection_used": False,
                "cost": total_cost,
                "message": "💥 증폭 실패! 장비 파괴",
                "destroyed": True,
                "corrected_rate": corrected_rate,
                "correction_count": 0
            }

    return {
        "next_level": penalty,
        "success": False,
        "protection_used": False,
        "cost": total_cost,
        "message": f"× 실패! 수치 하락 → +{penalty}",
        "destroyed": False,
        "corrected_rate": corrected_rate,
        "correction_count": 0
    }
