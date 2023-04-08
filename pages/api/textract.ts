import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { S3, Textract } from 'aws-sdk';
import formidable, { File } from 'formidable';
import { Configuration, OpenAIApi } from "openai";

// Configure AWS credentials
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

// Initialize S3 and Textract clients
const s3 = new S3(awsConfig);
const textract = new Textract(awsConfig);

const bucketName = process.env.AWS_S3_BUCKET_NAME;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  // Use formidable to parse the request
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      res.status(500).json({ message: 'Error parsing the request' });
      return;
    }

    const file = files.file as File;
    // Upload the file to S3
    const s3UploadParams = {
      Bucket: bucketName!,
      Key: `textract/${Date.now()}-${file.originalFilename}`,
      Body: await fs.promises.readFile(file.filepath),
    };

    try {
      const s3Response = await s3.upload(s3UploadParams).promise();
      // Call Textract to analyze the document
      const textractParams = {
        Document: {
          S3Object: {
            Bucket: `${bucketName}`,
            Name: s3Response.Key,
          },
        },
        FeatureTypes: ['TABLES', 'FORMS'],
      };
      console.log('textracting')
      const textractResponse = await textract.analyzeDocument(textractParams).promise();
      let text = '';
      textractResponse.Blocks?.forEach((block) => {
        let blockText = block.Text
        if (block.BlockType == 'LINE') {
          text += blockText;
        }
      });

      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{role: 'user', content: generatePrompt(text)}],
          temperature: 0.7,
          max_tokens: 2000
        });
        res.status(200).json({ result: completion.data.choices[0].message?.content});
      } catch(error) {
        // Consider adjusting the error handling logic for your use case
        console.log('sending to open ai')
        if (error.response) {
          console.error(error.response.status, error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
          res.status(500).json({
            error: {
              message: 'An error occurred during your request.',
            }
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred while processing the document' });
    }
  });
};

function generatePrompt(text: String) {
  return `Summarize this resume: ${text}`
}

export default handler;
