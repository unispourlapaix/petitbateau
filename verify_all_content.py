#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Vérifie le contenu réel de TOUTES les traductions"""

import json
import sys
import io
import os

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def check_translation_quality(fr_data, lang_data, lang_code):
    """Vérifie la qualité d'une traduction"""

    def get_value(obj, path):
        """Récupère une valeur depuis un chemin"""
        try:
            parts = path.split('.')
            temp = obj
            for part in parts:
                temp = temp[part]
            return temp
        except:
            return None

    def get_all_text_paths(obj, path=''):
        """Récupère tous les chemins vers des textes"""
        paths = []
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_path = f"{path}.{key}" if path else key
                paths.extend(get_all_text_paths(value, new_path))
        elif isinstance(obj, str):
            paths.append(path)
        return paths

    all_paths = get_all_text_paths(fr_data)

    empty_count = 0
    identical_count = 0
    translated_count = 0

    ignore_paths = ['languages.', 'multilang_intro.', 'artist.platform', '_link', '_label']

    for path in all_paths:
        fr_value = get_value(fr_data, path)
        lang_value = get_value(lang_data, path)

        if lang_value is None:
            continue

        # Ignorer les URLs, codes de langue, etc.
        if any(x in path for x in ignore_paths):
            continue

        if lang_value == '':
            empty_count += 1
        elif fr_value and lang_value == fr_value and len(str(fr_value)) > 5:
            identical_count += 1
        else:
            translated_count += 1

    total = empty_count + identical_count + translated_count
    if total == 0:
        return {'error': 'Aucune donnée'}

    return {
        'empty': empty_count,
        'identical': identical_count,
        'translated': translated_count,
        'quality_score': (translated_count / total * 100) if total > 0 else 0
    }

# Charger le français
with open('modules/lang/fr.json', 'r', encoding='utf-8') as f:
    fr_data = json.load(f)

# Vérifier toutes les langues
lang_files = sorted([f for f in os.listdir('modules/lang') if f.endswith('.json')])

print("\n🔍 VÉRIFICATION DE LA QUALITÉ DES TRADUCTIONS\n")
print("="*80)
print(f"{'LANG':<6} {'Qualité':<8} {'Traduit':<10} {'Identique':<10} {'Vide':<8}")
print("="*80)

results = {}

for lang_file in lang_files:
    if lang_file == 'fr.json':
        continue

    lang_code = lang_file.replace('.json', '')

    try:
        with open(f'modules/lang/{lang_file}', 'r', encoding='utf-8') as f:
            lang_data = json.load(f)

        result = check_translation_quality(fr_data, lang_data, lang_code)
        results[lang_code] = result

        if 'error' in result:
            print(f"{lang_code.upper():<6} ❌ ERREUR: {result['error']}")
        else:
            quality = result['quality_score']
            status = "✅" if quality >= 95 else "⚠️" if quality >= 80 else "❌"

            print(f"{lang_code.upper():<6} {status} {quality:5.1f}%  "
                  f"{result['translated']:<10} {result['identical']:<10} {result['empty']:<8}")

    except json.JSONDecodeError as e:
        print(f"{lang_code.upper():<6} ❌ ERREUR JSON: {str(e)[:40]}")
        results[lang_code] = {'error': f'JSON invalide: {str(e)[:40]}'}
    except Exception as e:
        print(f"{lang_code.upper():<6} ❌ ERREUR: {str(e)[:40]}")
        results[lang_code] = {'error': str(e)[:40]}

print("="*80)

# Résumé
excellent = [k for k, v in results.items() if 'quality_score' in v and v['quality_score'] >= 95]
good = [k for k, v in results.items() if 'quality_score' in v and 80 <= v['quality_score'] < 95]
poor = [k for k, v in results.items() if 'quality_score' in v and v['quality_score'] < 80]
errors = [k for k, v in results.items() if 'error' in v]

print(f"\n📊 RÉSUMÉ:")
print(f"   ✅ Excellentes (≥95%): {len(excellent)} - {', '.join(excellent).upper()}")
print(f"   ⚠️  Bonnes (80-95%): {len(good)} - {', '.join(good).upper()}")
print(f"   ❌ Faibles (<80%): {len(poor)} - {', '.join(poor).upper()}")
if errors:
    print(f"   ⚠️  Erreurs: {len(errors)} - {', '.join(errors).upper()}")

print("\n" + "="*80 + "\n")
