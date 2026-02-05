from transformers import pipeline

# Zero-shot classifier (no training needed)
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)

SECTOR_LABELS = [
    "Economics",
    "Politics",
    "Global Trade"
]


def classify_sector(text: str):
    if not text:
        return None

    result = classifier(
        text,
        SECTOR_LABELS,
        multi_label=False
    )

    return {
        "sector": result["labels"][0],
        "confidence": round(result["scores"][0], 3)
    }
