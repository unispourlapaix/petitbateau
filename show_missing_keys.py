#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Affiche les clés manquantes pour une langue donnée"""

import json
import sys
import io

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_all_keys(data, prefix=''):
    """Récupère toutes les clés d'un dictionnaire de manière récursive"""
    keys = set()
    if isinstance(data, dict):
        for key, value in data.items():
            current_path = f"{prefix}.{key}" if prefix else key
            keys.add(current_path)
            keys.update(get_all_keys(value, current_path))
    return keys

# Charger FR et EN
with open('modules/lang/fr.json', 'r', encoding='utf-8') as f:
    fr_data = json.load(f)

with open('modules/lang/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

fr_keys = get_all_keys(fr_data)
en_keys = get_all_keys(en_data)

missing_in_en = sorted(fr_keys - en_keys)

print(f"\n📋 Clés manquantes dans EN (Anglais): {len(missing_in_en)}\n")
print("="*80)

for key in missing_in_en:
    print(f"  • {key}")

print("\n" + "="*80)
