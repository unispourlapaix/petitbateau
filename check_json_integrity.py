#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Vérifie l'intégrité des fichiers JSON (pas de corruption)"""

import json
import sys
import io
import os

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def check_json_file(filepath):
    """Vérifie l'intégrité d'un fichier JSON"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Vérifier la taille
        size_kb = len(content) / 1024

        # Parser le JSON
        data = json.loads(content)

        # Compter les clés
        def count_keys(obj):
            count = 0
            if isinstance(obj, dict):
                count += len(obj)
                for value in obj.values():
                    count += count_keys(value)
            elif isinstance(obj, list):
                for item in obj:
                    count += count_keys(item)
            return count

        total_keys = count_keys(data)

        # Vérifier les caractères bizarres ou corruption
        issues = []

        # Vérifier si le JSON peut être ré-encodé
        try:
            json.dumps(data, ensure_ascii=False)
        except Exception as e:
            issues.append(f"Impossible de ré-encoder: {str(e)}")

        # Vérifier la présence de sections principales
        expected_sections = ['meta', 'ui', 'game', 'narrative', 'interface', 'bricks', 'enigmes', 'levels']
        missing_sections = [s for s in expected_sections if s not in data]

        if missing_sections:
            issues.append(f"Sections manquantes: {', '.join(missing_sections)}")

        return {
            'valid': True,
            'size_kb': size_kb,
            'total_keys': total_keys,
            'sections': len(data),
            'issues': issues
        }

    except json.JSONDecodeError as e:
        return {
            'valid': False,
            'error': f"Erreur JSON ligne {e.lineno} col {e.colno}: {e.msg}",
            'position': f"Position {e.pos}"
        }
    except UnicodeDecodeError as e:
        return {
            'valid': False,
            'error': f"Erreur d'encodage: {str(e)}"
        }
    except Exception as e:
        return {
            'valid': False,
            'error': f"Erreur: {str(e)}"
        }

print("\n🔍 VÉRIFICATION D'INTÉGRITÉ DES FICHIERS JSON\n")
print("="*80)
print(f"{'FICHIER':<12} {'État':<8} {'Taille':<10} {'Clés':<8} {'Sections':<10}")
print("="*80)

lang_dir = 'modules/lang'
lang_files = sorted([f for f in os.listdir(lang_dir) if f.endswith('.json')])

valid_files = []
corrupted_files = []

for lang_file in lang_files:
    lang_code = lang_file.replace('.json', '').upper()
    filepath = os.path.join(lang_dir, lang_file)

    result = check_json_file(filepath)

    if result['valid']:
        status = "✅"
        if result['issues']:
            status = "⚠️"

        valid_files.append(lang_file)

        print(f"{lang_code:<12} {status:<8} {result['size_kb']:>6.1f} KB  {result['total_keys']:>6}   {result['sections']:>3} sections")

        if result['issues']:
            for issue in result['issues']:
                print(f"             ⚠️  {issue}")
    else:
        corrupted_files.append(lang_file)
        print(f"{lang_code:<12} ❌ CORROMPU")
        print(f"             {result['error']}")
        if 'position' in result:
            print(f"             {result['position']}")

print("="*80)

print(f"\n📊 RÉSUMÉ:")
print(f"   ✅ Fichiers valides: {len(valid_files)}")
print(f"   ❌ Fichiers corrompus: {len(corrupted_files)}")

if corrupted_files:
    print(f"\n⚠️  FICHIERS CORROMPUS À CORRIGER:")
    for f in corrupted_files:
        print(f"      • {f}")

print("\n" + "="*80 + "\n")
