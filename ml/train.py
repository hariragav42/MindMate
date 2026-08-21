import pandas as pd
import numpy as np
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Ensure artifacts directory exists
os.makedirs('artifacts', exist_ok=True)

def generate_dummy_data(num_samples=1000):
    np.random.seed(42)
    data = []
    for _ in range(num_samples):
        # Q3 to Q9 (1-5 scale)
        q3, q4, q6, q7, q8, q9 = np.random.randint(1, 6, size=6)
        
        # Sleep Q5
        sleep_opts = ["<5", "5–6", "6–7", "7–8", ">8"]
        q5 = np.random.choice(sleep_opts)
        
        # Calculate penalty
        if q5 == "<5": penalty = 1.0
        elif q5 == "5–6": penalty = 0.5
        elif q5 == "6–7": penalty = 0.25
        else: penalty = 0.0
        
        # Calculate index
        index = np.mean([q3, q4, q6, q7, q8, q9]) + penalty
        
        # Assign label based on rubric
        if index < 2.6:
            label = "Low"
        elif 2.6 <= index <= 3.6:
            label = "Moderate"
        else:
            label = "High"
            
        data.append({
            "Q3": q3, "Q4": q4, "Q6": q6, "Q7": q7, "Q8": q8, "Q9": q9,
            "Q5": q5,
            "label": label
        })
        
    return pd.DataFrame(data)

def train_model():
    print("Generating dataset based on rubric...")
    df = generate_dummy_data(2000)
    print(f"Dataset generated. Shape: {df.shape}")
    print("Class distribution:\n", df['label'].value_counts())
    
    X = df.drop("label", axis=1)
    y = df["label"]
    
    # Define preprocessing
    numeric_features = ["Q3", "Q4", "Q6", "Q7", "Q8", "Q9"]
    categorical_features = ["Q5"]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
        
    # Define model
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    
    # Create Pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Training model...")
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    
    # Save model artifact
    model_path = 'artifacts/model.pkl'
    with open(model_path, 'wb') as f:
        pickle.dump(pipeline, f)
        
    print(f"Model saved to {model_path}")
    
    # Save meta information for versioning
    meta = {"version": "1.0.0", "features": list(X.columns)}
    with open('artifacts/meta.json', 'w') as f:
        import json
        json.dump(meta, f)

if __name__ == "__main__":
    train_model()
