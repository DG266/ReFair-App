# Llama 3 Fine-tuning for ReFair
In this folder you can find the Jupyter Notebooks used to fine-tune [Llama-3-8B-Instruct](https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct).

Here's a brief description for each of them:
- **llama3_inference_transformers.ipynb**: this is a simple notebook that demonstrates how you can load the model (and the tokenizer) and generate some text using the [Transformers](https://huggingface.co/docs/transformers/index) library.
- **llama3_refair_finetuning.ipynb**: this is the most important notebook; it's the one that was used to fine-tune the model.
- **llama3_us_gen.ipynb**: this is the notebook that was used to generate the 680 user stories you can find in the "Generated user stories" folder.

You can find the fine-tuned model [here](https://huggingface.co/DG266/Llama-3-8B-Instruct-Refair-FAIRWAY).
