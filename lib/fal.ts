import * as fal from '@fal-ai/serverless-client';

// Configure fal.ai client
fal.config({
    credentials: process.env.FAL_KEY,
});

export interface TextToImageParams {
    prompt: string;
    image_size?: string;
    num_inference_steps?: number;
    guidance_scale?: number;
    num_images?: number;
    loras?: Array<{
        path: string;
        scale: number;
    }>;
}

export interface ImageToImageParams {
    image_url: string;
    prompt: string;
    negative_prompt?: string;
    strength?: number;
    num_inference_steps?: number;
    guidance_scale?: number;
}

export interface ImageToVideoParams {
    image_url: string;
    prompt: string;
    duration?: number;
    resolution?: string;
}

export interface LoRATrainingParams {
    images_data_url: string;
    trigger_word: string;
    steps?: number;
}

// Text to Image with LoRA support
export async function generateTextToImage(params: TextToImageParams) {
    try {
        const result = await fal.subscribe('fal-ai/z-image/turbo/lora', {
            input: {
                prompt: params.prompt,
                image_size: params.image_size || '1024x1024',
                num_inference_steps: params.num_inference_steps || 4,
                guidance_scale: params.guidance_scale || 3.5,
                num_images: params.num_images || 1,
                loras: params.loras || [],
            },
            logs: true,
        });
        return result;
    } catch (error) {
        console.error('Text to image generation failed:', error);
        throw error;
    }
}

// Image to Image
export async function generateImageToImage(params: ImageToImageParams) {
    try {
        const result = await fal.subscribe('fal-ai/z-image/turbo/image-to-image', {
            input: {
                image_url: params.image_url,
                prompt: params.prompt,
                negative_prompt: params.negative_prompt || '',
                strength: params.strength || 0.8,
                num_inference_steps: params.num_inference_steps || 4,
                guidance_scale: params.guidance_scale || 3.5,
            },
            logs: true,
        });
        return result;
    } catch (error) {
        console.error('Image to image generation failed:', error);
        throw error;
    }
}

// Image to Video
export async function generateImageToVideo(params: ImageToVideoParams) {
    try {
        const result = await fal.subscribe('fal-ai/wan-25-preview/image-to-video', {
            input: {
                image_url: params.image_url,
                prompt: params.prompt,
                duration: params.duration || 5,
                resolution: params.resolution || '720p',
            },
            logs: true,
        });
        return result;
    } catch (error) {
        console.error('Image to video generation failed:', error);
        throw error;
    }
}

// LoRA Training
export async function trainLoRA(params: LoRATrainingParams) {
    try {
        const result = await fal.subscribe('fal-ai/z-image-trainer', {
            input: {
                images_data_url: params.images_data_url,
                trigger_word: params.trigger_word,
                steps: params.steps || 3000,
            },
            logs: true,
        });
        return result;
    } catch (error) {
        console.error('LoRA training failed:', error);
        throw error;
    }
}
