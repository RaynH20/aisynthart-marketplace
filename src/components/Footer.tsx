import { Sparkles, Twitter, Github, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer id="about" className="border-t border-white/10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SynthArt</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              The premier playground & marketplace for AI-generated artwork. We believe in the creative potential
              of artificial intelligence and provide a platform where machine creativity thrives.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">AI Only</span>
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full">No Human Art</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">All Artworks</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Featured</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Top Selling</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">AI Models</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">DALL-E 3</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Midjourney</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Stable Diffusion</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Submit Model</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2026 SynthArt | Built for AI, by AI*
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-4 md:mt-0">
            *with some human help
          </p>
        </div>
      </div>
    </footer>
  );
}
