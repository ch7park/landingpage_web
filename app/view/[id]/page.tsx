import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TemplateA } from "@/components/templates/type-a";
import { TemplateB } from "@/components/templates/type-b";
import { TemplateC } from "@/components/templates/type-c";
import { TemplateD } from "@/components/templates/type-d";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { createSupabaseClient, type ProjectRow } from "@/lib/supabase";
import type { LandingPageData } from "@/types/landing-page";

type TemplateType = "A" | "B" | "C" | "D";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string): Promise<ProjectRow | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, status, template_type, content")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (error || !data) return null;
  return data as ProjectRow;
}

export async function generateMetadata({ params }: ViewPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: "페이지를 찾을 수 없습니다",
    };
  }

  const content = project.content as LandingPageData;
  const title = content?.hero?.title || content?.overview?.projectName || "호갱노노 분양광고";
  const description = content?.hero?.highlightText || content?.overview?.projectName || "분양 상세 정보를 확인해 보세요.";
  const ogImage = content?.hero?.heroImageURL || content?.overview?.overviewImageURL;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : baseUrl
        ? `${baseUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
        : null
    : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

function TemplateSwitch({
  templateType,
  content,
  projectId,
}: {
  templateType: string;
  content: LandingPageData;
  projectId: string;
}) {
  const t = (templateType?.toUpperCase?.() || "A") as TemplateType;

  switch (t) {
    case "B":
      return <TemplateB data={content} projectId={projectId} />;
    case "C":
      return <TemplateC data={content} projectId={projectId} />;
    case "D":
      return <TemplateD data={content} projectId={projectId} />;
    case "A":
    default:
      return <TemplateA data={content} projectId={projectId} />;
  }
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project || project.status !== "active") {
    notFound();
  }

  const content = project.content as LandingPageData;
  if (!content || typeof content !== "object") {
    notFound();
  }

  const cf = content.contactForm;
  const isTemplateD = String(project.template_type).toUpperCase() === "D";

  return (
    <main className="min-h-screen bg-gray-100">
      <div className={`mx-auto flex justify-center py-4 ${isTemplateD ? "max-w-6xl px-4" : "max-w-md"}`}>
        <div className="w-full shadow-xl">
          <TemplateSwitch templateType={project.template_type} content={content} projectId={project.id} />
        </div>
      </div>
      <FloatingContactBar phoneNumber={cf?.phoneNumber} kakaoLink={cf?.kakaoLink} />
    </main>
  );
}
