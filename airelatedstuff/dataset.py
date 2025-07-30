from datasets import load_dataset

# Load dataset
dataset = load_dataset("opennyaiorg/InJudgements_dataset")

# Save it locally to disk
dataset.save_to_disk("./InJudgements_dataset")
