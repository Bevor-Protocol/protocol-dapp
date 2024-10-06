import { prisma } from "@/db/prisma.server";
import {
  AuditMembership,
  MembershipStatusType,
  Prisma,
  PrismaPromise,
  RoleType,
} from "@prisma/client";

class AuditorService {
  attestToTerms(membershipId: string, status: boolean): PrismaPromise<AuditMembership> {
    // via an entry of User, we can simultaneously update Auditors, and create
    // a History observation.
    return prisma.auditMembership.update({
      where: {
        id: membershipId,
      },
      data: {
        acceptedTerms: status,
        attestedTerms: true,
      },
    });
  }

  resetAttestations(auditId: string): PrismaPromise<Prisma.BatchPayload> {
    return prisma.auditMembership.updateMany({
      where: {
        auditId,
      },
      data: {
        acceptedTerms: false,
        attestedTerms: false,
      },
    });
  }

  leaveAudit(membershipId: string): PrismaPromise<AuditMembership> {
    return prisma.auditMembership.update({
      where: {
        id: membershipId,
      },
      data: {
        isActive: false,
      },
    });
  }

  addFindings(membershipId: string, findings: string): PrismaPromise<AuditMembership> {
    return prisma.auditMembership.update({
      where: {
        id: membershipId,
      },
      data: {
        findings,
      },
    });
  }

  addRequest(userId: string, auditId: string): PrismaPromise<AuditMembership> {
    return prisma.auditMembership.create({
      data: {
        userId,
        auditId,
        role: RoleType.AUDITOR,
        status: MembershipStatusType.REQUESTED,
      },
    });
  }
}

const auditorService = new AuditorService();
export default auditorService;
