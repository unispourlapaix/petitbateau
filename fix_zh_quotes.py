#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Corriger tous les guillemets chinois dans zh.json"""

import json
import sys
import io

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("🔧 Correction des guillemets chinois dans zh.json\n")

# Lire le fichier
with open('modules/lang/zh.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Compter les guillemets chinois
chinese_quotes = content.count('"') + content.count('"')
print(f"📊 Guillemets chinois trouvés: {chinese_quotes}")

# Remplacer les guillemets chinois par des guillemets standards
content = content.replace('"', '\\"')
content = content.replace('"', '\\"')

# Écrire le fichier corrigé
with open('modules/lang/zh.json', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ Fichier corrigé!\n")

# Vérifier que c'est un JSON valide maintenant
try:
    with open('modules/lang/zh.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"✅ JSON valide - {len(data)} sections trouvées")
except Exception as e:
    print(f"❌ Erreur JSON: {str(e)}")
