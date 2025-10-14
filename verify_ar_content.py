#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Vérifie le contenu réel des traductions arabes"""

import json
import sys
import io

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('modules/lang/fr.json', 'r', encoding='utf-8') as f:
    fr_data = json.load(f)

with open('modules/lang/ar.json', 'r', encoding='utf-8') as f:
    ar_data = json.load(f)

def check_value(obj, path=''):
    """Vérifie si une valeur est traduite ou juste copiée du français"""
    issues = []

    if isinstance(obj, dict):
        for key, value in obj.items():
            new_path = f"{path}.{key}" if path else key
            issues.extend(check_value(value, new_path))
    elif isinstance(obj, str):
        # Vérifier si c'est vide ou identique au français
        fr_value = None
        try:
            parts = path.split('.')
            temp = fr_data
            for part in parts:
                temp = temp[part]
            fr_value = temp
        except:
            pass

        if obj == '':
            issues.append(f"⚠️  VIDE: {path}")
        elif fr_value and obj == fr_value and len(obj) > 3:
            # Ignorer les codes courts (fr, en, etc.)
            if not any(x in path for x in ['languages.', 'multilang_intro.']):
                issues.append(f"🔄 IDENTIQUE FR: {path} = '{obj}'")

    return issues

print("\n🔍 VÉRIFICATION DU CONTENU AR (Arabe)\n")
print("="*80)

issues = check_value(ar_data)

if issues:
    print(f"\n⚠️  {len(issues)} problèmes détectés:\n")
    for issue in issues[:20]:  # Montrer les 20 premiers
        print(f"  {issue}")
    if len(issues) > 20:
        print(f"\n  ... et {len(issues) - 20} autres problèmes")
else:
    print("✅ Aucun problème détecté - toutes les traductions semblent correctes!")

print("\n" + "="*80)
