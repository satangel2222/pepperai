import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CREDIT_PACKAGES } from '@/lib/stripe';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-float">
            Fast AI Generation
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200">
              with Custom LoRAs
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Create stunning images and videos with AI. Train your own LoRA models.
            <br />
            <strong>25% cheaper than competitors!</strong>
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/artroom">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Creating
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Powerful AI Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Text to Image</h3>
              <p className="text-gray-600">
                Generate high-quality images from text prompts. Support for Standard, 4K, and 8K resolutions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Image to Image</h3>
              <p className="text-gray-600">
                Transform existing images with AI. Control strength, steps, and guidance for perfect results.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Image to Video</h3>
              <p className="text-gray-600">
                Bring images to life with AI-powered video generation. Multiple resolutions and durations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow md:col-span-3">
              <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">LoRA Model Training</h3>
              <p className="text-gray-600 text-center max-w-2xl mx-auto">
                Train custom LoRA models with your own images. Create unique styles and characters for your generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Affordable Pricing
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            25% cheaper than MirrorRim!
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white p-6 rounded-2xl shadow-lg ${pkg.popular ? 'ring-2 ring-primary-500' : ''
                  }`}
              >
                {pkg.popular && (
                  <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                )}
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900">
                    ${pkg.price}
                  </div>
                  <div className="text-gray-600 mt-1">{pkg.credits} Credits</div>
                  <div className="text-sm text-gray-500 mt-2">
                    ${(pkg.price / pkg.credits).toFixed(2)} per credit
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button size="lg">View All Plans</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
