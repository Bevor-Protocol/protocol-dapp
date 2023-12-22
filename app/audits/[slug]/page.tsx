import AuditDashboard from "@/components/pages/AuditDashboard";

import fs from "fs";
import path from "path";

import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";

import { Section } from "@/components/Common";
import { H2 } from "@/components/Text";
import { AuditSection } from "@/components/pages/Audits";

type MarkdownI = {
  data: {
    [key: string]: any;
  };
  content: string;
};

const getMarkdown = async (display: string): Promise<MarkdownI> => {
  if (!["details", "audit"].includes(display)) {
    display = "details";
  }
  const fullPath = path.join("./public", `${display}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);
  const processedContent = (await remark().use(html).process(content)).toString();

  return {
    data,
    content: processedContent,
  };
};

export default async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}): Promise<JSX.Element> => {
  const display = searchParams.display ?? "details";
  const { content, data } = await getMarkdown(display);
  return (
    <Section $fillHeight $padCommon $centerH $centerV>
      <AuditSection>
        <H2>Audit Dashboard {params.slug}</H2>
        <AuditDashboard data={data} content={content} display={display} />
      </AuditSection>
    </Section>
  );
};
