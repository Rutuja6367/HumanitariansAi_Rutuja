import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import PrimaryButton from "@/components/ui/primary-button"
import SecondaryButton from "@/components/ui/secondary-button"

export const metadata: Metadata = {
  title: "AI for Good - Humanitarians AI",
  description: "Leveraging artificial intelligence to address global challenges through cutting-edge research and innovative software solutions",
}

export default function AIForGoodPage() {
  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">AI for Good</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Leveraging AI to address global challenges through cutting-edge research and innovative software solutions. A comprehensive program that combines rigorous academic exploration with practical applications to create positive social impact and ensure AI benefits humanity.
          </p>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/6DEd7rTX7JY?si=UZdT-D8_wzUH3GhF"
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
                AI for Good combines our research and software development initiatives to create meaningful impact. Through research, we promote transparency, fairness, and accountability in AI systems. Through software development, we deploy practical solutions that tackle real-world problems.
              </p>
              <p>
                This dual approach ensures we not only advance ethical AI theory but also create tangible applications that demonstrate AI's potential for positive social change.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">AI Research</h3>
                <p className="text-muted-foreground">
                  We conduct and support research projects aimed at promoting transparency, fairness, and accountability in AI systems. Our research initiatives explore solutions that align with responsible AI development, addressing issues such as bias mitigation, explainability, and equitable access to technology.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">AI for Good Software</h3>
                <p className="text-muted-foreground">
                  We develop and deploy software solutions that harness AI to tackle real-world problems, emphasizing inclusivity and accessibility. These programs reflect our unwavering commitment to leveraging AI for positive social impact and ensuring that the benefits of AI technology are accessible to all.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Responsible AI Innovation</h3>
                <p className="text-muted-foreground">
                  We develop frameworks and methodologies that ensure AI systems are designed with ethical considerations at their core, promoting human values like fairness, transparency, and privacy while minimizing potential harms from algorithmic decision-making.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Educational Resources</h3>
                <p className="text-muted-foreground">
                  We create accessible learning materials that help diverse stakeholders understand AI capabilities, limitations, and ethical implications, bridging knowledge gaps between technical experts and the communities impacted by AI technologies.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <PrimaryButton href="/contact">
                Contact Us
              </PrimaryButton>
              <SecondaryButton href="/donate">
                Support the Project
              </SecondaryButton>
              <PrimaryButton href="/programs/ai-for-good/ai-for-good-details">
                Learn More
              </PrimaryButton>
              <SecondaryButton href="/programs/ai-for-good/explore">
                Explore Projects
              </SecondaryButton>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 
