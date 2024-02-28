import fs from "fs";
import path from "path";
import { Suspense } from "react";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";

import { Section } from "@/components/Common";
import { H2 } from "@/components/Text";
import { AuditHolder } from "@/components/pages/Audits/styled";
import { Loader } from "@/components/Common";
import AuditDashboard from "@/components/pages/Audits/Dashboard";
import { getAudit } from "@/lib/actions/audits";

type MarkdownI = {
  content: string;
};

const getMarkdown = async (display: string): Promise<MarkdownI> => {
  if (!["details", "audit"].includes(display)) {
    display = "details";
  }

  let filePath: string;
  console.log(path.resolve("./public", display + ".md"));
  if (process.env.NODE_ENV === "development") {
    filePath = path.resolve("public", display + ".md");
  } else {
    filePath = path.resolve("./public", display + ".md");
  }
  const fileContents = fs.readFileSync(filePath, "utf8");

  const { content } = matter(fileContents);
  const processedContent = (await remark().use(html).use(remarkGfm).process(content)).toString();

  return {
    content: processedContent,
  };
};

const Audit = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}): Promise<JSX.Element> => {
  const display = searchParams.display ?? "details";
  const { content } = await getMarkdown(display);
  const audit = await getAudit(params.slug);

  return (
    <Section $padCommon $centerH $centerV>
      <AuditHolder $gap="rem2">
        <H2>Audit Dashboard {params.slug}</H2>
        <Suspense fallback={<Loader $size="50px" />}>
          <AuditDashboard audit={audit} content={content} display={display} />
        </Suspense>
      </AuditHolder>
    </Section>
  );
};

export default Audit;
