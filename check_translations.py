#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vérification de la complétude des traductions
Compare toutes les langues avec le français (référence)
"""

import json
import os
from pathlib import Path

def load_json(filepath):
    """Charge un fichier JSON"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_all_keys(data, prefix=''):
    """Récupère toutes les clés d'un dictionnaire de manière récursive"""
    keys = set()
    if isinstance(data, dict):
        for key, value in data.items():
            current_path = f"{prefix}.{key}" if prefix else key
            keys.add(current_path)
            keys.update(get_all_keys(value, current_path))
    return keys

def check_translation_completeness(lang_dir='modules/lang'):
    """Vérifie la complétude de toutes les traductions"""

    # Charger le fichier de référence (français)
    fr_path = os.path.join(lang_dir, 'fr.json')
    fr_data = load_json(fr_path)
    fr_keys = get_all_keys(fr_data)

    print(f"📚 Référence FR : {len(fr_keys)} clés\n")
    print("="*80)

    # Vérifier tous les autres fichiers
    lang_files = sorted([f for f in os.listdir(lang_dir) if f.endswith('.json')])

    results = {}

    for lang_file in lang_files:
        if lang_file == 'fr.json':
            continue

        lang_code = lang_file.replace('.json', '')
        lang_path = os.path.join(lang_dir, lang_file)

        try:
            lang_data = load_json(lang_path)
            lang_keys = get_all_keys(lang_data)

            # Clés manquantes
            missing_keys = fr_keys - lang_keys
            # Clés en trop
            extra_keys = lang_keys - fr_keys

            completion_rate = (len(lang_keys & fr_keys) / len(fr_keys)) * 100

            results[lang_code] = {
                'total_keys': len(lang_keys),
                'missing_keys': missing_keys,
                'extra_keys': extra_keys,
                'completion_rate': completion_rate
            }

            # Affichage
            status = "✅" if completion_rate == 100 else "⚠️" if completion_rate >= 95 else "❌"
            print(f"{status} {lang_code.upper():4} : {completion_rate:6.2f}% | "
                  f"{len(lang_keys):4} clés | "
                  f"Manquantes: {len(missing_keys):3} | "
                  f"En trop: {len(extra_keys):3}")

            # Afficher les clés manquantes si présentes
            if missing_keys and len(missing_keys) <= 10:
                for key in sorted(missing_keys):
                    print(f"        ↳ Manquante: {key}")
            elif missing_keys:
                print(f"        ↳ {len(missing_keys)} clés manquantes (trop pour les afficher)")

        except Exception as e:
            print(f"❌ {lang_code.upper():4} : ERREUR - {str(e)}")
            results[lang_code] = {'error': str(e)}

    print("="*80)

    # Résumé
    complete_langs = [lang for lang, data in results.items()
                      if 'completion_rate' in data and data['completion_rate'] == 100]
    incomplete_langs = [lang for lang, data in results.items()
                        if 'completion_rate' in data and data['completion_rate'] < 100]

    print(f"\n📊 RÉSUMÉ:")
    print(f"   ✅ Langues complètes (100%): {len(complete_langs)}")
    if complete_langs:
        print(f"      {', '.join(sorted(complete_langs)).upper()}")

    print(f"   ⚠️  Langues incomplètes: {len(incomplete_langs)}")
    if incomplete_langs:
        print(f"      {', '.join(sorted(incomplete_langs)).upper()}")

    return results

if __name__ == '__main__':
    import sys
    import io
    # Fix Windows encoding
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n🔍 VÉRIFICATION DE LA COMPLÉTUDE DES TRADUCTIONS\n")
    results = check_translation_completeness()
    print("\n✅ Vérification terminée!\n")
