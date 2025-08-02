import PrimaryButton from "@/components/ui/primary-button"
import SecondaryButton from "@/components/ui/secondary-button"
import { Book, Code, Music, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-16 lg:py-20 xl:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 xl:grid-cols-3">
            <div className="flex flex-col justify-center space-y-4 lg:col-span-1">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Harnessing AI for social good.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A 501(c)(3) nonprofit organization dedicated to developing ethical AI solutions that address real-world
                  challenges in education, healthcare, nonprofits, and the arts.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <PrimaryButton href="/about">
                  About Us
                </PrimaryButton>
                <SecondaryButton href="/contact">
                  Contact Us
                </SecondaryButton>
              </div>
            </div>
            <div className="flex items-center justify-center lg:col-span-2">
              <div className="relative w-full aspect-video">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-md"
                  src="https://www.youtube.com/embed/GN7yQntWJHU?si=gTXWalKvsLDP8nbV"
                  title="Humanitarians AI Introduction"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {/* <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">Companies We Work With</h2>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6 items-center justify-center py-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Key Programs Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">KEY PROGRAMS & INITIATIVES</h2>
              <p className="text-muted-foreground max-w-[600px]">
                Our flagship programs that combine AI technology with social impact to create meaningful change.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Fellows Program */}
            <div className="border p-8 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <Book className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">FELLOWS PROGRAM</h3>
              <p className="text-muted-foreground mb-4">
                Join our community of AI researchers and developers working on humanitarian projects. Get mentorship, resources, and support to build impactful AI solutions.
              </p>
              <Link href="/fellows" className="text-sm font-medium underline underline-offset-4 hover:text-foreground">
                Learn more
              </Link>
            </div>

            {/* Lyrical Literacy */}
            <div className="border p-8 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <Music className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">LYRICAL LITERACY</h3>
              <p className="text-muted-foreground mb-4">
                An innovative program that combines AI with creative writing and music to enhance literacy skills. Using technology to make learning more engaging and accessible.
              </p>
              <Link href="/lyrical-literacy" className="text-sm font-medium underline underline-offset-4 hover:text-foreground">
                Learn more
              </Link>
            </div>

            {/* AI for Good */}
            <div className="border p-8 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <Code className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI FOR GOOD</h3>
              <p className="text-muted-foreground mb-4">
                Developing and deploying AI-powered tools for real-world social impact with an emphasis on inclusivity and accessibility.
              </p>
              <Link href="/ai-for-good" className="text-sm font-medium underline underline-offset-4 hover:text-foreground">
                Learn more
              </Link>
            </div>

            {/* Botspeak */}
            <div className="border p-8 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <MessageSquare className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">BOTSPEAK!!</h3>
              {/* <p className="text-muted-foreground mb-4">
                Exploring the fascinating world of AI through hands-on projects and in-depth demos—no rules, just curiosity-driven innovation.
              </p> */}
              <Link href="/botspeak" className="text-sm font-medium underline underline-offset-4 hover:text-foreground">
                Learn more
              </Link>
            </div>
               {/* Blog */}
      <div className="border p-8 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
        <div className="mb-4">
          <MessageSquare className="h-10 w-10" /> {/* Replace with a blog icon if preferred */}
        </div>
        <h3 className="text-xl font-bold mb-2">BLOG</h3>
        <p className="text-muted-foreground mb-4">
          Dive into thought pieces, tutorials, and tech explorations—stories that inspire, inform, and ignite new ideas.
        </p>
        <Link href="/blog" className="text-sm font-medium underline underline-offset-4 hover:text-foreground">
          Read blog
        </Link>
      </div>
          </div>
        </div>
        
      </section>

      {/* Donate Section */}
      <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="mb-4 text-sm font-medium">JOIN OUR MISSION</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl mb-6">HELP US USE AI FOR THE GREATER GOOD</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Your support helps us develop ethical AI solutions that address real-world challenges in education,
              healthcare, nonprofits, and the arts. Join us in our mission to ensure AI benefits everyone, especially
              underserved communities.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <PrimaryButton href="/donate">
                DONATE NOW
              </PrimaryButton>
              <SecondaryButton href="/contact">
                VOLUNTEER
              </SecondaryButton>
              <SecondaryButton href="https://www.youtube.com/@humanitariansai">
                YOUTUBE
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
