import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# 1. Load features
df = pd.read_csv("free_text_features.csv")

print("Data preview:")
print(df.head())

# 2. Features + target
X = df[["typing_speed", "pause_ratio", "backspace_ratio", "mean_dwell", "timing_variance"]]
y = df["label"]

# 3. Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Evaluate
y_pred = model.predict(X_test)
print("\n📊 Model Performance:")
print(classification_report(y_test, y_pred))

# 6. Test on a sample
sample = [[0.1, 4.1, 0.1, 4.1, 0.1]]  
print("\nSample input prediction:", model.predict(sample))
