#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script pour reconstruire complètement le fichier zh.json (chinois)
avec toutes les traductions depuis le français
"""

import json

# Charger le fichier zh.json actuel
with open('modules/lang/zh.json', 'r', encoding='utf-8') as f:
    zh_data = json.load(f)

# Ajouter toutes les sections manquantes une par une

# Section game (compléments)
zh_data['game']['share_texts'] = {
    'text1_title': '🌟 我穿越了人类的边界！',
    'text1_quote': '从黑暗到光明，我学到了爱能超越差异将我们团结。',
    'text2_title': '🕊️ 通往真理的旅程...',
    'text2_quote': '我打破了恐惧之墙，建造了爱的桥梁。',
    'text3_title': '🌍 从墙到桥，我发现了人性...',
    'text3_quote': '超越边界，我们的心同步跳动。',
    'text4_title': '👁️ 我看见了超越偏见的真理...',
    'text4_quote': '我们因恐惧而建墙，但爱将它们变成避难所。',
    'play_text': '玩 ⛵ 小船 👁️'
}

zh_data['game']['instructions'] = {
    'break_frontiers': '🌍 打破边界 🌍',
    'click_to_launch': '🚀 点击发射',
    'click_to_start': '点击开始旅程...',
    'touch_to_start': '👆 触摸开始旅程！',
    'intro_message_1': '⛵✨ 小船 ✨⛵<br><br>🌅 第一章：光明<br><br>💭 "他们告诉我那些人都是怪物...<br>他们对我说了那么多恶言，那么多关于他们的不幸...<br>但我宁愿亲眼去看。<br>他们究竟是什么样的人？..."',
    'intro_message_2': '💭 "然后我看到了...<br>一位父亲...一位母亲...孩子们...<br>所有人都只是想过上最好的生活...就像我一样。"',
    'intro_message_3': '🌑 然后黑暗将至... ⛈️<br>🎮 打破偏见，抵抗风暴！<br><br>👆 触摸开始旅程！'
}

zh_data['game']['quotes'] = {
    'enigma_truth': '每个谜题中都隐藏着真理，',
    'truth_humanity': '每个真理中都揭示着我们的人性。',
    'be_first': '成为第一个完成游戏的人！'
}

zh_data['game']['frontiers'] = {
    'title': '🧱 边界',
    'subtitle': '逃离边界'
}

zh_data['game']['canvas'] = {
    'objective': '目标：3300万！🌍',
    'click_info': '（点击了解更多）',
    'author': '🎨 Emmanuel Payet',
    'dreamer': '梦想家 Unisona',
    'projects': '📂 项目',
    'languages_heart': '💝 心灵的语言 💝',
    'languages_message': '每种语言都承载着世界的爱与和平',
    'love': '爱',
    'universal': '普世',
    'voyage_origin': '旅程起源',
    'continue_button': '➜ 继续',
    'next_button': '➜ 下一个'
}

zh_data['game']['projects'] = {
    'games_deco': '游戏与装饰',
    'unispourlapaix': '团结为和平',
    'free_gospel': '自由福音',
    'books_art': '书籍与艺术',
    'good_time': '美好时光'
}

zh_data['game']['phase_display'] = {
    'voyage': '旅程',
    'phase_counter': '阶段',
    'secret_mode': '秘密模式'
}

zh_data['game']['voyage_names'] = {
    'dawn_of_doubts': '疑惑之黎明',
    'light': '光明',
    'shadow_of_clouds': '云的阴影',
    'silence_of_soul': '灵魂的寂静',
    'humanity_of_hearts': '心灵的人性',
    'wisdom_of_differences': '差异的智慧',
    'unity': '统一',
    'unity_of_humanity': '人类的统一',
    'wall_of_greed': '贪婪之墙',
    'default': '旅程'
}

zh_data['game']['secret_mode'] = {
    'title': '秘密模式',
    'shoot_to_transform': '射击以转化',
    'avoid_eliminate_survive': '躲避 • 消灭 • 生存',
    'waiting_game': '⛵ 等待主游戏...',
    'starting_in': '开始于',
    'activated': '🎮 秘密模式已激活 - 射击可爱物体',
    'discovered': '🎉 秘密模式已发现 +100 XP - 射击可爱物体',
    'victory': '🏆 秘密胜利 - 摧毁物体：{count} - 总XP：+{xp}',
    'object_hit_positive': '🎉 {object} +{points} 分！',
    'object_hit_negative': '💔 {object} {points} 分！',
    'objects': {
        'baleine': '鲸鱼',
        'asteroide': '小行星',
        'etoile': '星星',
        'tank': '坦克',
        'lune': '月亮',
        'banane': '香蕉',
        'smartphone': '智能手机',
        'poubelle': '垃圾桶',
        'avion': '飞机'
    }
}

# Section narrative
zh_data['narrative'] = {
    'voyage_titles': {
        'phase1': '旅程 — 疑惑之黎明',
        'phase2': '旅程 — 光明',
        'phase3': '旅程 — 云的阴影',
        'phase4': '旅程 — 云的阴影',
        'phase5': '旅程 — 灵魂的寂静',
        'phase6': '旅程 — 灵魂的寂静',
        'phase7': '旅程 — 心灵的人性',
        'phase8': '旅程 — 心灵的人性',
        'phase9': '旅程 — 心灵的人性',
        'phase10': '旅程 — 差异的智慧',
        'phase11': '旅程 — 差异的智慧',
        'phase12': '旅程 — 差异的智慧',
        'phase13': '旅程 — 统一',
        'phase14': '旅程 — 统一',
        'phase15': '旅程 — 统一',
        'phase16': '人类的统一',
        'phase17': '旅程 — 贪婪之墙',
        'phase18': '旅程 — 自由的囚笼',
        'phase19': '旅程 — 拒绝的铁刺',
        'phase20': '旅程 — 黄金之门',
        'phase21': '旅程 — 自由的问题',
        'phase22': '旅程 — 浪潮的希望',
        'phase23': '启示'
    },
    'phase1': {
        'title': '疑惑之黎明\\n第1阶段',
        'intro_short': '他们告诉我那些人都是怪物...\\n他们对我说了那么多恶言，那么多关于他们的不幸...\\n但我宁愿亲眼去看。',
        'intro_full': '他们告诉我那些人都是\\n怪物...\\n他们对我说了那么多恶言，\\n那么多关于他们的\\n不幸...\\n但我，\\n宁愿亲眼去看...',
        'reaction': '不！我们不能让这样的事发生！',
        'text': '他们告诉我那些人都是\\n怪物...\\n他们对我说了那么多恶言，\\n那么多关于他们的\\n不幸...\\n但我，\\n宁愿亲眼去看...'
    },
    'phase2': {
        'text': '他们到底是谁？...\\n然后我看到了...\\n一位父亲...一位母亲...\\n孩子们...\\n所有人都只是想\\n过上最好的生活...\\n就像我一样。'
    },
    'phase3': {
        'text': '于是，月亮出现了。\\n天空变暗\\n像一页被时间\\n烧焦的纸。\\n一片鳍划破\\n黑暗的波浪...\\n闪电划过\\n灰色的云朵。\\n\\n随之而来的是苦难...\\n纷争...'
    },
    'phase4': {
        'text': '仇恨...\\n毁灭...\\n偷窃，谎言，\\n操纵...\\n贪婪和贪欲，\\n如同无形的锁链，\\n紧勒人们的心。'
    },
    'phase5': {
        'text': '他们告诉我不要听\\n他们的呼喊...\\n他们告诉我不要让\\n风暴让我恐惧。\\n因为风暴，\\n无论多么喧嚣，\\n永远不会\\n持续到永远。'
    },
    'phase6': {
        'text': '如果暴风雨咆哮，\\n也许是为了\\n提醒人类\\n在云层之上，\\n始终存在着\\n一道光。\\n但要看见它，\\n首先必须穿越\\n黑夜...'
    },
    'phase7': {
        'text': '他们告诉我...\\n人性已不存在，\\n它迷失在\\n战争和\\n怨恨之中。\\n他们告诉我人们\\n不再欢迎\\n任何人，\\n他们躲在\\n铁墙和\\n恐惧之后...'
    },
    'phase8': {
        'text': '但我看到了...\\n向陌生人伸出的手。\\n尽管饥饿\\n仍分享的微笑。\\n为那些在夜里\\n颤抖的人\\n打开的门...'
    },
    'phase9': {
        'text': '这就是\\n款待：\\n不是给予多余的，\\n而是分享\\n即使缺少的...'
    },
    'phase10': {
        'text': '他们告诉我自由\\n只是一个词，\\n一个强者\\n卖给弱者的幻觉。\\n但我看到了...\\n一个孩子在雨中\\n赤脚奔跑，\\n无拘无束地笑着，\\n在他的笑声中，\\n我明白了自由\\n首先活在灵魂里。'
    },
    'phase11': {
        'text': '他们告诉我人们\\n不再互助，\\n每个人都只为自己活。\\n但我看到了...\\n陌生人一起举起\\n一块太重的石头，\\n在这共享的力量中，\\n我看到了爱的诞生。'
    },
    'phase12': {
        'text': '他们告诉我爱\\n是脆弱的，\\n但我看到\\n它比仇恨\\n更强大，\\n因为它建造\\n当仇恨\\n毁灭时...'
    },
    'phase13': {
        'text': '他们告诉我宽容\\n是一种软弱，\\n但我看到它是\\n一种智慧：\\n承认\\n我们并非都\\n相同...\\n而这正是\\n生命的宝藏，\\n通往\\n和平的道路。'
    },
    'phase14': {
        'text': '多样性...\\n它不是危险，\\n它是宝藏。\\n就像\\n彩虹的颜色，\\n正是它们的差异\\n创造了美丽。'
    },
    'phase15': {
        'text': '在这人性的\\n融合中，\\n我明白了\\n我们是\\n一个民族，\\n被同样的\\n生存渴望，\\n创造，\\n和爱联系在一起。'
    },
    'phase16': {
        'text': '旅程开始了，\\n祝你一帆风顺。\\n\\n愿风永远带你更远，\\n到幸福自由的地方。\\n\\n到边界变成\\n承诺、希望、\\n新生活计划的地方。\\n\\n不要在\\n耸立在你面前的墙前停下\\n可怕而冰冷，\\n永不放弃，\\n打破墙壁，\\n打破恐惧、羞耻、怨恨、仇恨，\\n成为他人的灯塔。'
    },
    'phase17': {
        'text': '远处...我看到一堵墙。\\n一堵像伤疤一样矗立在海中的墙。\\n一堵不是由石头建成的墙，\\n而是由法律、文件和冷漠的目光建成。'
    },
    'phase18': {
        'text': '这堵墙是人类自由的囚笼。\\n它分隔了那些可以自由奔跑的人，\\n和那些被困在无形边界中的人。'
    },
    'phase19': {
        'text': '对穷人来说，它布满拒绝的铁刺，\\n像生锈的门一样紧闭。\\n他们用赤手敲打它，\\n他们的梦想被守卫的沉默打碎。'
    },
    'phase20': {
        'text': '对富人来说，它是一扇黄金之门。\\n它毫不费力地打开，\\n让他们像没有祖国的风一样自由通行。'
    },
    'phase21': {
        'text': '所以我在想...\\n自由真的是一种权利吗，\\n还是它已经变成了一种出售给出价最高者的特权？'
    },
    'phase22': {
        'text': '但在浪涛的心中，\\n大海低语着一个真理：\\n没有一堵墙是永恒的。\\n因为水终将磨穿顽石，\\n而自由，迟早，\\n会重归其途。'
    },
    'phase23': {
        'text': '👁️ 就这样，这段旅程结束了...\\n\\n你穿越了风暴，\\n打破了无知的墙，\\n发现真理\\n不是终点，\\n而是一条道路。\\n\\n每一个解开的谜题，\\n每一个做出的选择，\\n都让你更接近这个智慧：\\n\\n💫 我们都是\\n光明的守护者。\\n\\n多样性不是威胁，\\n而是最美的宝藏。\\n\\n⛵ 旅程继续...\\n在你的心中，在你的选择中，\\n在你看待世界的方式中。\\n\\n--Emmanuel Payet'
    },
    'walls_message': '这些墙是我们的，\\n我们通过冲突创造它们，\\n通过仇恨和种族主义，\\n对他人的不宽容，\\n对未知的恐惧。\\n\\n是我们，通过沉默和苦难，\\n通过低语的恐惧，\\n通过像石头一样投掷的言语，\\n让它们更加坚固。\\n\\n这些是自私的墙，\\n用本可以成为屋顶、\\n避难所、家园的东西建成。',
    'final_message': '人类不需要墙来保护自己，\\n而需要桥来相遇。\\n\\n让我们用爱建造，而不是用恐惧。\\n一个团结的世界胜过一个分隔的世界。\\n\\n- Emmanuel.gallery',
    'wall_crumbles': '✨ 墙壁最终崩塌 ✨'
}

print("Fichier zh.json reconstruit avec succès!")
print(f"Sections principales: {list(zh_data.keys())}")

# Sauvegarder
with open('modules/lang/zh.json', 'w', encoding='utf-8') as f:
    json.dump(zh_data, f, ensure_ascii=False, indent=2)
