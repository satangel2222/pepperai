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
    enable_safety_checker?: boolean;
    seed?: number;
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
    enable_safety_checker?: boolean;
    seed?: number;
    loras?: Array<{
        path: string;
        scale: number;
    }>;
}

export interface ImageToVideoParams {
    image_url: string;
    prompt: string;
    negative_prompt?: string;
    duration?: '5' | '10';
    resolution?: '480p' | '720p' | '1080p';
    enable_safety_checker?: boolean;
    enable_prompt_expansion?: boolean;
    audio_url?: string;
    seed?: number;
}

export interface LoRATrainingParams {
    image_data_url: string;
    steps?: number;
    learning_rate?: number;
    training_type?: 'content' | 'style' | 'balanced';
    default_caption?: string;
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
                enable_safety_checker: params.enable_safety_checker ?? false, // Spicy mode ON by default
                seed: params.seed,
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

// Image to Image with LoRA support
export async function generateImageToImage(params: ImageToImageParams) {
    try {
        const result = await fal.subscribe('fal-ai/z-image/turbo/image-to-image/lora', {
            input: {
                image_url: params.image_url,
                prompt: params.prompt,
                negative_prompt: params.negative_prompt || '',
                strength: params.strength || 0.8,
                num_inference_steps: params.num_inference_steps || 4,
                guidance_scale: params.guidance_scale || 3.5,
                enable_safety_checker: params.enable_safety_checker ?? false, // Spicy mode ON by default
                seed: params.seed,
                loras: params.loras || [],
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
                negative_prompt: params.negative_prompt || 'low resolution, error, worst quality, low quality, defects',
                duration: params.duration || '5',
                resolution: params.resolution || '1080p',
                enable_safety_checker: params.enable_safety_checker ?? false, // Spicy mode ON by default
                enable_prompt_expansion: params.enable_prompt_expansion ?? true,
                audio_url: params.audio_url,
                seed: params.seed,
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
                image_data_url: params.image_data_url, // Fixed: was images_data_url
                steps: params.steps || 1000, // Fixed: default was 3000, should be 1000
                learning_rate: params.learning_rate || 0.0001,
                training_type: params.training_type || 'balanced',
                default_caption: params.default_caption,
            },
            logs: true,
        });
        return result;
    } catch (error) {
        console.error('LoRA training failed:', error);
        throw error;
    }
}
