#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script pour compléter toutes les énigmes manquantes dans zh.json
"""

import json

# Charger le fichier zh.json actuel
with open('modules/lang/zh.json', 'r', encoding='utf-8') as f:
    zh_data = json.load(f)

# Compléter toutes les énigmes manquantes
zh_data['enigmes']['faith'] = {
    'name': '信仰',
    'description': '在黑暗中指引的希望',
    'mystery': '当一切似乎失去时如何保持信仰？',
    'revelation': '信仰不是没有怀疑，而是尽管不确定仍决定继续。',
    'wisdom': '风暴，无论多么喧嚣，永远不会持续到永远。'
}

zh_data['enigmes']['respect'] = {
    'name': '尊重',
    'description': '赋予每个生命的尊严',
    'mystery': '如何尊重我们不理解的人？',
    'revelation': '尊重源于承认每个生命都承载着神圣的火花。',
    'wisdom': '他们躲在铁墙和恐惧之后...但人性仍然存在。'
}

zh_data['enigmes']['mutual_aid'] = {
    'name': '互助',
    'description': '团结的力量',
    'mystery': '为什么要帮助那些无法给我们任何东西的人？',
    'revelation': '在互助中，我们发现给予比接受更能丰富我们。',
    'wisdom': '爱，比所有障碍都强大，超越差异团结。'
}

zh_data['enigmes']['healing'] = {
    'name': '疗愈',
    'description': '治愈伤口的力量',
    'mystery': '如何治愈看不见的伤口？',
    'revelation': '真正的疗愈始于接受，继续于宽恕。',
    'wisdom': '如果暴风雨咆哮，是为了提醒在云层之上，始终存在一道光。'
}

zh_data['enigmes']['restoration'] = {
    'name': '恢复',
    'description': '毁灭后的重生',
    'mystery': '如何在毁灭之后重建？',
    'revelation': '每个结局都包含着新开始的种子。',
    'wisdom': '黑暗中的光...当我们选择爱时希望成为可能。'
}

zh_data['enigmes']['avarice'] = {
    'name': '贪婪',
    'description': '贪欲之墙',
    'mystery': '是什么在人们之间筑起了墙？',
    'revelation': '贪婪在爱本应建桥的地方建墙。',
    'wisdom': '一堵像伤疤一样矗立在海中的墙...一堵不是由石头建成的墙，而是由法律、文件和冷漠的目光建成。'
}

zh_data['enigmes']['prison_freedom'] = {
    'name': '自由的囚笼',
    'description': '无形的锁链',
    'mystery': '谁值得自由？',
    'revelation': '自由不是要分配的特权，而是要尊重的普遍权利。',
    'wisdom': '这堵墙是人类自由的囚笼。它分隔了那些可以自由奔跑的人，和那些被困在无形边界中的人。'
}

zh_data['enigmes']['refusal'] = {
    'name': '拒绝',
    'description': '拒绝的铁刺',
    'mystery': '为什么我们关上门？',
    'revelation': '每一次拒绝都是对我们共享的人性造成的伤害。',
    'wisdom': '铁刺和恐惧的铁丝...由那些忘记自己也曾是旅行者的人锻造。'
}

zh_data['enigmes']['pride'] = {
    'name': '骄傲',
    'description': '扭曲我们视角的自我',
    'mystery': '为什么我们将他人视为低等？',
    'revelation': '骄傲和自我让我们以不同的眼光看待更小或更穷的人，但我们在人性上都是平等的。',
    'wisdom': '一扇只为少数人打开的黄金之门...我们的自我让我们相信我们值得拥有它，而其他人不值得。'
}

zh_data['enigmes']['inequality'] = {
    'name': '不平等',
    'description': '命运的金字塔',
    'mystery': '为什么有些人承担着他人的负担？',
    'revelation': '不平等不是宿命，而是我们在沉默中延续的系统。',
    'wisdom': '一个堆叠的命运金字塔...下面的人承受着上面人的重量，没有人问这是否公正。'
}

zh_data['enigmes']['hope'] = {
    'name': '希望',
    'description': '无法被囚禁的自由',
    'mystery': '我们真的能囚禁自由吗？',
    'revelation': '我们无法阻止风去它想去的地方，也无法用墙限制天空中的星星，也无法阻止大海。',
    'wisdom': '在浪涛的心中，大海低语着一个真理：没有一堵墙是永恒的。因为水终将磨穿顽石，而自由，迟早，会重归其途。'
}

zh_data['enigmes']['lighthouse'] = {
    'name': '夜晚的灯塔',
    'description': '光明引导迷失的人',
    'mystery': '如何在黑暗中找到道路？',
    'revelation': '光明比黑夜更强大。即使是一小团火焰也能驱散最深的黑暗。',
    'wisdom': '在最黑暗的时刻，成为你所寻找的光。同情照亮即使是最黑暗的心。'
}

zh_data['enigmes']['lamp'] = {
    'name': '充满油的灯',
    'description': '照亮我们行为的爱',
    'mystery': '我们内在光明的源泉是什么？',
    'revelation': '爱照亮我们的行为。没有爱，我们只是虚无的影子。',
    'wisdom': '我们的行动只有在被爱引导时才有意义。是它将空虚转化为丰盈，将阴影转化为光明。'
}

zh_data['enigmes']['heart'] = {
    'name': '人类之心',
    'description': '我们共享人性的本质',
    'mystery': '是什么超越我们的差异将我们团结在一起？',
    'revelation': '在每个人的心中跳动着同样的爱，同样的希望，同样的恐惧。我们是一体的。',
    'wisdom': '旅程在它开始的地方结束：在心中。正是通过认识到我们共同的人性，我们才能找到真正的和平。'
}

zh_data['enigmes']['humanity_no_borders'] = {
    'name': '无国界的人性',
    'description': '超越墙的人性',
    'mystery': '边界定义了我们是谁吗？',
    'revelation': '人性不知道边界。我们都是在同一片土地上的旅行者。',
    'wisdom': '一位父亲，一位母亲，孩子们...只是想生活，就像我们所有人一样。'
}

zh_data['enigmes']['right_to_happiness'] = {
    'name': '幸福的权利',
    'description': '每个家庭的屋顶',
    'mystery': '谁值得拥有庇护所和幸福？',
    'revelation': '每个人都有权享受幸福，一个庇护所，一个屋顶。让我们用有用的墙建造房屋和桥梁，为需要的家庭建造爱的墙。',
    'wisdom': '墙不应该分隔，而应该保护。桥不应该分裂，而应该团结。'
}

zh_data['enigmes']['precious_life'] = {
    'name': '珍贵的生命',
    'description': '每个存在的价值',
    'mystery': '所有生命都有同样的价值吗？',
    'revelation': '每个生命都是珍贵的，无论它出生在这里还是别处。',
    'wisdom': '生命的衡量不在于它的起源，而在于它的本质。'
}

zh_data['enigmes']['communitarianism'] = {
    'name': '社群主义',
    'description': '宗派主义的危险',
    'mystery': '为什么我们的分裂削弱了我们？',
    'revelation': '在社会上很重要，但在独裁的偏离中很危险。我们到处都能找到社群主义，从政治及其分裂，从宗教到无神论教派。每个人都在进行他的战斗，用他的视野、他的心进行人的战斗。社群是好的，但没有宽容和尊重地摧毁他人的想法，无助于人类的进步。',
    'wisdom': '我们的政治和宗教宗派主义摧毁了桥梁，摧毁了和平。我们需要这种推动力来实现他人的项目，帮助成功，巩固而不是匆忙摧毁他人的想法。没有宽容，就没有进步。'
}

print(f'Enigmes completes! Total: {len(zh_data["enigmes"])} enigmes')

# Sauvegarder
with open('modules/lang/zh.json', 'w', encoding='utf-8') as f:
    json.dump(zh_data, f, ensure_ascii=False, indent=2)

print('Fichier zh.json completement mis a jour!')
