import { PaperAnalysis } from './types';

export const MOCK_ANALYSIS: PaperAnalysis = {
  paper_profile: {
    type: "method",
    domain: ["NLP"],
    has_experiments: true,
    has_dataset: true,
    has_ablation: true,
    figure_count: 5,
    table_count: 3,
    formula_density: "medium",
    tone: "popular_science",
    confidence: "high"
  },
  theme: {
    style: "minimal_white",
    accent: "blue",
    hero_variant: "standard",
    illustration_policy: "subtle",
    image_prompt: {
      enabled: true,
      prompt: "A conceptual illustration of a neural network processing text data, clean lines, blue and white color scheme, minimal style",
      negative_prompt: "cluttered, messy, realistic, dark",
      aspect_ratio: "16:9",
      style_tags: ["clean", "minimal", "scientific", "editorial"]
    }
  },
  core: {
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin",
    year: "2017",
    venue: "NIPS",
    one_sentence_summary: "A new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
    tldr: [
      "Introduces the Transformer architecture based solely on attention mechanisms.",
      "Achieves state-of-the-art results on English-to-German and English-to-French translation tasks.",
      "Significantly faster to train than architectures based on recurrent or convolutional layers."
    ],
    key_contributions: [
      "Proposed a new network architecture, the Transformer, based solely on attention mechanisms.",
      "Demonstrated that the Transformer generalizes well to other tasks.",
      "Established a new state of the art in machine translation."
    ],
    keywords: ["Transformer", "Attention Mechanism", "NLP", "Machine Translation"]
  },
  sections: {
    problem: "Recurrent neural networks, long short-term memory, and gated recurrent neural networks have been established as state of the art approaches in sequence modeling and transduction problems. However, their sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths.",
    background: "Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences. In all but a few cases, however, such attention mechanisms are used in conjunction with a recurrent network.",
    method: {
      overview: "The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder.",
      steps: [
        "Encoder: Composed of a stack of N=6 identical layers, each with two sub-layers: multi-head self-attention and position-wise fully connected feed-forward network.",
        "Decoder: Also composed of a stack of N=6 identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output of the encoder stack.",
        "Attention: An attention function can be described as mapping a query and a set of key-value pairs to an output."
      ],
      components: [
        "Scaled Dot-Product Attention",
        "Multi-Head Attention",
        "Position-wise Feed-Forward Networks",
        "Positional Encoding"
      ]
    },
    experiments: {
      setup: "The Transformer was trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs and the WMT 2014 English-French dataset consisting of 36M sentences.",
      datasets: ["WMT 2014 English-German", "WMT 2014 English-French"],
      metrics: ["BLEU score"],
      baselines: ["ConvS2S", "ByteNet", "GNMT+RL", "MoE"],
      results: [
        "On the WMT 2014 English-to-German translation task, the big Transformer model (Transformer (big)) outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4.",
        "On the WMT 2014 English-to-French translation task, our big model achieves a BLEU score of 41.0, outperforming all of the previously published single models, at less than 1/4 the training cost of the previous state-of-the-art model."
      ]
    },
    limitations: [
      "The model is autoregressive, which limits inference speed.",
      "Requires significant computational resources for training the largest models.",
      "Positional encodings are fixed, which may limit generalization to sequence lengths longer than those seen during training."
    ],
    figures_explained: [
      { "figure": "Fig 1", "explanation": "The Transformer - model architecture. The encoder is on the left, the decoder is on the right." }
    ],
    glossary: [
      { "term": "Self-Attention", "meaning": "An attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence." },
      { "term": "BLEU", "meaning": "Bilingual Evaluation Understudy, a metric for evaluating a generated sentence to a reference sentence." }
    ]
  },
  layout: [
    { "block": "hero" },
    { "block": "paper_badges" },
    { "block": "one_sentence" },
    { "block": "key_takeaways", "count": 3 },
    { "block": "method_overview" },
    { "block": "experiments" },
    { "block": "figures" },
    { "block": "limitations" },
    { "block": "glossary" },
    { "block": "qa" }
  ]
};
