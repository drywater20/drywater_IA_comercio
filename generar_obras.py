import os
import json
import unicodedata

# Archivos a excluir
excluir = {"fondo.jpg", "header.jpg", "fondo_horizontal.jpg"}

# Estilos cíclicos
estilos = ["peces", "calamares", "varios", "otros"]

# Traducciones
traducciones = {
    "peces": {"es": "peces", "en": "fish", "fr": "poissons", "ja": "魚"},
    "calamares": {"es": "calamares", "en": "squids", "fr": "calmars", "ja": "イカ"},
    "varios": {"es": "varios", "en": "various", "fr": "divers", "ja": "様々な"},
    "otros": {"es": "otros", "en": "others", "fr": "autres", "ja": "その他"}
}

# Títulos y descripciones base (puedes personalizar)
titulos_base = [
    {"es": "Obra Marina {}", "en": "Marine Art {}", "fr": "Art Marin {}", "ja": "海洋アート {}"},
    {"es": "Profundidades {}", "en": "Depths {}", "fr": "Profondeurs {}", "ja": "深海 {}"},
    {"es": "Criatura del Abismo {}", "en": "Abyss Creature {}", "fr": "Créature de l'Abîme {}", "ja": "深海の生き物 {}"},
    {"es": "Reflejos del Océano {}", "en": "Ocean Reflections {}", "fr": "Reflets de l'Océan {}", "ja": "海の反射 {}"}
]

descs_base = [
    {"es": "Una representación artística del mundo submarino.", "en": "An artistic representation of the underwater world.", "fr": "Une représentation artistique du monde sous-marin.", "ja": "海底世界の芸術的な表現です。"},
    {"es": "Inspirado en especies marinas poco conocidas.", "en": "Inspired by lesser-known marine species.", "fr": "Inspiré par des espèces marines méconnues.", "ja": "あまり知られていない海洋生物にインスパイアされました。"}
]

# Obtener imágenes
imagenes_dir = "imagenes"
imagenes = [f for f in os.listdir(imagenes_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png')) and f.lower() not in excluir]

# Generar obras
obras = []
for i, img in enumerate(imagenes):
    estilo = estilos[i % len(estilos)]
    titulo = {lang: titulos_base[i % len(titulos_base)][lang].format(i+1) for lang in ["es", "en", "fr", "ja"]}
    descripcion = {lang: descs_base[i % len(descs_base)][lang] for lang in ["es", "en", "fr", "ja"]}
    
    obras.append({
        "id": f"obra_{i+1}",
        "imagen": f"imagenes/{img.lower()}",
        "titulo": titulo,
        "descripcion": descripcion,
        "estilo": estilo
    })

# Guardar en obras.json con UTF-8
with open("obras.json", "w", encoding="utf-8") as f:
    json.dump(obras, f, ensure_ascii=False, indent=2)

print(f"✅ {len(obras)} obras generadas y guardadas en obras.json (UTF-8)")