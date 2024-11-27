import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ScanService implements OnModuleInit {
  private graphModel: tf.GraphModel;
  private layersModel: tf.LayersModel;
  private readonly classes = [
    'akar busuk',
    'busuk batang',
    'busuk daun',
    'hawar daun dan bunga',
    'karat daun',
    'powder mildew',
  ];

  async onModuleInit() {
    try {
      // Load Graph Model
      const graphModelPath = `file://${path.resolve(
        __dirname,
        '../../../models/graph-model/model.json',
      )}`;
      if (
        fs.existsSync(
          path.resolve(__dirname, '../../../models/graph-model/model.json'),
        )
      ) {
        this.graphModel = await tf.loadGraphModel(graphModelPath);
        console.log('Graph Model loaded successfully');
      }

      // Load Layers Model
      const layersModelPath = `file://${path.resolve(
        __dirname,
        '../../../models/layers-model/model.json',
      )}`;
      if (
        fs.existsSync(
          path.resolve(__dirname, '../../../models/layers-model/model.json'),
        )
      ) {
        this.layersModel = await tf.loadLayersModel(layersModelPath);
        console.log('Layers Model loaded successfully');
      }
    } catch (err) {
      console.error('Error loading models:', err);
    }
  }

  async preprocessImage(
    imageBuffer: Buffer,
    targetSize: [number, number] = [224, 224],
  ) {
    const tensor = tf.node.decodeImage(imageBuffer);
    const resized = tf.image.resizeBilinear(tensor, targetSize);
    const normalized = resized.div(255.0);
    const batched = normalized.expandDims(0);
    tensor.dispose();
    resized.dispose();
    return batched;
  }

  async predictImage(imageBuffer: Buffer, useGraphModel = true) {
    const model = useGraphModel ? this.graphModel : this.layersModel;
    if (!model)
      throw new Error(
        `Model not loaded for ${useGraphModel ? 'Graph' : 'Layers'} Model`,
      );

    const inputTensor = await this.preprocessImage(imageBuffer);
    const predictions = model.predict(inputTensor) as tf.Tensor<tf.Rank>;
    const predictionData = Array.from(predictions.dataSync());

    const predictedIndex = predictionData.indexOf(Math.max(...predictionData));
    const predictedClass = this.classes[predictedIndex];
    const confidence = predictionData[predictedIndex] * 100;

    const detailedPredictions = predictionData.map((p, i) => ({
      class: this.classes[i],
      confidence: `${(p * 100).toFixed(2)}%`,
    }));

    return {
      modelType: useGraphModel ? 'Graph Model' : 'Layers Model',
      class: predictedClass,
      confidence: `${confidence.toFixed(2)}%`,
      predictions: detailedPredictions,
    };
  }
}
