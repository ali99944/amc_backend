import prisma from "../lib/prisma.js";
import { OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";

export const getPrivacyPolicyController = asyncWrapper(
  async (req, res) => {
    const privacyPolicy = await prisma.privacy_policy.findFirst({
      where: {
        id: 1,
      },
      include: {
        sections: true,
      },
    });

    return res.status(OK_STATUS).json(privacyPolicy);
  }
);

export const updatePrivacyPolicyController = asyncWrapper(
  async (req, res) => {
    const { title, sections } = req.body;

    await Validator.validateNotNull({ title });
    await Validator.isText(title, { minLength: 1, maxLength: 100 });

    const updatedSections = sections.map((section, index) => {
      return {
        id: section.id || `${index + 1}`,
        title: section.title,
        description: section.description,
        points: section.points,
      };
    });

    const updatedPrivacyPolicy = await prisma.privacy_policy.update({
      where: {
        id: "1",
      },
      data: {
        title,
        sections: {
          upsert: updatedSections.map((section) => {
            return {
              where: {
                id: section.id,
              },
              create: section,
              update: section,
            };
          }),
        },
      },
    });

    return res.status(OK_STATUS).json(updatedPrivacyPolicy);
  }
);

