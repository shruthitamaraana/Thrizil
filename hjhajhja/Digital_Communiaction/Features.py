import pandas as pd
import numpy as np

# 1. Load CSV with safe options
df = pd.read_csv(
    r"C:\Users\Bhagya\Desktop\Hackathons\Thrizll\free-text.csv",
    low_memory=False
)

# 2. Clean column names (remove spaces)
df.columns = df.columns.str.strip()
print("Available columns:", df.columns.tolist())

# 3. Force numeric on timing columns
timing_cols = ["DU.key1.key1", "DD.key1.key2", "DU.key1.key2", "UD.key1.key2", "UU.key1.key2"]
for col in timing_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")  # convert bad strings to NaN

# 4. Feature extraction per (participant, session)
session_features = []
for (participant, session), group in df.groupby(["participant", "session"]):
    total_chars = len(group)
    total_time = group["DD.key1.key2"].clip(lower=0).sum() + 1e-6  # avoid divide by zero

    typing_speed = total_chars / total_time
    pause_count = (group["DD.key1.key2"] > 1.0).sum()
    pause_ratio = pause_count / max(1, len(group))
    backspace_count = (group["key1"] == "Backspace").sum()
    backspace_ratio = backspace_count / max(1, total_chars)

    mean_dwell = group["DU.key1.key1"].mean(skipna=True)
    timing_variance = group[timing_cols].var().mean(skipna=True)

    session_features.append([
        participant, session, typing_speed, pause_ratio, backspace_ratio,
        mean_dwell, timing_variance
    ])

# 5. Features DataFrame
features_df = pd.DataFrame(session_features, columns=[
    "participant", "session", "typing_speed", "pause_ratio", "backspace_ratio",
    "mean_dwell", "timing_variance"
])

# 6. Synthetic labels
def label_mood(row):
    if row["pause_ratio"] > 0.2 or row["backspace_ratio"] > 0.2:
        return "hesitant"
    elif row["typing_speed"] > 5 and row["pause_ratio"] < 0.1:
        return "confident"
    elif 2 < row["typing_speed"] <= 5 and row["backspace_ratio"] < 0.1:
        return "interested"
    else:
        return "neutral"

features_df["label"] = features_df.apply(label_mood, axis=1)

# 7. Save output
features_df.to_csv(r"C:\Users\Bhagya\Desktop\Hackathons\Thrizll\free_text_features.csv", index=False)
print("✅ Features saved to free_text_features.csv")
print(features_df.head())
