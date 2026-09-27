from datasets import load_dataset

# Load the dataset directly from Hugging Face
dataset = load_dataset("JDRJ/kjv-bible")

# Convert the 'train' split to a CSV file
dataset['train'].to_csv("kjv-bible.csv", index=False)
print("Download and conversion complete!")