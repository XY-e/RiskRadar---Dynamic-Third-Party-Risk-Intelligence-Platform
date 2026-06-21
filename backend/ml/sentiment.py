"""
Sentiment analysis service.

Spec calls for cardiffnlp/twitter-roberta-base-sentiment via `transformers`. Downloading
that model isn't practical in this mock environment, so this module exposes the exact
same function signature with a lightweight keyword/heuristic scorer. To go live:

    from transformers import pipeline
    _pipe = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")
    def classify(text: str) -> tuple[str, float]:
        result = _pipe(text)[0]
        return result["label"], result["score"]

and keep everything else in the app unchanged.
"""
NEGATIVE_WORDS = {
    "fraud", "lawsuit", "breach", "corruption", "bribery", "bankruptcy",
    "investigation", "scandal", "violation", "penalty", "fine", "hack",
    "leak", "decline", "loss", "default", "sued", "probe",
}
POSITIVE_WORDS = {
    "growth", "expansion", "profit", "award", "partnership", "innovation",
    "record", "success", "launch", "milestone", "upgrade", "surge",
}


def classify(text: str) -> tuple[str, float]:
    words = set(text.lower().replace(",", "").replace(".", "").split())
    neg_hits = len(words & NEGATIVE_WORDS)
    pos_hits = len(words & POSITIVE_WORDS)
    score = pos_hits - neg_hits
    if score > 0:
        return "positive", min(0.5 + 0.15 * score, 0.97)
    if score < 0:
        return "negative", min(0.5 + 0.15 * abs(score), 0.97)
    return "neutral", 0.55
