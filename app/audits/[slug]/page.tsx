import fs from "fs";
import path from "path";
import { Suspense } from "react";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";

import { Section } from "@/components/Common";
import { H2 } from "@/components/Text";
import { AuditSection, AuditHolder } from "@/components/pages/Audits";
import { Loader } from "@/components/Common";
import AuditDashboard from "@/components/pages/Audits/Dashboard";

type MarkdownI = {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const processedContent = (await remark().use(html).use(remarkGfm).process(content)).toString();

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
      <AuditHolder $gap="rem2">
        <AuditSection>
          <H2>Audit Dashboard {params.slug}</H2>
          <Suspense fallback={<Loader $size="50px" />}>
            <AuditDashboard data={data} content={content} display={display} />
          </Suspense>
        </AuditSection>
      </AuditHolder>
    </Section>
  );
};
