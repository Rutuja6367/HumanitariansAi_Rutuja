import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import PrimaryButton from "@/components/ui/primary-button"
import SecondaryButton from "@/components/ui/secondary-button"

export const metadata: Metadata = {
  title: "Botspeak - Humanitarians AI",
  description: "Exploring the fascinating world of AI through hands-on projects and in-depth demos",
}

export default function BotspeakPage() {
  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Botspeak</h1>
          {/* <p className="text-xl text-muted-foreground mb-8">
            Empowering individuals through the transformative power of AI fluency, fostering effective human-AI collaboration. An innovative program that combines theoretical frameworks with practical skills to enhance your ability to work with AI systems.
          </p> */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/LeZpm76Eszc?si=_PwdhcxEHn_tBs-V"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-12">
<section>
  <h2 className="text-3xl font-bold mb-6">About the Project</h2>
  <div className="prose prose-lg dark:prose-invert">
    <p>
      Botspeak is a comprehensive AI fluency framework that transforms you from an AI tourist into a fluent native. Through our YouTube series, books, and articles, we cultivate your ability to think alongside AI, distributing cognitive tasks strategically, communicating intentions clearly, evaluating outputs critically, and using these powerful tools responsibly.
    </p>
    
    <p>
      Led by Dr. Nik Bear Brown, Associate Teaching Professor at Northeastern University, our show-and-tell approach demonstrates these skills through practical AI project development, giving you both theoretical understanding and hands-on experience.
    </p>
    
    <h3 className="text-xl font-bold mt-6 mb-3">The Nine Pillars of Botspeak</h3>
    
    <p>
      Our framework is built on nine essential pillars that will remain relevant as AI technology continues to evolve:
    </p>
    
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">1. Strategic Delegation</h4>
        <p className="text-sm">Thoughtfully distributing tasks between human and AI based on comparative strengths.</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">2. Effective Communication</h4>
        <p className="text-sm">Crafting precise prompts with clear intent and context for optimal AI response.</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">3. Critical Evaluation</h4>
        <p className="text-sm">Systematically assessing AI outputs for accuracy and bias through multiple sources.</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">4. Technical Understanding</h4>
        <p className="text-sm">Applying appropriate prompt patterns and understanding model behavior.</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">5. Ethical Reasoning</h4>
        <p className="text-sm">Maintaining accountability and managing privacy boundaries in AI collaboration.</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">6. Stochastic Reasoning</h4>
        <p className="text-sm">Understanding the probabilistic nature of AI outputs and embracing variability.</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">7. Learning by Doing</h4>
        <p className="text-sm">Building intuition through deliberate practice and systematic analysis.</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">8. Rapid Prototyping</h4>
        <p className="text-sm">Accelerating ideation through quick cycles of AI-assisted generation and refinement.</p>
      </div>
      
      <div className="p-4 border rounded-lg md:col-span-2 flex justify-center">
        <div className="p-4 border rounded-lg max-w-md">
          <h4 className="font-bold">9. Theoretical Foundations</h4>
          <p className="text-sm">Understanding the science behind AI systems and recognizing their fundamental epistemological boundaries.</p>
        </div>
      </div>
    </div>
    
    <h3 className="text-xl font-bold mt-6 mb-3">Three Modes of Interaction</h3>
    
    <div className="grid md:grid-cols-3 gap-4 mt-4">
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">Automation</h4>
        <p className="text-sm">AI performs specific tasks based on explicit human instructions.</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">Augmentation</h4>
        <p className="text-sm">Humans and AI collaborate as thinking partners, each contributing unique strengths.</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-bold">Agency</h4>
        <p className="text-sm">AI works independently within parameters established by humans.</p>
      </div>
    </div>
    
    <p className="mt-6">
      While AI technology evolves rapidly, the core challenges of human-AI collaboration remain consistent. Botspeak provides lasting cognitive tools rather than temporary techniques, helping you develop the skills necessary to thrive in a future where human-AI collaboration becomes the new literacy for the age of artificial intelligence.
    </p>
    
    <p className="mt-4">
      The Botspeak lessons are primarily given as YouTube videos, but in person and Zoom workshops are available upon request.
    </p>
    
    <div className="mt-6 flex flex-col md:flex-row gap-4 items-start">
      <a 
        href="https://www.youtube.com/@humanitariansai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
          <path d="m10 15 5-3-5-3z"></path>
        </svg>
        YouTube: @humanitariansai
      </a>
      
      <a 
        href="mailto:info@humanitarians.ai"
        className="flex items-center gap-2 text-primary hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
        Email: info@humanitarians.ai
      </a>
    </div>
  </div>
</section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Cognitive Skills Development</h3>
                <p className="text-muted-foreground">
                  Learn essential task decomposition techniques, develop accurate mental models of AI capabilities, and master metacognitive monitoring to evaluate and adjust your interaction strategies based on results.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Communication Mastery</h3>
                <p className="text-muted-foreground">
                  Perfect the art of precise language, contextual framing, and iterative refinement to craft prompts with minimal ambiguity and clear intent that consistently produce superior results.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Critical Thinking Framework</h3>
                <p className="text-muted-foreground">
                  Gain systematic approaches for output evaluation, source triangulation to verify factual claims, and bias recognition skills to identify skewed perspectives in both prompts and responses.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Ethical Reasoning Capabilities</h3>
                <p className="text-muted-foreground">
                  Develop sophisticated reasoning around responsibility attribution, privacy boundary management, and impact assessment to ensure responsible and effective use of AI technologies.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Get Started</h2>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <PrimaryButton href="/contact">
                Join the Community
              </PrimaryButton>
              <SecondaryButton href="/donate">
                Support the Project
              </SecondaryButton>
              <PrimaryButton href="/programs/botspeak/botspeak-details">
                Learn More
              </PrimaryButton>
              <SecondaryButton href="/programs/botspeak/explore">
                Explore Project
              </SecondaryButton>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 
